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
                        {ch_val: 0, val: "white", color: "#fff"},
                        {ch_val: 16, val: "white-red"},
                        {ch_val: 24, val: "red", color: "#ff0000"},
                        {ch_val: 32, val: "red-green"},
                        {ch_val: 40, val: "green", color: "#00ff00"},
                        {ch_val: 48, val: "green-Blue"},
                        {ch_val: 56, val: "blue", color: "#4f9ae5"},
                        {ch_val: 64, val: "blue-yellow"},
                        {ch_val: 72, val: "yellow", color: "#f5ef27"},
                        {ch_val: 80, val: "yellow-purple"},
                        {ch_val: 88, val: "purple", color: "#ad2eed"},
                        {ch_val: 96, val: "purple-orange"},
                        {ch_val: 104, val: "orange", color: "#ed982e"},
                        {ch_val: 112, val: "orange-white"},

                        {ch_val: 128, val: "CCW rotation"},
                        {ch_val: 190, val: "stop rotation"},
                        {ch_val: 194, val: "CW rotation"},
                    ],
                    defaultVal: 72, // yellow sits in the middle of color wheel, so a good place to return to
                },
                {
                    type: "gobo",
                    modes: [
                        {ch_val: 0, val: "Fill"},
                        {ch_val: 16, val: "Fog"},
                        {ch_val: 32, val: "Vortex"},
                        {ch_val: 48, val: "Bubbles"},
                        {ch_val: 64, val: "Angular"},
                        {ch_val: 80, val: "Tri-dots"},
                        {ch_val: 96, val: "Aliens"},
                        {ch_val: 112, val: "Focus Ring"},
                        {ch_val: 128, val: "Gobos C-Clockwise"},
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
