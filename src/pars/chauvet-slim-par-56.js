import {ModelFactory} from "../device.js";
import {rangeProp} from "../utils.js";

let red = rangeProp({channel: 1, label: "Red"});
let green = rangeProp({channel: 2, label: "Green"});
let blue = rangeProp({channel: 3, label: "Blue"});

export default ModelFactory({
    model: "Chauvet Slim PAR 56",
    widthCm: 20,
    type: "rgb-light",

    config: [
        {
            name: "3ch",
            props: {red, green, blue},
            pixels: [
                {
                    id: "light",
                    label: "Light",
                    controls: {
                        color: {
                            type: "rgb-light",
                            props: {
                                red: "red",
                                green: "green",
                                blue: "blue",
                            },
                        },
                    },
                },
            ],
        },
        {
            name: "7ch",
            props: {
                red,
                green,
                blue,
                colorMacros: rangeProp({channel: 4, label: "Color Macros", ui: false}),
                strobe: rangeProp({channel: 5, label: "Strobe"}),
                programs: rangeProp({channel: 6, label: "Program"}),
                dimmer: rangeProp({channel: 7, label: "Dimmer", defaultVal: 1}),
            },
            pixels: [
                {
                    id: "light",
                    label: "Light",
                    controls: {
                        color: {
                            type: "rgb-light",
                            props: {
                                red: "red",
                                green: "green",
                                blue: "blue",
                            },
                        },
                        dimmer: "dimmer",
                        strobe: "strobe",
                    },
                },
            ],
        },
    ],
});
