import {parseFixtureConfig} from "../parser.js";

export default parseFixtureConfig({
    model: "Beamz BT270",
    widthCm: 20,
    type: "rgb-light",

    modes: [
        {
            name: "3ch",
            props: ["red", "green", "blue"],
        },
        {
            name: "4ch",

            props: ["red", "green", "blue", "white"],
        },

        {
            name: "8ch",
            props: [
                {type: "dimmer", activeDefault: 255, ui: false},
                "strobe",
                "red",
                "green",
                "blue",
                "white",
                {type: "custom", label: "static color", ui: false},
                {type: "custom", label: "color macro", ui: false},
            ],
        },
    ],
});
