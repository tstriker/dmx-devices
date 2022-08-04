import chroma from "chroma-js";

import {colorToRGBW} from "./utils.js";
import {Prop} from "./props.js";

export class Control {
    // type of the control - this value is used in device configs
    static type = "";

    constructor({props, ...control}, deviceProps) {
        // somehow the static properties are not accessible on the actual instantiated class, so we need
        // to redefine type.
        Object.entries(control).forEach(([field, val]) => {
            this[field] = val;
        });

        let propByName = Object.fromEntries(deviceProps.map(prop => [prop.name, prop]));

        this.props = [];
        Object.entries(props).map(([key, propName]) => {
            // control has localised names for each device prop as specified in the mapping
            // here we make it possible to access .red1 via .red, and so on
            this[key] = propByName[propName];
            this.props.push(propByName[propName]);
        });
        this.channels = Object.values(this.props).map(prop => prop.channel);

        // intercept setting props
        return new Proxy(this, {
            set(target, property, value, receiver) {
                if (target[property] instanceof Prop) {
                    target[property].val = value;
                    return true;
                } else {
                    return Reflect.set(target, property, value, receiver);
                }
            },
        });
    }
}

export class RGBLightControl extends Control {
    static type = "rgb-light";

    constructor(control, props) {
        super(control, props);
    }

    get color() {
        return chroma(this.red.val, this.green.val, this.blue.val).hex();
    }

    set color(value) {
        let [r, g, b, a] = chroma(value).rgba();
        [this.red, this.green, this.blue] = [Math.round(r * a), Math.round(g * a), Math.round(b * a)];
    }
}

export class RGBWLightControl extends Control {
    static type = "rgbw-light";

    constructor(control, props) {
        super(control, props);
    }

    get color() {
        let color = chroma(this.red.val, this.green.val, this.blue.val);
        return color.hex();
    }

    set color(value) {
        let [r, g, b, a] = chroma(value).rgba();
        let w = colorToRGBW(value)[3];

        [this.red, this.green, this.blue, this.white] = [
            Math.round(r * a),
            Math.round(g * a),
            Math.round(b * a),
            Math.round(w * a),
        ];
    }
}

export class WLightControl extends Control {
    static type = "w-light";

    constructor(control, props) {
        super(control, props);
    }

    get color() {
        return chroma(this.white, this.white, this.white).hex();
    }

    set color(value) {
        let [r, g, b, a] = chroma(value).rgba();
        let w = Math.max(r, g, b);

        this.white = Math.round(w * a);
    }
}
