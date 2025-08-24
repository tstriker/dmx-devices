import {parseFixtureConfig} from "../parser.js";

export default parseFixtureConfig({
    model: "CentoLight Plot 200FZ",
    widthCm: 20,
    type: "w-light",
    modes: [
        {
            name: "2ch",
            props: [{type: "white", activeDefault: 255}, "zoom"],
        },

        {
            name: "3ch",
            props: [{type: "white", activeDefault: 255}, "strobe", "zoom"],
        },
    ],
});
