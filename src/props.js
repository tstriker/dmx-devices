import {range} from "./utils.js";

export class Prop {
    constructor({name, channel, label, stops, modes, modifies, condition, defaultVal, onPropChange, ...other}) {
        this.name = name;
        this.channel = channel;
        this.label = label || name;
        if (stops) {
            this.stops = stops;
        }
        if (modes) {
            this.modes = modes;
        }

        if (modifies) {
            this.modifies = modifies;
        }
        if (condition) {
            this.condition = condition;
        }

        Object.entries(other).forEach(([key, val]) => {
            this[key] = val;
        });

        this.modeMap = calcModeMap({stops, modes});
        this.modeMapEntries = Object.entries(this.modeMap);

        this.defaultVal = defaultVal || 0;
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
            this.onPropChange(this.channel, this.chVal, this.modifies);
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
        } else {
            // finds closest by value to determine which channel this value maps to
            let closest = this.modeMapEntries
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

            dmx = closest[0].chVal;
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

function calcModeMap({stops, modes}) {
    let modeMap = {};

    let closestMode = chVal => {
        let mode = modes[0];
        for (let i = 0; i < modes.length; i++) {
            if (modes[i].chVal > chVal) {
                break;
            }
            mode = modes[i];
        }
        return mode;
    };

    if (modes) {
        for (let i = 0; i <= 255; i++) {
            let closest = closestMode(i);
            modeMap[i] = {cur: closest, val: closest.val};
        }
    } else if (stops) {
        for (let i = 0; i < stops.length - 1; i++) {
            let cur = stops[i];
            let next = stops[i + 1];

            range(cur.chVal, next.chVal + 1).forEach(chVal => {
                if (cur.discrete) {
                    modeMap[chVal] = {cur: cur, val: cur.val};
                } else {
                    let normalized = (chVal - cur.chVal) / (next.chVal - cur.chVal);
                    let val = cur.val * (1 - normalized) + next.val * normalized;

                    modeMap[chVal] = {cur: cur, val: val};
                }
            });
        }
    }

    return modeMap;
}
