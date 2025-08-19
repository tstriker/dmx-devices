import {parseFixtureConfig} from "../parser.js";

export default parseFixtureConfig({
    model: "Beamz Intimidator 375z",
    type: "moving head",
    modes: [
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

                {
                    type: "wheel",
                    modes: [
                        {ch_val: 0, val: "white", color: "#fff"},
                        {ch_val: 8, val: "orange", color: "#ed982e"},
                        {ch_val: 16, val: "lime green", color: "#ccff0b"},
                        {ch_val: 24, val: "cyan", color: "#00ffff"},
                        {ch_val: 32, val: "red", color: "#ff0000"},
                        {ch_val: 40, val: "green", color: "#00ff00"},
                        {ch_val: 48, val: "magenta", color: "#ff00ff"},
                        {ch_val: 56, val: "yellow", color: "#f5ef27"},
                    ],
                    activeDefault: 32, // sit in the middle of the wheel by default
                },

                {
                    type: "gobo",
                    modes: [
                        {ch_val: 0, val: "Off"},
                        {ch_val: 8, val: "Gobo 1"},
                        {ch_val: 16, val: "Gobo 2"},
                        {ch_val: 24, val: "Gobo 3"},

                        {ch_val: 32, val: "Gobo 4"},
                        {ch_val: 40, val: "Gobo 5"},
                        {ch_val: 48, val: "Gobo 6"},
                        {ch_val: 56, val: "Gobo 7"},
                    ],
                },

                "rotation",
                "prism",
                "focus",
                {type: "dimmer", activeDefault: 255},
                "shutter",
                {type: "custom", label: "function", ui: false},
                {type: "custom", label: "movement macros", ui: false},
                "zoom",
            ],
        },
    ],
});
