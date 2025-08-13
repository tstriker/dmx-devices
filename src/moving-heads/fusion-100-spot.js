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
                        {chVal: 0, val: "white", color: "#fff"},
                        {chVal: 14, val: "red", color: "#ff0000"},
                        {chVal: 32, val: "yellow", color: "#f5ef27"},
                        {chVal: 50, val: "cyan", color: "#00ffff"},
                        {chVal: 68, val: "green", color: "#00ff00"},
                        {chVal: 86, val: "orange", color: "#ed982e"},
                        {chVal: 104, val: "magenta", color: "#ff00ff"},
                        {chVal: 122, val: "blue", color: "#4f9ae5"},
                    ],
                    defaultVal: "green", // by default sit in the middle for faster spin-to times
                },

                {
                    type: "gobo",
                    modes: [
                        {chVal: 0, val: "Off"},
                        {chVal: 9, val: "Stars"},
                        {chVal: 34, val: "Vortex"},
                        {chVal: 59, val: "Tri-dots"},
                        {chVal: 84, val: "Triangle"},
                        {chVal: 109, val: "Hearts"},

                        {chVal: 134, val: "Gobos Clockwise"},
                        {chVal: 195, val: "Gobos C-Clockwise"},
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
                        {chVal: 0, val: "white", color: "#fff"},
                        {chVal: 14, val: "red", color: "#ff0000"},
                        {chVal: 32, val: "yellow", color: "#f5ef27"},
                        {chVal: 50, val: "cyan", color: "#00ffff"},
                        {chVal: 68, val: "green", color: "#00ff00"},
                        {chVal: 86, val: "orange", color: "#ed982e"},
                        {chVal: 104, val: "magenta", color: "#ff00ff"},
                        {chVal: 122, val: "blue", color: "#4f9ae5"},
                    ],
                    defaultVal: 68, // middle of the color wheel
                },

                {
                    type: "gobo",
                    modes: [
                        {chVal: 0, val: "Off"},
                        {chVal: 16, val: "Fog"},
                        {chVal: 32, val: "Vortex"},
                        {chVal: 48, val: "Bubbles"},
                        {chVal: 64, val: "Angular"},
                        {chVal: 80, val: "Tri-dots"},
                        {chVal: 96, val: "Aliens"},
                        {chVal: 112, val: "Focus Ring"},
                        {chVal: 128, val: "Gobos C-Clockwise"},
                        {chVal: 190, val: "Gobos C-Clockwise 2"},
                        {chVal: 194, val: "Gobos C-Clockwise 3"},
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
