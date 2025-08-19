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
                        {ch_val: 0, val: "display", label: "From Display"},
                        {ch_val: 52, val: "off", label: "Mode Off"},

                        {ch_val: 102, val: "fast", label: "Fast"},
                        {ch_val: 153, val: "medium", label: "Medium"},
                        {ch_val: 204, val: "slot", label: "Slow"},
                    ],
                },
            ],
        },
    ],
});
