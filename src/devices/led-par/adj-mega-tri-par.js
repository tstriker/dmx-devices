import {ModelFactory, rangeProp} from "../../device.js";
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
    defaultVal: 32,
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

let controls = [
    {
        name: "light",
        type: "rgb-light",
        label: "Light",
        props: {
            red: "red",
            green: "green",
            blue: "blue",
        },
    },
];

let dimmerControls = [
    {
        name: "light",
        type: "rgb-light",
        label: "Light",
        props: {
            red: "red",
            green: "green",
            blue: "blue",
            dimmer: "dimmer",
        },
    },
];

export default ModelFactory({
    label: "ADJ Mega TRI Par",
    widthCm: 20,
    type: "rgb-light",

    config: [
        {channels: 4, props: {red, green, blue, uv}, controls},
        {
            channels: 5,
            props: {red, green, blue, uv, dimmer: rangeProp({channel: 5, label: "Dimmer", defaultVal: 255})},
            controls: dimmerControls,
        },
        {
            channels: 6,
            props: {red, green, blue, uv, strobe, strobeSpeed, dimmer: rangeProp({channel: 6, label: "Dimmer", defaultVal: 255})},
            controls: dimmerControls,
        },
    ],
});
