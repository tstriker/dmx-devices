import chroma from "chroma-js";

import {colorToRGBW} from "./utils.js";

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
            if (typeof config == "string") {
                // a proxy to prop
                getter = () => this._allProps[config].val;
                setter = val => (this._allProps[config].val = val);
            } else if (config.set) {
                // we have ourselves a getter/setter function as a control
                getter = () => config.get(this.props);
                setter = val => config.set(this.props, val);
            } else if (config.type) {
                // a config class that maps to one of the pixel controls below
                getter = () => pixelControls[config.type].get(this.props);
                setter = val => pixelControls[config.type].set(this.props, val);
            }

            Object.defineProperty(this, controlName, {get: getter, set: setter});

            // the goal is to set each of the controls to be a setter/getter
            // and all their props are accessible directly as well
            Object.entries(config.props || {}).forEach(([propName, propField]) => {
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
        });

        this.channels = [...usedChannels];
    }
}

let pixelControls = {
    "rgb-light": {
        get(props) {
            chroma(props.red.val, props.green.val, props.blue.val).hex();
        },
        set(props, value) {
            let [r, g, b, a] = chroma(value).rgba();
            [props.red.dmx, props.green.dmx, props.blue.dmx] = [
                Math.round(r * a),
                Math.round(g * a),
                Math.round(b * a),
            ];
        },
    },

    "rgbw-light": {
        get(props) {
            let color = chroma(props.red.val, props.green.val, props.blue.val);
            return color.hex();
        },
        set(props, value) {
            let [r, g, b, a] = chroma(value).rgba();
            let w = colorToRGBW(value)[3];

            [props.red.dmx, props.green.dmx, props.blue.dmx, props.white.dmx] = [
                Math.round(r * a),
                Math.round(g * a),
                Math.round(b * a),
                Math.round(w * a),
            ];
        },
    },

    "w-light": {
        get(props) {
            return chroma(props.white, props.white, props.white).hex();
        },
        set(props, value) {
            let [r, g, b, a] = chroma(value).rgba();
            let w = Math.max(r, g, b);

            props.white.dmx = Math.round(w * a);
        },
    },
};
