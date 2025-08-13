import {parseFixtureConfig} from "../parser.js";

export default parseFixtureConfig({
    model: "Dimmer",
    widthCm: 20,
    type: "fader",
    modes: [
        {
            name: "1ch",
            props: ["dimmer"],
        },
    ],
});
