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
                        {chVal: 0, val: "coolWhite", label: "cool white", color: "#fff"},
                        {chVal: 32, val: "warmWhite", label: "warm white", color: "#fff"},

                        {chVal: 64, val: "yellow", color: "#f5ef27"},
                        {chVal: 96, val: "purple", color: "#ad2eed"},
                        {chVal: 128, val: "green", color: "#00ff00"},
                        {chVal: 160, val: "red", color: "#ff0000"},
                        {chVal: 192, val: "blue", color: "#4f9ae5"},
                        {chVal: 224, val: "orange", color: "#ed982e"},
                    ],
                    defaultVal: 32, // yellow sits in the middle of color wheel, so a good place to return to
                },
                "strobe",
            ],
        },
    ],
});
