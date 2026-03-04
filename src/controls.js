import chroma from "chroma-js";

import {parseColor, colorToRGBW} from "./utils.js";

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

                Object.defineProperty(this, controlName, {
                    get: () => control.get(),
                    set: val => control.set(val),
                });
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
                            set: val => (prop = val),
                        });
                    }
                    usedChannels.add(prop.channel);
                });
            }
        });

        this.channels = [...usedChannels];

        let features = ["color", "red", "white", "dimmer", "strobe", "white", "amber", "uv", "pan", "tilt", "warmth"];
        this.features = features.filter(feature => feature in this);
    }
}

let pixelControls = {
    "rgb-light": class extends Control {
        defaultVal = "#000";

        get() {
            chroma(this.red.val, this.green.val, this.blue.val).hex();
        }

        set(value) {
            let [r, g, b, a] = parseColor(value).rgba();
            [this.red.dmx, this.green.dmx, this.blue.dmx] = [Math.round(r * a), Math.round(g * a), Math.round(b * a)];
        }
    },

    "rgbw-light": class extends Control {
        defaultVal = "#000";

        get() {
            let color = chroma(this.red.val, this.green.val, this.blue.val);
            return color.hex();
        }
        set(value) {
            let [r, g, b, a] = parseColor(value).rgba();
            let w = colorToRGBW(value)[3];

            [this.red.dmx, this.green.dmx, this.blue.dmx, this.white.dmx] = [
                Math.round(r * a),
                Math.round(g * a),
                Math.round(b * a),
                Math.round(w * a),
            ];
        }
    },

    "cww-light": class extends Control {
        defaultVal = "#000";

        get() {
            // convert warm white, cool white and dimmer into a hex color.
            // we construct HSL, where L=dimmer, H=red (0-180)/blue(180-360), S=how far out of balance we are
            let warmWhite = this.warm_white.val;
            let coolWhite = this.cool_white.val;
            let maxIntensity = Math.max(warmWhite, coolWhite);

            let [h, s, l] = [25, 0, this.dimmer.val];
            if (maxIntensity) {
                if (warmWhite >= coolWhite) {
                    h = 25; // yellowish
                    s = coolWhite / maxIntensity;
                } else {
                    h = 217; // blueish
                    s = warmWhite / maxIntensity;
                }
            }
            return chroma.hsl(h, s, l).hex();
        }
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

        get() {
            return chroma(this.white.val, this.white.val, this.white.val).hex();
        }
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
