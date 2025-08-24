import {parseFixtureConfig} from "../parser.js";

export default parseFixtureConfig({
    model: "Thomann Stairville Par 56",
    widthCm: 20,
    type: "rgb-light",
    modes: [
        {
            name: "6ch",
            props: [
                "red",
                "green",
                "blue",
                {type: "custom", label: "color macro", ui: false},
                "strobe",
                {type: "custom", label: "macro", ui: false},
            ],
        },
    ],
});
