import {parseFixtureConfig} from "../parser.js";

export default parseFixtureConfig({
    model: "LeDJ Stage Par CZ 120",
    widthCm: 20,
    type: "rgba-light",
    modes: [
        {
            name: "4ch",
            props: ["red", "green", "blue", "amber"],
        },
    ],
});
