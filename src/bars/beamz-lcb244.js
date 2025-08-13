import {parseFixtureConfig} from "../parser.js";

export default parseFixtureConfig({
    model: `Beamz LCB 244`,
    widthCm: 110,
    type: "rgbw-bar",
    modes: [
        {
            name: "9ch",
            props: [
                {type: "dimmer", activeDefault: 255, ui: false},
                "strobe",
                "red",
                "green",
                "blue",
                "white",
                {type: "custom", label: "auto", ui: false},
                {type: "custom", label: "chase and sound", ui: false},
                {type: "custom", label: "chase speed", ui: false},
            ],
        },
        {
            name: "16ch",
            props: [
                {type: "dimmer", activeDefault: 255, ui: false},
                {type: "strobe", repeats: 2, every: 7, ui: false},
                {type: "red", repeats: 2, every: 7},
                {type: "green", repeats: 2, every: 7},
                {type: "blue", repeats: 2, every: 7},
                {type: "white", repeats: 2, every: 7},
                {type: "custom", label: "auto", ui: false, repeats: 2, every: 7},
                {type: "custom", label: "section dimmer", activeDefault: 255, ui: false, repeats: 2, every: 7},
                {type: "custom", label: "chase speed", ui: false},
            ],
        },
        {
            name: "30ch",
            props: [
                {type: "dimmer", activeDefault: 255, ui: false},
                {type: "strobe", repeats: 4, every: 7, ui: false},
                {type: "red", repeats: 4, every: 7},
                {type: "green", repeats: 4, every: 7},
                {type: "blue", repeats: 4, every: 7},
                {type: "white", repeats: 4, every: 7},
                {type: "custom", label: "auto", ui: false, repeats: 4, every: 7},
                {type: "custom", label: "section dimmer", activeDefault: 255, ui: false, repeats: 4, every: 7},
                {type: "custom", label: "chase speed", ui: false},
            ],
        },
        {
            name: "58ch",
            props: [
                {type: "dimmer", activeDefault: 255, ui: false},
                {type: "strobe", repeats: 8, every: 7, ui: false},
                {type: "red", repeats: 8, every: 7},
                {type: "green", repeats: 8, every: 7},
                {type: "blue", repeats: 8, every: 7},
                {type: "white", repeats: 8, every: 7},
                {type: "custom", label: "auto", ui: false, repeats: 8, every: 7},
                {type: "custom", label: "section dimmer", activeDefault: 255, ui: false, repeats: 8, every: 7},
                {type: "custom", label: "chase and sound", ui: false},
                {type: "custom", label: "chase speed", ui: false},
            ],
        },
    ],
});
