import {parseFixtureConfig} from "../parser.js";

export default parseFixtureConfig({
    model: "Fader",
    widthCm: 20,
    type: "fader",
    modes: [
        {
            name: "1ch",
            props: [{type: "custom", label: "fader"}],
        },
    ],
});
