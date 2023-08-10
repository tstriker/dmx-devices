import {ModelFactory} from "../device.js";
import {rangeProp} from "../utils.js";

function between(val, bounds) {
    return bounds.some(([lower, upper]) => val >= lower && val <= upper);
}

let red = rangeProp({channel: 1, label: "Red"});
let green = rangeProp({channel: 2, label: "Green"});
let blue = rangeProp({channel: 3, label: "Blue"});
let uv = rangeProp({channel: 4, label: "Ultraviolet"});
let strobe = {
    channel: 5,
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
    channel: 5,
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
    model: "ADJ Mega TRI Par",
    widthCm: 20,
    type: "rgb-light",

    config: [
        {
            name: "4ch",
            props: {red, green, blue, uv},
            pixels: getPixels({color: colorControl, uv: "uv"}),
        },
        {
            name: "5ch",
            props: {red, green, blue, uv, dimmer: rangeProp({channel: 5, label: "Dimmer", defaultDMXVal: 255})},
            pixels: getPixels({color: colorControl, dimmer: "dimmer", uv: "uv"}),
        },
        {
            name: "6ch",
            props: {
                red,
                green,
                blue,
                uv,
                strobe,
                strobeSpeed,
                dimmer: rangeProp({channel: 6, label: "Dimmer", defaultDMXVal: 255}),
            },
            pixels: getPixels({color: colorControl, dimmer: "dimmer", uv: "uv", strobe: Strobe}),
        },
    ],
});
