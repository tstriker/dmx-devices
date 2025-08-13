import {parseFixtureConfig} from "../parser.js";

export default parseFixtureConfig({
    model: "Briteq BT-Theatre 100EC",
    widthCm: 20,
    type: "w-light",
    modes: [
        {
            name: "2ch",
            props: [{type: "dimmer", activeDefault: 255}, "strobe"],
        },
    ],
});
