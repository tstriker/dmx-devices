import {parseFixtureConfig} from "../parser.js";

export default parseFixtureConfig({
    model: "RGB Par",
    widthCm: 20,
    type: "rgb-light",
    modes: [
        {
            name: "3ch",
            props: ["red", "green", "blue"],
        },
        {
            name: "6ch",
            props: [
                {type: "dimmer", activeDefault: 255},
                "red",
                "green",
                "blue",
                "strobe",
                {type: "custom", label: "color cycle", ui: false},
            ],
        },
    ],
});
