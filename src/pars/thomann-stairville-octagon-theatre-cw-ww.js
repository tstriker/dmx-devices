import {parseFixtureConfig} from "../parser.js";

export default parseFixtureConfig({
    model: "Thomann Stairville Octagon Theatre CW WW",
    widthCm: 20,
    type: "rgb-light",
    modes: [
        {
            name: "5ch",
            props: [
                {type: "custom", label: "cool"},
                {type: "custom", label: "warm"},
                "strobe",
                {type: "custom", label: "mode", ui: false},
                {type: "dimmer", activeDefault: 255, ui: false},
            ],
        },
    ],
});
