import {parseFixtureConfig} from "../parser.js";

export default parseFixtureConfig({
    model: "ADJ Mega HEX Par",
    widthCm: 20,
    type: "rgbw-light",

    modes: [
        {
            name: "6ch",
            props: ["red", "green", "blue", "white", "amber", "uv"],
        },
        {
            name: "8ch",
            props: [
                "red",
                "green",
                "blue",
                "white",
                "amber",
                "uv",
                {type: "dimmer", activeDefault: 255, ui: false},
                {
                    // even though the tripar is capable of several strobe modes, we default to the standard
                    // as anything more sophisticated can be implemented on software side
                    type: "strobe",
                    modes: [
                        {chVal: 32, val: "Don't strobe"},
                        {chVal: 64, val: "Strobe slow-fast", range: 32},
                        {chVal: 128, val: "Pulse strobe", range: 32},
                        {chVal: 192, val: "Random strobe", range: 32},
                    ],
                    defaultVal: 32,
                },
            ],
        },
    ],
});
