import {parseFixtureConfig} from "../parser.js";

export default parseFixtureConfig({
    company: "Transcension",
    model: "Transcension Multi Pack DDP-405",
    type: "multi-pack",
    modes: [
        {
            name: "1ch",
            props: ["white"],
        },
        {
            name: "4ch",
            props: [{type: "white", repeats: 4, every: 1}],
        },
    ],
});
