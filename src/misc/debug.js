import {parseFixtureConfig} from "../parser.js";

export default parseFixtureConfig({
    company: "RGB Monster",
    model: "Debug Device",
    type: "debug",
    modes: [
        {name: "1ch", props: [{type: "custom", label: "intensity", repeats: 1, every: 1}]},
        {name: "2ch", props: [{type: "custom", label: "intensity", repeats: 2, every: 1}]},
        {name: "4ch", props: [{type: "custom", label: "intensity", repeats: 4, every: 1}]},
        {name: "8ch", props: [{type: "custom", label: "intensity", repeats: 8, every: 1}]},
        {name: "16ch", props: [{type: "custom", label: "intensity", repeats: 16, every: 1}]},
        {name: "32ch", props: [{type: "custom", label: "intensity", repeats: 32, every: 1}]},
        {name: "64ch", props: [{type: "custom", label: "intensity", repeats: 64, every: 1}]},
        {name: "256ch", props: [{type: "custom", label: "intensity", repeats: 256, every: 1}]},
    ],
});
