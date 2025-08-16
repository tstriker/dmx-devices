import {parseFixtureConfig} from "../parser.js";

export default parseFixtureConfig({
    model: `Cosmos 108`,
    widthCm: 60,
    type: "par-bar",
    modes: [
        {
            name: "15ch",
            props: [
                {type: "custom", label: "mode", ui: false},
                {type: "dimmer", activeDefault: 255},
                "strobe",
                {type: "red", repeats: 4, every: 3},
                {type: "green", repeats: 4, every: 3},
                {type: "blue", repeats: 4, every: 3},
            ],
        },
    ],
});
