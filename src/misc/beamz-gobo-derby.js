import {parseFixtureConfig} from "../parser.js";

export default parseFixtureConfig({
    model: "Beamz Gobo Derby",
    widthCm: 20,
    type: "rgbw-light",

    modes: [
        {
            name: "9ch",
            props: [
                "rotation",
                {type: "dimmer", activeDefault: 255},
                {
                    type: "wheel",
                    label: "Derby Color",
                    modes: [
                        {ch_val: 0, val: "off", color: "#fff"},
                        {ch_val: 10, val: "red", color: "#ff0000"},
                        {ch_val: 20, val: "green", color: "#00ff00"},
                        {ch_val: 30, val: "blue", color: "#4f9ae5"},
                        {ch_val: 40, val: "amber", color: "#feb204"},

                        {ch_val: 50, val: "red + green", color: "#ffff00"},
                        {ch_val: 60, val: "green + blue"},
                        {ch_val: 70, val: "blue + amber"},
                        {ch_val: 80, val: "red + amber"},
                        {ch_val: 90, val: "red + blue"},
                        {ch_val: 100, val: "green + amber"},

                        {ch_val: 110, val: "blue + green + amber"},
                        {ch_val: 120, val: "red + blue + amber"},
                        {ch_val: 130, val: "red + green + amber"},
                        {ch_val: 140, val: "red + green + blue"},
                        {ch_val: 150, val: "All On"},
                        {ch_val: 160, val: "LED Automatic"},
                    ],
                    defaultVal: 80,
                },

                "strobe",
                {type: "custom", label: "UV 1"},
                {type: "custom", label: "UV 2"},
                {type: "custom", label: "autoSound", ui: false},
                {type: "custom", label: "autoSoundUV", ui: false},
            ],
        },
    ],
});
