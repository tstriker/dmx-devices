import {parseFixtureConfig} from "../parser.js";

export default parseFixtureConfig({
    model: "Fusion 100 Spot",
    type: "moving head",
    modes: [
        {
            name: "8ch",
            props: [
                {
                    type: "pan_coarse",
                    degrees: 540,
                    defaultVal: 127, // point straight ahead at 360 degrees to allow 90 degree freedom either direction
                },
                {
                    type: "tilt_coarse",
                    degrees: 180,
                    defaultVal: 127, // point straight up/down  by default to avoid blinding anyone
                },
                {type: "dimmer", activeDefault: 255},
                {
                    type: "wheel",
                    modes: [
                        {ch_val: 0, val: "white", color: "#fff"},
                        {ch_val: 14, val: "red", color: "#ff0000"},
                        {ch_val: 32, val: "yellow", color: "#f5ef27"},
                        {ch_val: 50, val: "cyan", color: "#00ffff"},
                        {ch_val: 68, val: "green", color: "#00ff00"},
                        {ch_val: 86, val: "orange", color: "#ed982e"},
                        {ch_val: 104, val: "magenta", color: "#ff00ff"},
                        {ch_val: 122, val: "blue", color: "#4f9ae5"},
                    ],
                    defaultVal: 68, // by default sit in the middle for faster spin-to times
                },

                {
                    type: "gobo",
                    modes: [
                        {ch_val: 0, val: "Off"},
                        {ch_val: 9, val: "Stars"},
                        {ch_val: 34, val: "Vortex"},
                        {ch_val: 59, val: "Tri-dots"},
                        {ch_val: 84, val: "Triangle"},
                        {ch_val: 109, val: "Hearts"},

                        {ch_val: 134, val: "Gobos Clockwise"},
                        {ch_val: 195, val: "Gobos C-Clockwise"},
                    ],
                },

                "rotation",
                "focus",
                "prism",
            ],
        },
        {
            name: "15ch",
            props: [
                {
                    type: "pan_coarse",
                    degrees: 540,
                    defaultVal: 127, // point straight ahead at 360 degrees to allow 90 degree freedom either direction
                },
                "pan_fine",
                {
                    type: "tilt_coarse",
                    degrees: 180,
                    defaultVal: 127, // point straight up/down  by default to avoid blinding anyone
                },
                "tilt_fine",
                "speed",
                {type: "dimmer", activeDefault: 255},
                {type: "strobe", defaultVal: 255},
                {
                    type: "wheel",
                    modes: [
                        {ch_val: 0, val: "white", color: "#fff"},
                        {ch_val: 14, val: "red", color: "#ff0000"},
                        {ch_val: 32, val: "yellow", color: "#f5ef27"},
                        {ch_val: 50, val: "cyan", color: "#00ffff"},
                        {ch_val: 68, val: "green", color: "#00ff00"},
                        {ch_val: 86, val: "orange", color: "#ed982e"},
                        {ch_val: 104, val: "magenta", color: "#ff00ff"},
                        {ch_val: 122, val: "blue", color: "#4f9ae5"},
                        {ch_val: 140, val: "rainbow", color: "#4f9ae5", custom: "range"},
                        {ch_val: 200, val: "reverse rainbow", color: "#4f9ae5", custom: "range"},
                    ],
                    defaultVal: 68, // middle of the color wheel
                },

                {
                    type: "gobo",
                    modes: [
                        {ch_val: 0, val: "Off"},
                        {ch_val: 16, val: "Fog"},
                        {ch_val: 32, val: "Vortex"},
                        {ch_val: 48, val: "Bubbles"},
                        {ch_val: 64, val: "Angular"},
                        {ch_val: 80, val: "Tri-dots"},
                        {ch_val: 96, val: "Aliens"},
                        {ch_val: 112, val: "Focus Ring"},
                        {ch_val: 128, val: "Gobos C-Clockwise"},
                        {ch_val: 190, val: "Gobos C-Clockwise 2"},
                        {ch_val: 194, val: "Gobos C-Clockwise 3"},
                    ],
                },
                "rotation",
                "focus",
                "prism",
                {type: "custom", label: "led_macro", ui: false},
                {type: "custom", label: "tilt_macro", ui: false},
            ],
        },
    ],
});
