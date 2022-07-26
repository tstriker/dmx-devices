import {ModelFactory, rangeProp} from "../../device.js";

let red = rangeProp({channel: 1, label: "Red"});
let green = rangeProp({channel: 2, label: "Green"});
let blue = rangeProp({channel: 3, label: "Blue"});
let white = rangeProp({channel: 4, label: "White"});
let amber = rangeProp({channel: 5, label: "Amber"});
let uv = rangeProp({channel: 6, label: "Ultraviolet"});
let dimmer = rangeProp({channel: 7, label: "Dimmer", defaultVal: 255});

function between(val, bounds) {
    return bounds.some(([lower, upper]) => val >= lower && val <= upper);
}

let strobe = {
    channel: 8,
    label: "Strobe",
    modes: [
        {chVal: 32, val: "off", label: "Off"},
        {chVal: 64, val: "on", label: "On"},
        {chVal: 128, val: "pulse", label: "Pulse"},
        {chVal: 192, val: "random", label: "Random"},
    ],
    defaultVal: 32,
};

let strobeSpeed = {
    channel: 8,
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

let programMode = {
    channel: 9,
    label: "Program Mode",
    modes: [
        {chVal: 0, val: "dimming", label: "No Program"},
        {chVal: 52, val: "color_macro", label: "Color Macro"},
        {chVal: 103, val: "color_change", label: "Color Change"},
        {chVal: 154, val: "color_fade", label: "Color Fade"},
        {chVal: 205, val: "sound", label: "Sound"},
    ],
};

let colorMacro = (() => {
    // color macros permutate through all 6 combos. the permutation order is shallow rather than deep
    function powerSet(list) {
        // https://codereview.stackexchange.com/a/39747
        let set = [];
        let listSize = list.length;
        let combinationsCount = 1 << listSize;

        for (var i = 1; i < combinationsCount; i++) {
            let combination = [];
            for (var j = 0; j < listSize; j++) {
                if (i & (1 << j)) {
                    combination.push(list[j]);
                }
            }
            set.push(combination);
        }
        return set;
    }

    let components = ["R", "G", "B", "W", "A", "U"];
    let combos = powerSet(components);

    // i'm bit too dum to figure out how to flip the code above from deep to shallow order
    // so we do a dumb weighting sort
    let byOrder = combo => {
        let weight = combo.reduce((total, comp, idx) => {
            return total + (components.indexOf(comp) + 1) * Math.pow(10, 6 - idx);
        }, 0);
        return weight * Math.pow(10, combo.length);
    };
    combos.sort((a, b) => byOrder(a) - byOrder(b));
    let modes = [
        {chVal: 0, label: "Off"},
        ...combos.map((combo, idx) => ({chVal: 4 + idx * 4, label: combo.join(" + ")})),
    ];

    return {
        channel: 10,
        label: "Color Macros",
        condition: device => between(device.programMode.dmx, [[52, 102]]),
        modes,
    };
})();

let colorChange = {
    channel: 10,
    label: "Color Change",
    condition: device => between(device.programMode.dmx, [[103, 153]]),
    modes: [
        {chVal: 0, val: "Mode 1"},
        {chVal: 16, val: "Mode 2"},
        {chVal: 32, val: "Mode 3"},
        {chVal: 48, val: "Mode 4"},
        {chVal: 64, val: "Mode 5"},
        {chVal: 80, val: "Mode 6"},
        {chVal: 96, val: "Mode 7"},
        {chVal: 112, val: "Mode 8"},
        {chVal: 128, val: "Mode 9"},
        {chVal: 144, val: "Mode 10"},
        {chVal: 160, val: "Mode 11"},
        {chVal: 176, val: "Mode 12"},
        {chVal: 192, val: "Mode 13"},
        {chVal: 208, val: "Mode 14"},
        {chVal: 224, val: "Mode 15"},
        {chVal: 240, val: "Mode 16"},
    ],
};

let colorFade = {
    channel: 10,
    label: "Color Fade",
    condition: device => between(device.programMode.dmx, [[154, 204]]),
    modes: [
        {chVal: 0, val: "Mode 1"},
        {chVal: 16, val: "Mode 2"},
        {chVal: 32, val: "Mode 3"},
        {chVal: 48, val: "Mode 4"},
        {chVal: 64, val: "Mode 5"},
        {chVal: 80, val: "Mode 6"},
        {chVal: 96, val: "Mode 7"},
        {chVal: 112, val: "Mode 8"},
        {chVal: 128, val: "Mode 9"},
        {chVal: 144, val: "Mode 10"},
        {chVal: 160, val: "Mode 11"},
        {chVal: 176, val: "Mode 12"},
        {chVal: 192, val: "Mode 13"},
        {chVal: 208, val: "Mode 14"},
        {chVal: 224, val: "Mode 15"},
        {chVal: 240, val: "Mode 16"},
    ],
};

let soundActiveMode = {
    channel: 10,
    label: "Sound Active Mode",
    condition: device => between(device.programMode.dmx, [[205, 255]]),
    modes: [
        {chVal: 0, val: "Mode 1"},
        {chVal: 16, val: "Mode 2"},
        {chVal: 32, val: "Mode 3"},
        {chVal: 48, val: "Mode 4"},
        {chVal: 64, val: "Mode 5"},
        {chVal: 80, val: "Mode 6"},
        {chVal: 96, val: "Mode 7"},
        {chVal: 112, val: "Mode 8"},
        {chVal: 128, val: "Mode 9"},
        {chVal: 144, val: "Mode 10"},
        {chVal: 160, val: "Mode 11"},
        {chVal: 176, val: "Mode 12"},
        {chVal: 192, val: "Mode 13"},
        {chVal: 208, val: "Mode 14"},
        {chVal: 224, val: "Mode 15"},
        {chVal: 240, val: "Mode 16"},
    ],
};

let speed = rangeProp({
    channel: 11,
    label: "Program speed",
});
let dimmerCurves = {
    channel: 12,
    label: "Dimmer Curves",
    condition: device => device.programMode.dmx < 248,
    modes: [
        {chVal: 0, val: "Standard"},
        {chVal: 21, val: "Stage"},
        {chVal: 41, val: "TV"},
        {chVal: 61, val: "Architectural"},
        {chVal: 81, val: "Theatre"},
        {chVal: 101, val: "Default"},
    ],
};

let controls = [
    {
        name: "light",
        type: "rgbw-light",
        label: "Light",
        props: {
            red: "red",
            green: "green",
            blue: "blue",
            white: "white",
        },
    },
];

let dimmerControls = [
    {
        name: "light",
        type: "rgbw-light",
        label: "Light",
        props: {
            red: "red",
            green: "green",
            blue: "blue",
            white: "white",
            dimmer: "dimmer",
        },
    },
];

export default ModelFactory({
    label: "ADJ Mega HEX Par",
    widthCm: 20,
    type: "rgbw-light",

    config: [
        {channels: 6, props: {red, green, blue, white, amber, uv}, controls},
        {channels: 7, props: {red, green, blue, white, amber, uv, dimmer}, controls: dimmerControls},
        {
            channels: 8,
            props: {red, green, blue, white, amber, uv, dimmer, strobe, strobeSpeed},
            controls: dimmerControls,
        },
        {
            channels: 11,
            props: {
                red,
                green,
                blue,
                white,
                amber,
                uv,
                dimmer,
                strobe,
                strobeSpeed,
                programMode,
                colorMacro,
                colorChange,
                colorFade,
                soundActiveMode,
                speed,
            },
            controls: dimmerControls,
        },
        {
            channels: 12,
            props: {
                red,
                green,
                blue,
                white,
                amber,
                uv,
                dimmer,
                strobe,
                strobeSpeed,
                programMode,
                colorMacro,
                colorChange,
                colorFade,
                soundActiveMode,
                speed,
                dimmerCurves,
            },
            controls: dimmerControls,
        },
    ],
});
