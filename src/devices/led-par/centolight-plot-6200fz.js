import {ModelFactory} from "../../device.js";
import {rangeProp} from "../../utils.js";

function between(val, bounds) {
    return bounds.some(([lower, upper]) => val >= lower && val <= upper);
}

let strobe = {
    label: "Strobe",
    modes: [
        {chVal: 0, val: "off", label: "Off"},
        {chVal: 32, val: "on", label: "On"},
        {chVal: 64, val: "pulse", label: "Strobe"},
        {chVal: 128, val: "pulse", label: "Pulse"},
        {chVal: 192, val: "random", label: "Random"},
    ],
    defaultDMXVal: 32,
};

let strobeSpeed = {
    label: "Strobe Speed",
    modifies: "strobe",
    condition: device =>
        between(device.strobe.dmx, [
            [64, 95],
            [128, 159],
            [192, 223],
        ]),
    stops: [
        {chVal: 0, val: 0, label: "Slow"},
        {chVal: 31, val: 1, label: "Fast"},
    ],
};

let Strobe = {
    props: {strobe: "strobe"},
    get(props) {
        // strobe universally should be: 0=off, 0.01..1 = flickering faster and faster
        let chVal = props.strobe.chVal;
        if (chVal < 64) {
            return 0;
        } else if (chVal <= 95) {
            return (chVal - 63) / 32;
        }
    },

    set(props, value) {
        if (value == 0) {
            props.strobe.dmx = 32;
        } else {
            props.strobe.dmx = 64 + Math.floor(value * 31);
        }
    },
};

let colorControl = {
    name: "light",
    type: "rgb-light",
    label: "Light",
    props: {
        red: "red",
        green: "green",
        blue: "blue",
    },
};

function getPixels(controls) {
    return [{id: "light", label: "Light", controls}];
}

export default ModelFactory({
    model: "Centolight Plot FZ6200",
    widthCm: 20,
    type: "rgb-light",

    config: [
        {
            name: "12ch",
            props: {
                dimmer: rangeProp({label: "Dimmer", defaultDMXVal: 255}),
                cct: rangeProp({label: "CCT"}),
                dimmerChange: rangeProp({label: "Dimmer Change", defaultDMXVal: 255}),

                red: rangeProp({label: "Red"}),
                green: rangeProp({label: "Green"}),
                blue: rangeProp({label: "Blue"}),
                lime: rangeProp({label: "Lime"}),
                amber: rangeProp({label: "Amber"}),
                cyan: rangeProp({label: "Cyan"}),
                zoom: rangeProp({label: "Zoom"}),
                strobe: {
                    label: "Strobe",
                    stops: [
                        {chVal: 0, val: 0, label: "off"},
                        {chVal: 10, val: 0.01},
                        {chVal: 255, val: 1},
                    ],
                },
            },
            pixels: getPixels({color: colorControl, dimmer: "dimmer", strobe: Strobe}),
        },
    ],
});
