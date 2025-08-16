import {parseFixtureConfig} from "../parser.js";

export default parseFixtureConfig({
    company: "Showtec",
    model: "Sunstrip",
    type: "rgbw-bar",
    modes: [
        {
            name: "10ch",
            props: [{type: "white", repeats: 10, every: 1}],
        },
    ],
});
