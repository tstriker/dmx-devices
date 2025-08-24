import {parseFixtureConfig} from "../parser.js";

export default parseFixtureConfig({
    model: "Eurolite LED Bar 2 RGBA 252/10",
    widthCm: 20,
    type: "bar",
    modes: [
        {
            name: "4ch",
            props: ["red", "green", "blue", "amber"],
        },
        {
            name: "6ch",
            props: ["red", "green", "blue", "amber", {type: "dimmer", activeDefault: 255}, "strobe"],
        },
    ],
});
