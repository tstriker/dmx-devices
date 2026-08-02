import chroma from "chroma-js";

// colour handling for LED fixtures.
//
// the mapping is deliberately one-directional: once white or amber emitters are in play there is no
// honest way to get the original hex back out of the channel values, so we don't pretend to. we take
// a colour and work out how to best express it with whatever emitters the fixture happens to have.

let colorCache = new Map();
let maxCacheSize = 20000;
export function parseColor(color) {
    if (color && typeof color === "object" && color._rgb) {
        return color;
    }

    let parsed = typeof color === "string" ? color : color.hex ? color.hex() : color;
    let result = colorCache.get(parsed);
    if (result !== undefined) {
        // move to the end to mark as most recently used
        colorCache.delete(parsed);
        colorCache.set(parsed, result);
        return result;
    }

    result = chroma(parsed);
    if (colorCache.size >= maxCacheSize) {
        let iter = colorCache.keys();
        for (let i = 0; i < 100; i += 1) {
            colorCache.delete(iter.next().value);
        }
    }

    colorCache.set(parsed, result);
    return result;
}

function hexVal(code) {
    // 0-9, a-f, A-F -> 0..15, and -1 for anything else
    if (code >= 48 && code <= 57) {
        return code - 48;
    } else if (code >= 97 && code <= 102) {
        return code - 87;
    } else if (code >= 65 && code <= 70) {
        return code - 55;
    }
    return -1;
}

function parseHex(hex, out) {
    // fills out with normalized rgba, or bails with false if this isn't a plain hex string.
    // tweens burn through a fresh colour every frame, so the cache never hits for them - going
    // straight at the char codes keeps the common case off chroma entirely
    if (hex.charCodeAt(0) !== 35) {
        return false;
    }

    let digits = hex.length - 1;
    let short = digits === 3 || digits === 4;
    if (!short && digits !== 6 && digits !== 8) {
        return false;
    }

    let step = short ? 1 : 2;
    let count = short ? digits : digits / 2;

    for (let i = 0; i < count; i += 1) {
        let pos = 1 + i * step;
        let hi = hexVal(hex.charCodeAt(pos));
        if (hi < 0) {
            return false;
        }

        let val;
        if (short) {
            val = hi * 17;
        } else {
            let lo = hexVal(hex.charCodeAt(pos + 1));
            if (lo < 0) {
                return false;
            }
            val = hi * 16 + lo;
        }
        out[i] = val / 255;
    }

    if (count === 3) {
        out[3] = 1;
    }
    return true;
}

export function toRGBA(color, out) {
    // normalized 0..1 rgba, written into out so the hot path doesn't allocate
    if (typeof color === "string" && parseHex(color, out)) {
        return out;
    }

    let [r, g, b, a] = parseColor(color).rgba();
    out[0] = r / 255;
    out[1] = g / 255;
    out[2] = b / 255;
    out[3] = a;
    return out;
}

export function toLinear(val) {
    return val <= 0.04045 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
}

export function toGamma(val) {
    return val <= 0.0031308 ? val * 12.92 : 1.055 * Math.pow(val, 1 / 2.4) - 0.055;
}

function clamp(val) {
    // also mops up the float dust that subtraction leaves behind
    return val <= 0 ? 0 : val >= 1 ? 1 : val;
}

export let emitterColors = {
    // roughly where a ~590nm amber LED lands in sRGB. nudge towards #ffbf00 for the yellower ones
    amber: "#ffa000",

    // par whites run anywhere from 2700K to 6500K. a neutral one is the safe assumption, but a fixture
    // that knows better should say so - a warm die treated as neutral warms up every colour it touches
    white: "#ffffff",
};

export let mixing = {
    // which emitters the colour mix is allowed to reach for. set either to false and it drops out on
    // every fixture everywhere - no fixture config to edit, nothing to rebuild, and it holds for
    // fixtures built afterwards too. rgb goes back to carrying the colour on its own.
    //
    // it's read on every mix rather than at construction, so flipping it at runtime works too, but it's
    // meant as a one-line change to commit when the mixing needs to be off.
    //
    // this only stops the mix reaching for an emitter. a channel driven directly, like a fixture's own
    // amber control, carries on regardless - so turning the mixing off doesn't cost you hold of the
    // fixture, it just stops it deciding things on your behalf.
    //
    // the per-group RGB/RGBW/RGBWA switch in the ui is the considered, per-venue version of this
    white: true,
    amber: true,
};

