import {parseFixtureConfig} from "../parser.js";

export default parseFixtureConfig({
    model: "LeDJ Stage Par CZ 100",
    widthCm: 20,
    type: "w-light",
    modes: [
        {
            name: "3ch",
            props: ["dimmer", {type: "custom", label: "dimmer fine"}, "strobe"],
        },
    ],
});
