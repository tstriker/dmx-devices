import {parseFixtureConfig} from "../parser.js";

export default parseFixtureConfig({
    model: "Chauvet Slim PAR 56",
    widthCm: 20,
    type: "rgb-light",

    modes: [
        {
            name: "3ch",
            props: ["red", "green", "blue"],
        },
        {
            name: "7ch",
            props: [
                "red",
                "green",
                "blue",
                {type: "custom", label: "Color Macros", ui: false},
                "strobe",
                {type: "custom", label: "Programs", ui: false},
                {type: "dimmer", activeDefault: 255, ui: false},
            ],
        },
    ],
});
