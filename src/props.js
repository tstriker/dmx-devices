import {round} from "./utils.js";

export class Prop {
    constructor({name, type, channel, label, stops, modes, defaultVal, activeDefault, onPropChange, ...other}) {
        this.name = name;
        this.type = type;
        this.channel = channel;
        this.label = label || name;

        if (stops) {
            this.stops = stops;
        }
        if (modes) {
            this.modes = modes;
            this.modesByName = Object.fromEntries(modes.map(mode => [mode.val, mode]));
        }

        Object.entries(other).forEach(([key, val]) => {
            this[key] = val;
        });

        this.modeMap = calcModeMap(stops || modes);
        this.modeByVal = Object.fromEntries(
            Object.entries(this.modeMap).map(([chVal, rec]) => [rec.label, {...rec, chVal}])
        );

        this.modeMapEntries = Object.entries(this.modeMap);

        // stand by is the value that should be set on reset
        this.defaultVal = this.modeMap[defaultVal || 0].label;

        if (activeDefault != undefined) {
            // activeDefault is used when the device is turned on
            this.activeDefault = this.modeMap[activeDefault].label;
        }

        this.onPropChange = onPropChange;
        this.val = this.defaultVal;
    }

    set dmx(chVal) {
        if (chVal == this.chVal) {
            // nothing to report
            return;
        }

        this.chVal = chVal;
        this.cur = this.modeMap[chVal]?.cur;
        this.interpolated = this.modeMap[chVal]?.val;

        if (this.onPropChange) {
            this.onPropChange(this.channel, this.chVal);
        }
    }

    get dmx() {
        return this.chVal;
    }

    set val(val) {
        this.interpolated = val;
        let dmx;
        if (this.stops?.length == 2 && this.stops[0].val == 0 && this.stops[this.stops.length - 1].val == 255) {
            // direct mapping means there is no dmx <-> val translation and we can save time on processing
            // this is true for all RGB lights, as well as dimmers, strobes, and so on
            dmx = val;
        } else if (this.modeByVal[val] !== undefined) {
            dmx = this.modeByVal[val].chVal;
        } else {
            // finds closest by value to determine which channel this value maps to
            // note - if config is correct, this should not fire anymore
            let byDistance = this.modeMapEntries
                .map(rec => {
                    let distance;
                    if (rec[1].val == val) {
                        distance = 0;
                    } else if (isNaN(val)) {
                        distance = 999999;
                    } else {
                        distance = Math.abs(rec[1].val - val);
                    }

                    return {chVal: rec[0], distance};
                })
                .sort((a, b) => a.distance - b.distance);

            //console.log("found by distance", this.name, val, byDistance[0].chVal);

            dmx = byDistance[0].chVal;
        }
        this.dmx = dmx;
    }

    get val() {
        return this.interpolated;
    }

    toString() {
        return this.val.toString();
    }
}

export function calcModeMap(stops) {
    // determines value and respective stop for each channel
    // this way we can cheaply map from channel to specific state and don't have to calc it on the fly
    let modeMap = {};

    let closest = channel => {
        let modeStop = stops[0];
        for (let i = 0; i < stops.length; i++) {
            if (stops[i].chVal > channel) {
                break;
            }
            modeStop = stops[i];
        }
        return modeStop;
    };

    if (
        (stops.length == 1 && stops[0].range == 255) ||
        (stops.length == 2 && stops[0].chVal == 0 && stops[1].chVal == 255)
    ) {
        // if we have a linear range that goes from one end to the other, the value label will be 0..1
        for (let channel = 0; channel <= 255; channel++) {
            let cur = channel == 255 ? stops[stops.length - 1] : stops[0];
            let progressVal = round(channel / 255, 4);
            modeMap[channel] = {cur, val: channel / 255, progress: channel, label: progressVal};
        }
        return modeMap;
    }

    stops = [...stops];
    if (stops[0].chVal != 0) {
        stops.splice(0, 0, {chVal: 0, val: null});
    }

    for (let channel = 0; channel <= 255; channel++) {
        // find the stop closest to the current channel value
        let cur = closest(channel);
        let progress = channel - cur.chVal;

        // progressVal allows us to set value programmatically when we are tweening between different
        // non-interpolatable states
        let curVal = cur.val || "null";
        let progressVal = progress == 0 ? curVal : `${curVal}:${progress}`;
        modeMap[channel] = {cur: cur, progress, label: progressVal};
    }

    return modeMap;
}
