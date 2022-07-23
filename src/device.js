import {round} from "./utils.js";
import {Prop} from "./props.js";
import {Control, RGBLightControl, RGBWLightControl} from "./controls.js";

export class Device {
    constructor({address, channels, label, props, controls, render, onChange, resetDMX = true, ...other}) {
        this.address = address;
        this.channels = channels;
        this.label = label;
        this.deviceOptions = {};
        this.dmx = {};
        this.onChange = onChange;
        this.render = render;

        this._externalUpdate = false;

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
                // set all channels to zero on create time so that our output is deterministic
                // override the flag if you want it to be additive instea
                // (like, when you don't know the state of the device and want to change just one channel without
                // changing the others)
                this.dmx[propChannel] = 0;
            }
            this[key] = prop;
        });

        // XXX - will make it dynamic eventually
        let knownTypes = [RGBLightControl, RGBWLightControl];

        // populate controls and feed in the prop objects
        this.controls = (controls || []).map(control => {
            let controlClass = knownTypes.find(controlClass => control.type == controlClass.type);
            if (controlClass) {
                return new controlClass(control, this.props);
            }
        });

        this.controls.forEach(control => {
            this[control.name] = control;
        });

        // proxy anything else through; tbd
        Object.entries(other).forEach(([key, val]) => {
            this[key] = val;
        });

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

    _notify() {
        if (!this._externalUpdate && this.onChange) {
            this.onChange(this.dmx);
        }
    }

    get props() {
        // returns all props for this device, in case you want to put them on screen, or are looking for something
        // specific
        return Object.values(this).filter(obj => obj instanceof Prop);
    }

    get unmanagedProps() {
        let controlChannels = this.controls.map(control => control.channels).flat();
        return this.props.filter(prop => !controlChannels.includes(prop.channel));
    }

    onPropChange(ch, val, modifies) {
        if (modifies) {
            this.dmx[ch] = parseInt(modifies?.cur?.chVal || 0) + parseInt(val);
        } else {
            this.dmx[ch] = val;
        }
        this._notify();
    }

    updateProps(dmx) {
        this._externalUpdate = true;
        this.props.forEach(prop => {
            let val = dmx[prop.channel] || 0;
            if (prop.modifies) {
                val = val - prop.modifies.cur.chVal;
            }

            prop.dmx = val;
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
