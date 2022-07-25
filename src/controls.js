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

        Object.entries(props).map(([key, propName]) => {
            // control has localised names for each device prop as specified in the mapping
            // here we make it possible to access .red1 via .red, and so on
            this[key] = propByName[propName];
        });

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

    get props() {
        // returns all props for this device, in case you want to put them on screen, or are looking for something
        // specific
        return Object.values(this).filter(obj => obj instanceof Prop);
    }

    get channels() {
        return Object.values(this.props).map(prop => prop.channel);
    }
}

export class RGBLightControl extends Control {
    static type = "rgb-light";

    constructor(control, props) {
        super(control, props);
    }

    get color() {
        return chroma(this.red?.val, this.green?.val, this.blue?.val).hex();
    }

    set color(value) {
        let color = chroma(value);
        [this.red, this.green, this.blue] = color.rgb();
    }
}

export class RGBWLightControl extends Control {
    static type = "rgbw-light";

    constructor(control, props) {
        super(control, props);
    }

    get color() {
        return chroma(this.red?.val, this.green?.val, this.blue?.val).hex();
    }

    set color(value) {
        let [r, g, b] = chroma(value).rgb();
        let w = colorToRGBW(value)[3];
        [this.red, this.green, this.blue, this.white] = [r, g, b, w];
    }
}
