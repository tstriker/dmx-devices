import {parseFixtureConfig} from "../parser.js";

export default parseFixtureConfig({
    model: "Equinox Color Raider",
    widthCm: 20,
    type: "rgbw-light",
    modes: [
        {
            name: "3ch",
            props: ["red", "green", "blue"],
        },
        {
            name: "4ch-1",
            props: ["red", "green", "blue", "white"],
        },

        {
            name: "8ch",
            props: [
                {type: "dimmer", activeDefault: 255},
                "strobe",
                "red",
                "green",
                "blue",
                "white",
                {type: "custom", label: "Color Preset", ui: false},
                {type: "custom", label: "Color Fade", ui: false},
            ],
        },
    ],
});
