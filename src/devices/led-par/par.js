import {ModelFactory, rangeProp} from "../../device.js";

export default ModelFactory({
    label: "RGB Par",
    widthCm: 20,
    type: "rgb-light",
    config: [
        {
            channels: 3,
            props: {
                red: rangeProp({channel: 1, label: "Red"}),
                green: rangeProp({channel: 2, label: "Red"}),
                blue: rangeProp({channel: 3, label: "Red"}),
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
            channels: 6,
            props: {
                dimmer: rangeProp({channel: 1, label: "Dimmer", defaultVal: 255}),
                red: rangeProp({channel: 2, label: "Red"}),
                green: rangeProp({channel: 3, label: "Red"}),
                blue: rangeProp({channel: 4, label: "Red"}),
                strobe: rangeProp({channel: 5, label: "Strobe"}),
                colorCycle: rangeProp({channel: 6, label: "Color Cycle"}),
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