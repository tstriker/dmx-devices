import {round} from "./utils.js";
import {Prop} from "./props.js";
import {Pixel} from "./controls.js";

export class Device {
    constructor({address, label, props, pixels, render, onChange, options, resetDMX = true, ...other}) {
        this.address = address;
        this.label = label;
        this.deviceOptions = {};
        this.dmx = {};
        this.onChange = onChange;
        this.render = render;

        this._externalUpdate = false;
        this._notifyTimeout = null;

        this.props = [];

        this.options = options || {}; // custom options for props/controls/etc. for now it's just flip for heads

        // populate props
        Object.entries(props).forEach(([key, config], idx) => {
            // init all the props
            // and if we are modifying another prop, pass in the reference so we can work with that
            let modifies = config.modifies ? this[config.modifies] : null;

            // channel can be explicitly specified or will be assumed from the packing order
            let propChannel = config.channel || idx + 1;
            propChannel = address + propChannel - 1;
            let prop = new Prop({
                ...config,
                name: key,
                channel: propChannel,
                modifies,
                onPropChange: this.onPropChange.bind(this),
            });

            if (resetDMX) {
                // if specified will reset DMX to default values / zeroes, making output deterministic
                // avoid if you are not controlling all aspects of the device (e.g. when you just want to change
                // a few channels and don't want to touch the rest)
                if (!prop.modifies && prop.channel >= 1 && prop.channel <= 512) {
                    this[prop] = prop.defaultVal || 0;
                }
            }
            this[key] = prop;
            this.props.push(prop);
        });

        this.pixels = [];

        pixels = (pixels || []).map((pixel, idx) => new Pixel(pixel, idx + 1, this.props, this.options));
        pixels.forEach(pixel => {
            // math the specific pixel so we can go straight to this.light8 and so on
            this[pixel.id] = pixel;

            // establish the nested groups in pixels, so that we can support two-row lights and so on
            let group = pixel.group;
            this.pixels[group] = this.pixels[group] || [];
            this.pixels[group].push(pixel);
        });

        let controlChannels = this.pixels
            .flat()
            .map(pixel => pixel.channels)
            .flat();
        this.unmanagedProps = this.props.filter(prop => !controlChannels.includes(prop.channel));

        // tell API consumers what features all of this device's pixels have
        let deviceFeatures = [
            "color",
            "red", // this is to tell apart RGB from pseudo colors
            "dimmer",
            "strobe",
            "white",
            "amber",
            "uv",
            "pan",
            "tilt",
            "wheel",
            "spot",
            "gobo",
        ];
        deviceFeatures = deviceFeatures.filter(feature => feature in this || pixels.every(pixel => feature in pixel));
        this.features = deviceFeatures;

        // proxy anything else through - this allows us to inject custom attributes on construction time
        Object.entries(other).forEach(([key, val]) => {
            this[key] = val;
        });

        return new Proxy(this, {
            set(target, prop, value, receiver) {
                if (target[prop] instanceof Prop) {
                    // handle prop bits
                    target[prop].val = value;
                    return true;
                } else {
                    // if it's not a prop deal with it the normal way
                    return Reflect.set(target, prop, value, receiver);
                }
            },
        });
    }

    onPropChange(ch, val, modifies) {
        if (modifies) {
            this.dmx[ch] = parseInt(modifies?.cur?.chVal || 0) + parseInt(val);
        } else {
            this.dmx[ch] = val;
        }

        if (!this._notifyTimeout && !this._externalUpdate) {
            this._notifyTimeout = setTimeout(() => {
                this._notifyTimeout = null;
                this.onChange(this.dmx);
            });
        }
    }

    updateProps(dmx) {
        this._externalUpdate = true;
        this.props.forEach(prop => {
            if (dmx[prop.channel] != null) {
                let val = dmx[prop.channel];
                if (prop.modifies) {
                    val = val - prop.modifies.cur.chVal;
                }
                prop.dmx = val;
            }
        });
        this._externalUpdate = false;
    }

    reset() {
        for (let prop of this.props) {
            prop.val = prop.defaultVal;
        }
    }
}

export function ModelFactory({config, ...modelInfo}) {
    // ended up using a func instead of subclassing, as the constructor gets fired too early for JS classes:
    // before the props have actually initialized, and we need it to run after that
    if (!Array.isArray(config)) {
        config = [config];
    }

    let byConfigName = Object.fromEntries(config.map(c => [c.name, c]));

    class Model {
        static configNames = config.map(c => c.name);

        constructor(address, {config, ...options}) {
            let channelConfig = byConfigName[config];
            if (!channelConfig) {
                throw `Could not find config '${config}' for ${modelInfo.model}`;
            }
            return new Device({address, ...modelInfo, ...channelConfig, ...options});
        }
    }
    Object.entries(modelInfo).forEach(([field, val]) => {
        Model[field] = val;
    });

    return Model;
}
