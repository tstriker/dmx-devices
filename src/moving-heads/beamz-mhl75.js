import {parseFixtureConfig} from "../parser.js";

export default parseFixtureConfig({
    model: "Beamz MHL75",
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
                    defaultVal: 127, // point straight up/down on defaultVal to avoid blinding anyone
                },

                "tilt_fine",
                "speed",
                {type: "dimmer", activeDefault: 255},
                {type: "custom", label: "spotlight", defaultVal: 255},
                "strobe",
                {
                    type: "wheel",
                    modes: [
                        {chVal: 0, val: "white", color: "#fff"},
                        {chVal: 16, val: "white-red"},
                        {chVal: 24, val: "red", color: "#ff0000"},
                        {chVal: 32, val: "red-green"},
                        {chVal: 40, val: "green", color: "#00ff00"},
                        {chVal: 48, val: "green-Blue"},
                        {chVal: 56, val: "blue", color: "#4f9ae5"},
                        {chVal: 64, val: "blue-yellow"},
                        {chVal: 72, val: "yellow", color: "#f5ef27"},
                        {chVal: 80, val: "yellow-purple"},
                        {chVal: 88, val: "purple", color: "#ad2eed"},
                        {chVal: 96, val: "purple-orange"},
                        {chVal: 104, val: "orange", color: "#ed982e"},
                        {chVal: 112, val: "orange-white"},

                        {chVal: 128, val: "CCW rotation"},
                        {chVal: 190, val: "stop rotation"},
                        {chVal: 194, val: "CW rotation"},
                    ],
                    defaultVal: 72, // yellow sits in the middle of color wheel, so a good place to return to
                },
                {
                    type: "gobo",
                    modes: [
                        {chVal: 0, val: "Fill"},
                        {chVal: 16, val: "Fog"},
                        {chVal: 32, val: "Vortex"},
                        {chVal: 48, val: "Bubbles"},
                        {chVal: 64, val: "Angular"},
                        {chVal: 80, val: "Tri-dots"},
                        {chVal: 96, val: "Aliens"},
                        {chVal: 112, val: "Focus Ring"},
                        {chVal: 128, val: "Gobos C-Clockwise"},
                    ],
                    defaultVal: 64,
                },

                {type: "red"},
                {type: "green"},
                {type: "blue"},
                {type: "white"},
                {type: "custom", label: "wash strobe"},
            ],
        },
    ],
});
