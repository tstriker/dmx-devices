import {parseFixtureConfig} from "../parser.js";

export default parseFixtureConfig({
    model: "CR Lite Magik 16",
    widthCm: 20,
    type: "rgbw-light",

    modes: [
        {
            name: "9ch",
            props: [
                {type: "dimmer", activeDefault: 255, ui: false},
                "red",
                "green",
                "blue",
                "white",
                "uv",
                "amber",
                "strobe",
                {type: "custom", label: "color change", ui: false},
            ],
        },
    ],
});