export let emitterStrength = {
    // how far each extra emitter gets to go, where 1 is as far as its own output supports - all the
    // amber the colour could stand in for, or all the white it could carry on top.
    //
    // both are held to half. letting an emitter go as far as it could is what makes a fixture sound like
    // its white die rather than like itself, and it leans the result on figures we're estimating - what
    // the die puts out, and what colour it really is. at half the extras fill in behind the rgb triplet
    // instead of taking over from it, and a room where only some pars carry the extra emitters holds
    // together better
    white: 0.5,
    amber: 0.5,
};

export let emitterFlux = {
    // how much light each emitter puts out at full drive, relative to green. par cans build their
    // colours from same-power dies, and those dies are nowhere near equally bright - blue is feeble,
    // amber is weak for its position in the spectrum, and a phosphor white beats any single colour.
    // ballpark figures for the 3W-class dies that go into RGBW/RGBWA pars.
    red: 0.72,
    green: 1,
    blue: 0.33,
    white: 1.2,
    amber: 0.36,
};

export class ColorMixer {
    // splits a colour across an RGB triplet plus whatever extra emitters the fixture has.
    //
    // the two extras earn their keep differently, which is why they're handled differently.
    //
    // amber stands in: it takes over part of the red and green, which keep the rest, and it only takes
    // on as much as its own output can light back up. added on top instead it would bend the hue, and
    // taking on more than it can give back is what leaves a fixture sagging around the warm end.
    //
    // white goes on top: by the time a colour is heading for white the rgb channels have no room left,
    // so trading them for the die buys nothing and costs a visible drop on the channels carrying the
    // colour. the light has to come from somewhere, and the die is what's spare.
    //
    // both are scaled by how much the colour is asking for that particular emitter, so each one comes in
    // where it belongs and tails off rather than snapping in and out.
    //
    // every step is piecewise-linear in the input, so fades move smoothly instead of snapping the way
    // an HSI-sector conversion does around neutral colours.
    constructor({
        white = false,
        amber = false,
        substitute = true,
        linear = false,
        emitters = {},
        flux = {},
        strength = {},
    } = {}) {
        // what the fixture is built with, as opposed to what the mix currently uses
        this.whiteEmitter = white;
        this.amberEmitter = amber;

        this.hasWhite = white;
        this.hasAmber = amber;

        // substitute keeps the output matched to the requested colour; turning it off leaves RGB at
        // full and piles the extra emitters on top for maximum output at the cost of accuracy
        this.substitute = substitute;

        // by default we mix in gamma space, which is what the rest of the library assumes when it
        // writes a colour straight out to DMX. flipping this on is more correct physically, but only
        // if the fixture actually responds linearly - and it makes everything markedly dimmer
        this.linear = linear;

        this.amberVec = this._vector(emitters.amber || emitterColors.amber);
        this.whiteVec = this._vector(emitters.white || emitterColors.white);

        let lumens = {...emitterFlux};
        for (let emitter in lumens) {
            // a zero or missing figure would take the mix down with it, so bogus overrides fall back
            if (flux[emitter] > 0) {
                lumens[emitter] = flux[emitter];
            }
        }

        this.whiteStrength = strength.white >= 0 ? strength.white : emitterStrength.white;
        this.amberStrength = strength.amber >= 0 ? strength.amber : emitterStrength.amber;

        // how hard we have to drive the substitute to give back the light we take off RGB. a white
        // die is bright, but nowhere near as bright as red, green and blue put together, so it needs
        // more drive than it displaces; amber needs a lot more still
        this.whiteRatio = this._ratio(this.whiteVec, lumens, lumens.white);
        this.amberRatio = this._ratio(this.amberVec, lumens, lumens.amber);

        // set by whoever owns the fixture's dimmer, so the colour goes out at full and the level rides
        // the dimmer channel instead of being ground into the emitters
        this.usesDimmer = false;

        this._rgba = [0, 0, 0, 1];
    }

    _ratio(vec, lumens, emitterLumens) {
        // light the emitter has to give back per unit of rgb it takes over
        let displaced = lumens.red * vec[0] + lumens.green * vec[1] + lumens.blue * vec[2];
        return displaced / emitterLumens;
    }

    _headroom(vec, r, g, b, floor) {
        // the most of this emitter we could lay over the colour before some channel runs out. a channel
        // the emitter doesn't light never constrains it - it stays behind for the RGB remainder to cover
        let headroom = Infinity;
        for (let i = 0; i < 3; i += 1) {
            let weight = vec[i];
            if (weight > 0) {
                let available = ((i === 0 ? r : i === 1 ? g : b) - floor) / weight;
                if (available < headroom) {
                    headroom = available;
                }
            }
        }
        return Number.isFinite(headroom) ? headroom : 0;
    }

