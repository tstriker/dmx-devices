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
                        {chVal: 0, val: "white", color: "#fff"},
                        {chVal: 8, val: "orange", color: "#ed982e"},
                        {chVal: 16, val: "lime green", color: "#ccff0b"},
                        {chVal: 24, val: "cyan", color: "#00ffff"},
                        {chVal: 32, val: "red", color: "#ff0000"},
                        {chVal: 40, val: "green", color: "#00ff00"},
                        {chVal: 48, val: "magenta", color: "#ff00ff"},
                        {chVal: 56, val: "yellow", color: "#f5ef27"},
                    ],
                    activeDefault: 32, // sit in the middle of the wheel by default
                },

                {
                    type: "gobo",
                    modes: [
                        {chVal: 0, val: "Off"},
                        {chVal: 8, val: "Gobo 1"},
                        {chVal: 16, val: "Gobo 2"},
                        {chVal: 24, val: "Gobo 3"},

                        {chVal: 32, val: "Gobo 4"},
                        {chVal: 40, val: "Gobo 5"},
                        {chVal: 48, val: "Gobo 6"},
                        {chVal: 56, val: "Gobo 7"},
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
