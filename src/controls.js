import {ColorMixer, parseColor} from "./color.js";

export class Control {
    constructor(config, props) {
        this.config = config;

        // map pixel props to those spelled out in mapping, e.g. red = red6;
        Object.entries(config.props).forEach(([propName, prop]) => {
            this[propName] = typeof prop == "string" ? props[prop] : prop;
        });
    }
}

export class Pixel {
    // abstracts away all the possible controls in individual pixels
    // so that you can do light8.color = "fuchsia" or bubbles.speed = 5
    constructor({id, label, group, controls}, idx, props, options) {
        this.id = id;
        this.idx = idx;
        this.label = label;
        this.group = group || 0;
        this.controls = {};

        this._allProps = Object.fromEntries(props.map(prop => [prop.name, prop]));
        this.props = {};

        // there are two stages for pixel - the declaration stage where we figure out what needs to be done
        // and then the initiation stage, so this should essentially return a constructor
        // during initiation it will get passed in actual device props
        let usedChannels = new Set();

        Object.entries(controls || {}).forEach(([controlName, config]) => {
            if (typeof config == "string" && this._allProps[config]) {
                // a proxy to prop
                Object.defineProperty(this, controlName, {
                    get: () => this._allProps[config].val,
                    set: val => (this._allProps[config].val = val),
                });
            } else if (config.type) {
                if (options[controlName]) {
                    config = {...config, ...options[controlName]};
                }

                // a config class that maps to one of the pixel controls below
                let control =
                    typeof config.type == "string"
                        ? new pixelControls[config.type](config, this._allProps)
                        : new config.type(config, this._allProps);

                // colour controls are write-only - there is no honest way to reconstruct a hex from
                // channel values once white and amber are in the mix, so they just don't define a getter
                let descriptor = {set: val => control.set(val)};
                if (control.get) {
                    descriptor.get = () => control.get();
                }

                Object.defineProperty(this, controlName, descriptor);
                this.controls[controlName] = control;

                // the goal is to set each of the controls to be a setter/getter
                // and all their props are accessible directly as well
                Object.entries(config.props).forEach(([propName, propField]) => {
                    let prop = this._allProps[propField];

                    if (!prop) {
                        return;
                    }

                    this.props[propName] = prop;
                    if (!Object.hasOwn(this, propName)) {
                        Object.defineProperty(this, propName, {
                            get: () => prop.val,
                            set: val => (prop.val = val),
                        });
                    }
                    usedChannels.add(prop.channel);
                });
            }
        });

        this.channels = [...usedChannels];

        let features = ["color", "red", "white", "dimmer", "strobe", "amber", "uv", "pan", "tilt", "warmth"];
        this.features = features.filter(feature => feature in this);
    }
}

// a fixture's colour is whatever its emitters can be talked into producing together. red/green/blue are
// always there; white and amber join in when the fixture has them, and get substituted into the mix
// rather than piled on top of a full RGB triplet.
//
// uv deliberately stays out of it - it sits outside the visible gamut, so folding it in would muddy
// every colour without buying any accuracy. it stays an independent channel.
class LEDLight extends Control {
    defaultVal = "#000";

    constructor(config, props) {
        super(config, props);

        // amber and the dimmer are ours to work out but not ours to own. both keep their own slider on
        // the fixture, so we write what the mix asks for and leave whoever is driving the frame free to
        // put something else there - the amber a colour earns is a starting point, not a verdict
        this.amberProp = config.amber ? props[config.amber] : null;

        // a dimmer of this pixel's own lets us mix the colour at full and send the level down the
        // dimmer channel instead. we only take one on if it's a plain 0-255 ramp - anything with stops
        // or ranges means the channel does more than dim, and writing a level to it would misfire
        let dimmer = config.dimmer ? props[config.dimmer] : null;
        let plainRamp = dimmer?.stops?.length == 2 && dimmer.stops[0].chVal === 0 && dimmer.stops[1].chVal === 255;
        this.dimmerProp = plainRamp ? dimmer : null;

        this.mixer = new ColorMixer({
            white: Boolean(this.white),
            amber: Boolean(this.amberProp),
            substitute: config.substitute !== false,
            linear: Boolean(config.linear),
            emitters: config.emitters || {},
            flux: config.flux || {},
            strength: config.strength || {},
        });
        this.mixer.usesDimmer = Boolean(this.dimmerProp);

        // what the colour worked out for the channels we don't own: the brightness waiting on the
        // dimmer, and the amber the colour earned before anyone asks for more
        this.level = 0;
        this.amberMix = 0;

        // reused so that setting a colour every frame doesn't allocate
        this._mix = {red: 0, green: 0, blue: 0, white: 0, amber: 0, level: 0};
    }

    set(value) {
        let mix = this.mixer.split(value, this._mix);
        this.level = mix.level;
        this.amberMix = mix.amber;

        this.red.dmx = Math.round(mix.red * 255);
        this.green.dmx = Math.round(mix.green * 255);
        this.blue.dmx = Math.round(mix.blue * 255);

        if (this.white) {
            this.white.dmx = Math.round(mix.white * 255);
        }
        if (this.amberProp) {
            this.amberProp.dmx = Math.round(mix.amber * 255);
        }
    }
}

let pixelControls = {
    // all three names land on the same class - which emitters actually get driven is decided by
    // the props the fixture hands over, not by the type string
    "rgb-light": LEDLight,
    "rgbw-light": LEDLight,
    "rgbwa-light": LEDLight,

    "cww-light": class extends Control {
        defaultVal = "#000";

        set(value) {
            let [h, s, l] = parseColor(value).hsl();

            // we are dimming the opposite light (when going towards cool, we dim warm), so here we are inverting
            let dmxVal = Math.round((1 - s) * 255);

            if (h > 180) {
                this.cool_white.dmx = 255;
                this.warm_white.dmx = dmxVal;
            } else {
                this.cool_white.dmx = dmxVal;
                this.warm_white.dmx = 255;
            }
            this.dimmer.dmx = Math.round(l * 255);
        }
    },

    "w-light": class extends Control {
        defaultVal = "#000";

        set(value) {
            let [r, g, b, a] = parseColor(value).rgba();
            let w = Math.max(r, g, b);

            this.white.dmx = Math.round(w * a);
        }
    },

    degrees: class extends Control {
        constructor(config, props) {
            super(config, props);

            // two channel rotation means we have 255 * 255 values to express all of degrees
            this.dmxPerDeg = 65025 / this.coarse.degrees;
        }

        get defaultVal() {
            // default val comes in degrees from our old-style fixtures, and in the normalized form from
            // the json configs
            return this.config.normalized ? this.coarse.degrees * this.coarse.defaultVal : this.coarse.defaultVal;
        }

        get() {
            // convert channel DMX vals to degrees
            if (this.fine) {
                return (this.coarse.dmx * 255 + this.fine.dmx) / this.dmxPerDeg;
            } else {
                return this.coarse.dmx / this.dmxPerDeg;
            }
        }

        set(degrees) {
            if (this.config.flip) {
                degrees = this.coarse.degrees - degrees;
            }

            let dmx = Math.round(degrees * this.dmxPerDeg);

            this.coarse.dmx = Math.floor(dmx / 255);
            if (this.fine) {
                this.fine.dmx = dmx % 255;
            }
        }
    },
};
