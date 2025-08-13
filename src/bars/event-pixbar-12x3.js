import {parseFixtureConfig} from "../parser.js";

export default parseFixtureConfig({
    model: "Event Pixbar 12x3",
    widthCm: 110,
    type: "rgb-bar",
    modes: [
        {
            name: "3ch",
            props: ["red", "green", "blue"],
        },
        {
            name: "36ch",
            props: [
                {type: "red", repeats: 12, every: 3},
                {type: "green", repeats: 12, every: 3},
                {type: "blue", repeats: 12, every: 3},
            ],
        },
    ],
});
