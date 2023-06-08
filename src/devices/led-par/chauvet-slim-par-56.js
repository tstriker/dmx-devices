import {ModelFactory, rangeProp} from "../../device.js";

let red = rangeProp({channel: 1, label: "Red"});
let green = rangeProp({channel: 2, label: "Green"});
let blue = rangeProp({channel: 3, label: "Blue"});

export default ModelFactory({
    label: "Chauvet Slim PAR 56",
    widthCm: 20,
    type: "rgb-light",

    config: [
        {
            channels: 3,
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
            channels: 7,
            props: {
                red,
                green,
                blue,
                colorMacros: rangeProp({channel: 4, label: "Color Macros"}),
                strobe: rangeProp({channel: 5, label: "Strobe"}),
                programs: rangeProp({channel: 6, label: "Program"}),
                dimmer: rangeProp({channel: 7, label: "Dimmer", defaultDMXVal: 255}),
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
