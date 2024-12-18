import {ModelFactory} from "../device.js";
import {rangeProp} from "../utils.js";

export default ModelFactory({
    model: "RGB Par",
    widthCm: 20,
    type: "rgb-light",
    config: [
        {
            name: "3ch",
            props: {
                red: rangeProp({label: "Red"}),
                green: rangeProp({label: "Green"}),
                blue: rangeProp({label: "Blue"}),
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
                    },
                },
            ],
        },
        {
            name: "6ch",
            props: {
                dimmer: rangeProp({channel: 1, label: "Dimmer", activeDefault: 255}),
                red: rangeProp({channel: 2, label: "Red"}),
                green: rangeProp({channel: 3, label: "Red"}),
                blue: rangeProp({channel: 4, label: "Red"}),
                strobe: rangeProp({channel: 5, label: "Strobe"}),
                colorCycle: rangeProp({channel: 6, label: "Color Cycle", ui: false}),
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
