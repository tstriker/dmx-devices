import {parseFixtureConfig} from "../parser.js";

export default parseFixtureConfig({
    model: "Centolight Plot FZ6200",
    widthCm: 20,
    type: "rgb-light",

    modes: [
        {
            name: "12ch",
            props: [
                {type: "dimmer", activeDefault: 255},
                {type: "custom", label: "CCT", ui: false},

                // dimmer change determines wheter we specify output in kelvins, or RGB
                // right now we can only work with RGB as my kelvin math is weak
                {type: "custom", label: "Dimmer Change", defaultVal: 255, ui: false},
                "red",
                "green",
                "blue",
                "lime",
                "amber",
                "cyan",
                "zoom",
                "strobe",
            ],
        },
    ],
});
