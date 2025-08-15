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
                        {chVal: 0, val: "off", color: "#fff"},
                        {chVal: 10, val: "red", color: "#ff0000"},
                        {chVal: 20, val: "green", color: "#00ff00"},
                        {chVal: 30, val: "blue", color: "#4f9ae5"},
                        {chVal: 40, val: "amber", color: "#feb204"},

                        {chVal: 50, val: "red + green", color: "#ffff00"},
                        {chVal: 60, val: "green + blue"},
                        {chVal: 70, val: "blue + amber"},
                        {chVal: 80, val: "red + amber"},
                        {chVal: 90, val: "red + blue"},
                        {chVal: 100, val: "green + amber"},

                        {chVal: 110, val: "blue + green + amber"},
                        {chVal: 120, val: "red + blue + amber"},
                        {chVal: 130, val: "red + green + amber"},
                        {chVal: 140, val: "red + green + blue"},
                        {chVal: 150, val: "All On"},
                        {chVal: 160, val: "LED Automatic"},
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
