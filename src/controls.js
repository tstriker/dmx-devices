import chroma from "chroma-js";

import {colorToRGBW} from "./utils.js";

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
    constructor({id, label, group, controls}, idx, props) {
        this.id = id;
        this.idx = idx;
        this.label = label;
        this.group = group || 0;
        this.controls = controls;

        this._allProps = Object.fromEntries(props.map(prop => [prop.name, prop]));
        this.props = {};

        // there are two stages for pixel - the declaration stage where we figure out what needs to be done
        // and then the initiation stage, so this should essentially return a constructor
        // during initiation it will get passed in actual device props
        let usedChannels = new Set();

        Object.entries(controls).forEach(([controlName, config]) => {
            let setter, getter;
            if (typeof config == "string" && this._allProps[config]) {
                // a proxy to prop
                Object.defineProperty(this, controlName, {
                    get: () => this._allProps[config].val,
                    set: val => (this._allProps[config].val = val),
                });
            } else if (config.type) {
                // a config class that maps to one of the pixel controls below
                let control =
                    typeof config.type == "string"
                        ? new pixelControls[config.type](config, this._allProps)
                        : new config.type(config, this._allProps);

                Object.defineProperty(this, controlName, {
                    get: () => control.get(),
                    set: val => control.set(val),
                });

                // the goal is to set each of the controls to be a setter/getter
                // and all their props are accessible directly as well
                Object.entries(config.props).forEach(([propName, propField]) => {
                    let prop = this._allProps[propField];

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
        this.features = ["color", "dimmer", "strobe", "white", "amber", "uv", "pan", "tilt"].filter(
            feature => feature in this
        );
    }
}

let pixelControls = {
    "rgb-light": class extends Control {
        get() {
            chroma(this.red.val, this.green.val, this.blue.val).hex();
        }

        set(value) {
            let [r, g, b, a] = chroma(value).rgba();
            [this.red.dmx, this.green.dmx, this.blue.dmx] = [Math.round(r * a), Math.round(g * a), Math.round(b * a)];
        }
    },

    "rgbw-light": class extends Control {
        get() {
            let color = chroma(this.red.val, this.green.val, this.blue.val);
            return color.hex();
        }
        set(value) {
            let [r, g, b, a] = chroma(value).rgba();
            let w = colorToRGBW(value)[3];

            [this.red.dmx, this.green.dmx, this.blue.dmx, this.white.dmx] = [
                Math.round(r * a),
                Math.round(g * a),
                Math.round(b * a),
                Math.round(w * a),
            ];
        }
    },

    "w-light": class extends Control {
        get() {
            return chroma(this.white, this.white, this.white).hex();
        }
        set(value) {
            let [r, g, b, a] = chroma(value).rgba();
            let w = Math.max(r, g, b);

            this.white.dmx = Math.round(w * a);
        }
    },

    degrees: class extends Control {
        constructor(config, props) {
            super(config, props);

            // how many degrees to we fit in the coarse math
            // e.g. 1 DMX channel value if it's 540 degrees total would be 540/255 = 2.11
            // the fine control then takes care of the res
            this.degPerDMX = this.coarse.degrees / 255;
        }

        get() {
            // convert channel DMX vals to degrees
            let degrees = this.coarse.dmx * this.degPerDMX;
            degrees += (this.fine.dmx / 255) * this.degPerDMX;
            return degrees;
        }

        set(degrees) {
            degrees = degrees % this.coarse.degrees;

            let coarseDMX = Math.floor(degrees / this.degPerDMX);
            this.coarse.dmx = coarseDMX;

            let fineDegrees = Math.max(degrees - coarseDMX * this.degPerDMX, 0);
            this.fine.dmx = Math.floor(fineDegrees * (255 / this.degPerDMX));
        }
    },
};
