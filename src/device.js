import {round} from "./utils.js";
import {Prop} from "./props.js";
import {RGBLightControl, RGBWLightControl, WLightControl} from "./controls.js";

export class Device {
    constructor({
        address,
        channels,
        label,
        props,
        controls,
        render,
        onChange,
        resetDMX = false,
        reverseLights = false,
        ...other
    }) {
        this.address = address;
        this.channels = channels;
        this.label = label;
        this.deviceOptions = {};
        this.dmx = {};
        this.onChange = onChange;
        this.render = render;
        this.reverseLights = reverseLights;

        this._externalUpdate = false;
        this._notifyTimeout = null;

        this.props = [];

        // populate props
        Object.entries(props).forEach(([key, config]) => {
            // init all the props
            // and if we are modifying another prop, pass in the reference so we can work with that
            let modifies = config.modifies ? this[config.modifies] : null;
            let propChannel = address + config.channel - 1;
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
                    this.dmx[propChannel] = prop.defaultVal || 0;
                }
            }
            this[key] = prop;
            this.props.push(prop);
        });

        // XXX - will make it dynamic eventually
        let knownTypes = [RGBLightControl, RGBWLightControl, WLightControl];

        // populate controls and feed in the prop objects
        // deep clone the object to avoid any weird sideffects down the line
        controls = JSON.parse(JSON.stringify(controls || []));
        let maxOrder = Math.max(...controls.map(control => control.order || 0));
        this.controls = controls.map(control => {
            control.order = reverseLights ? maxOrder - control.order || 0 : control.order || 0;
            let controlClass = knownTypes.find(controlClass => control.type == controlClass.type);
            return new controlClass(control, this.props);
        });
        this.controls.sort((a, b) => a.order - b.order);
        this.controls.forEach(control => {
            this[control.name] = control;
        });

        // proxy anything else through; tbd
        Object.entries(other).forEach(([key, val]) => {
            this[key] = val;
        });

        let controlChannels = this.controls.map(control => control.channels).flat();
        this.unmanagedProps = this.props.filter(prop => !controlChannels.includes(prop.channel));

        return new Proxy(this, {
            set(target, prop, value, receiver) {
                if (target[prop] instanceof Prop) {
                    target[prop].val = value;

                    // update our own dmx
                    target.dmx[target[prop].channel] = target[prop].dmx;
                    target._notify();
                    return true;
                } else if (prop == "pan" && target.deviceOptions?.swivelFine) {
                    let coarseBitDegs = target.panCoarse.degrees / 255;
                    let coarseDegs = Math.floor(value / coarseBitDegs) * coarseBitDegs;
                    let fineDegs = value - coarseDegs;

                    target.panCoarse.val = coarseDegs;
                    target.panFine.val = fineDegs;
                    return true;
                } else if (prop == "tilt" && target.deviceOptions?.swivelFine) {
                    let coarseBitDegs = target.tiltCoarse.degrees / 255;
                    let coarseDegs = Math.floor(value / coarseBitDegs) * coarseBitDegs;
                    let fineDegs = value - coarseDegs;

                    target.tiltCoarse.val = coarseDegs;
                    target.tiltFine.val = fineDegs;
                    return true;
                } else {
                    return Reflect.set(target, prop, value, receiver);
                }
            },

            get(target, prop) {
                if (prop == "pan" && target.deviceOptions?.swivelFine) {
                    return round(target.panCoarse.val + target.panFine.val, 1);
                } else if (prop == "tilt" && target.deviceOptions?.swivelFine) {
                    return round(target.tiltCoarse.val + target.tiltFine.val, 1);
                }
                return Reflect.get(...arguments);
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
}

export function ModelFactory({config, ...modelInfo}) {
    // ended up using a func instead of subclassing, as the constructor gets fired too early for JS classes:
    // before the props have actually initialized, and we need it to run after that

    if (!Array.isArray(config)) {
        config = [config];
    }

    let countChannels = config => {
        // where we don't have channel options provided, we just count them ourselves based on defined props
        return config.channels || new Set(Object.values(config.props).map(prop => prop.channel)).size;
    };

    let byChannelCount = Object.fromEntries(config.map(c => [countChannels(c), c]));

    class Model {
        static channelOptions = config.map(c => countChannels(c));
        constructor(address, {channels, ...options}) {
            let channelConfig = byChannelCount[channels];
            return new Device({address, ...modelInfo, ...channelConfig, ...options, channels});
        }
    }
    Object.entries(modelInfo).forEach(([field, val]) => {
        Model[field] = val;
    });

    return Model;
}

export function rangeProp({channel, label, defaultVal = 0}) {
    return {
        channel,
        label,
        stops: [
            {chVal: 0, val: 0},
            {chVal: 255, val: 255},
        ],
        defaultVal,
    };
}
