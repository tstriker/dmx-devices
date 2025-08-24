import {parseFixtureConfig} from "../parser.js";

export default parseFixtureConfig({
    model: "Slimline Q5",
    widthCm: 20,
    type: "rgb-light",
    modes: [
        {
            name: "3ch",
            props: ["red", "green", "blue"],
        },
        {
            name: "7ch RGBW",
            props: [
                {type: "dimmer", activeDefault: 255},
                "strobe",
                "red",
                "green",
                "blue",
                "white",
                {type: "custom", label: "Color Cycle", ui: false},
            ],
        },
    ],
});
