import {parseFixtureConfig} from "../parser.js";

export default parseFixtureConfig({
    model: "Chauvet EVE E-50Z",
    widthCm: 20,
    type: "w-light",
    modes: [
        {
            name: "3ch",
            props: [
                {type: "white", activeDefault: 255},
                "strobe",
                {
                    type: "custom",
                    label: "Dimmer Mode",
                    modes: [
                        {chVal: 0, val: "display", label: "From Display"},
                        {chVal: 52, val: "off", label: "Mode Off"},

                        {chVal: 102, val: "fast", label: "Fast"},
                        {chVal: 153, val: "medium", label: "Medium"},
                        {chVal: 204, val: "slot", label: "Slow"},
                    ],
                    defaultVal: "display",
                },
            ],
        },
    ],
});