    get mixMode() {
        if (this.hasAmber) {
            return "rgbwa";
        }
        return this.hasWhite ? "rgbw" : "rgb";
    }

    set mixMode(mode) {
        // sit an emitter out of the mix - for hearing what each one brings, or for a fixture whose
        // extra dies you'd rather leave alone. asking for more than the fixture has is a no-op
        this.hasWhite = this.whiteEmitter && mode != "rgb";
        this.hasAmber = this.amberEmitter && mode == "rgbwa";
    }

    _vector(color) {
        let rgba = toRGBA(color, [0, 0, 0, 1]);
        let vec = [rgba[0], rgba[1], rgba[2]];
        return this.linear ? vec.map(toLinear) : vec;
    }

    split(color, out) {
        let rgba = toRGBA(color, this._rgba);
        let a = rgba[3];

        let r = rgba[0] * a;
        let g = rgba[1] * a;
        let b = rgba[2] * a;

        if (this.linear) {
            r = toLinear(r);
            g = toLinear(g);
            b = toLinear(b);
        }

        // the level the colour is asking for, kept aside so a fixture with a dimmer can carry it on the
        // dimmer channel and mix its colour at full. a dim colour ground into the emitters loses most of
        // its resolution down there, and the emitter split shifts about as a scene fades
        let level = Math.max(r, g, b);
        if (this.usesDimmer) {
            if (level > 0) {
                r /= level;
                g /= level;
                b /= level;
            } else {
                r = g = b = 0;
            }
        }
        out.level = level;

        // how lit the colour is, and the reference the extras get measured against. taken before the
        // mix moves anything about, so it's the level that was asked for rather than what's left
        let peak = Math.max(r, g, b);

        let white = 0;
        if (this.hasWhite && mixing.white) {
            // whatever all three channels have in common is exactly what a white emitter is for
            let vec = this.whiteVec;
            let common = this._headroom(vec, r, g, b, 0);

            if (this.substitute) {
                // white goes on top of the colour rather than in place of it. by the time a colour is
                // heading for white the rgb channels are already near the ceiling, so trading them away
                // for the die buys nothing and costs the drop you can see on the channels carrying the
                // colour. adding it takes the light up instead, which is what going whiter should do
                //
                // scaled by how neutral the colour is, so the die works the greys and pastels it's good
                // for and stays out of colours that are still colours, where it would only wash them out
                let neutrality = peak > 0 ? Math.min(r, g, b) / peak : 0;

                white = neutrality * this.whiteStrength * Math.min(common * this.whiteRatio, 1);
            } else {
                white = common;
            }
        }

        let amber = 0;
        if (this.hasAmber && mixing.amber) {
            let vec = this.amberVec;

            // amber only gets at the colour left in the mix, never at the neutral underneath it. that
            // floor is white's job, and it keeps the amber die - the one whose output we're least sure
            // of - out of the greys and pastels, where being off by a bit reads as a tint
            let floor = Math.min(r, g, b);
            let headroom = this._headroom(vec, r, g, b, floor);

            if (this.substitute) {
                // how far the leftover colour leans amber, peaking where it matches the die's own hue
                // and tailing off towards plain red and plain green. taking every last bit of amber we
                // could get away with is what makes the die snap to full the moment a red warms up, and
                // one emitter shouting over the others is the thing you notice in the beam
                let lean = 0;
                let chromaRed = r - floor;
                let chromaGreen = g - floor;
                if (chromaRed > 0 && chromaGreen > 0) {
                    let balance = (chromaGreen * vec[0]) / (chromaRed * vec[1]);
                    lean = balance < 1 ? balance : 1 / balance;
                }

                // same deal as white, and amber needs it more - a single amber die is no match for the
                // red and green it stands in for, so it only ever takes over a slice of them
                let taken = lean * this.amberStrength * Math.min(headroom, 1 / this.amberRatio);
                amber = taken * this.amberRatio;
                r -= taken * vec[0];
                g -= taken * vec[1];
                b -= taken * vec[2];
            } else {
                amber = headroom;
            }
        }

        out.red = clamp(r);
        out.green = clamp(g);
        out.blue = clamp(b);
        out.white = clamp(white);
        out.amber = clamp(amber);
        return out;
    }
}
