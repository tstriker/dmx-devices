import {parseFixtureConfig} from "../parser.js";

export default parseFixtureConfig({
    model: "Gear4Music Galaxy 19/38",
    widthCm: 110,
    type: "rgb-bar",
    modes: [
        {
            name: "3ch",
            props: ["red", "green", "blue"],
        },
        {
            name: "6ch",
            props: [
                "red",
                "green",
                "blue",
                "strobe",
                {type: "custom", label: "Dimming and strobe modes"},
                {type: "custom", label: "Auto running speed"},
            ],
        },
        {
            name: "14ch",
            props: [
                {type: "red", repeats: 4, every: 3},
                {type: "green", repeats: 4, every: 3},
                {type: "blue", repeats: 4, every: 3},
                "strobe",
                {type: "dimmer", activeDefault: 255},
            ],
        },
    ],
});
