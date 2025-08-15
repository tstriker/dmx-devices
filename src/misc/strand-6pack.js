import {parseFixtureConfig} from "../parser.js";

export default parseFixtureConfig({
    company: "Strand",
    model: "Strand 6Pack",
    type: "multi-pack",
    modes: [
        {
            name: "6ch",
            props: [{type: "dimmer", repeats: 6, every: 1}],
        },
    ],
});
