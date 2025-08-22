import {Prop} from "./props.js";
import {Pixel} from "./controls.js";

export class Device {
    constructor({address, label, props, pixels, render, options, resetDMX = true, ...other}) {
        this.address = address;
        this.label = label;
        this.deviceOptions = {};
        this.dmx = {};
        this.render = render;

        this._pendingChanges = {};
        this._externalUpdate = false;

        this.props = [];

        this.options = options || {}; // custom options for props/controls/etc. for now it's just flip for heads

        // populate props
        Object.entries(props).forEach(([key, config], idx) => {
            // init all the props
            // channel can be explicitly specified or will be assumed from the packing order
            let propChannel = config.channel || idx + 1;
            propChannel = address + propChannel - 1;
            let prop = new Prop({
                ...config,
                name: key,
                channel: propChannel,
                onPropChange: this.onPropChange.bind(this),
            });
            this[key] = prop;
            this.props.push(prop);
        });
        this.reset();

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
            "speed",
        ];
        deviceFeatures = deviceFeatures.filter(
            feature => feature in this || (pixels.length && pixels.some(pixel => feature in pixel))
        );
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

    onPropChange(ch, val) {
        if (this._externalUpdate) {
            return;
        }

        this.dmx[ch] = val;
        this._pendingChanges[ch] = val;
    }

    flush() {
        const changes = this._pendingChanges;
        this._pendingChanges = {};
        return changes;
    }

    updateProps(dmx) {
        this._externalUpdate = true;
        this.props.forEach(prop => {
            if (dmx[prop.channel] != null) {
                let val = dmx[prop.channel];
                prop.dmx = val;
            }
        });
        this._externalUpdate = false;
    }

    reset() {
        for (let prop of this.props) {
            if (prop.channel >= 1 && prop.channel <= 512) {
                prop.val = prop.defaultVal || 0;
            }
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

            modelInfo.brand = modelInfo.brand || modelInfo.model.split(" ")[0];
            return new Device({address, ...modelInfo, ...channelConfig, ...options});
        }
    }
    Object.entries(modelInfo).forEach(([field, val]) => {
        Model[field] = val;
    });

    return Model;
}
