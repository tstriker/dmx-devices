import {parseFixtureConfig} from "../parser.js";

export default parseFixtureConfig({
    model: "Chauvet 120ST",
    type: "w-light",
    modes: [
        {
            name: "3ch",
            props: [
                {type: "dimmer", activeDefault: 255},
                {
                    type: "wheel",
                    modes: [
                        {ch_val: 0, val: "coolWhite", label: "cool white", color: "#fff"},
                        {ch_val: 32, val: "warmWhite", label: "warm white", color: "#fff"},

                        {ch_val: 64, val: "yellow", color: "#f5ef27"},
                        {ch_val: 96, val: "purple", color: "#ad2eed"},
                        {ch_val: 128, val: "green", color: "#00ff00"},
                        {ch_val: 160, val: "red", color: "#ff0000"},
                        {ch_val: 192, val: "blue", color: "#4f9ae5"},
                        {ch_val: 224, val: "orange", color: "#ed982e"},
                    ],
                    defaultVal: 32, // yellow sits in the middle of color wheel, so a good place to return to
                },
                "strobe",
            ],
        },
    ],
});
