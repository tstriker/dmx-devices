import {ModelFactory} from "../device.js";
import {rangeProp} from "../utils.js";

export default ModelFactory({
    model: "Equinox Color Raider",
    widthCm: 20,
    type: "rgbw-light",
    config: [
        {
            name: "3ch",
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
            name: "4ch-1",
            props: {
                red: rangeProp({channel: 1, label: "Red"}),
                green: rangeProp({channel: 2, label: "Red"}),
                blue: rangeProp({channel: 3, label: "Red"}),
                white: rangeProp({channel: 4, label: "Red"}),
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
                                white: "white",
                            },
                        },
                    },
                },
            ],
        },

        {
            name: "8ch",
            props: {
                dimmer: rangeProp({channel: 1, label: "Dimmer", defaultVal: 1}),
                strobe: rangeProp({
                    channel: 2,
                    label: "Strobe",
                    stops: [
                        {chVal: 0, val: 0},
                        {chVal: 10, val: 0.1},
                        {chVal: 255, val: 1},
                    ],
                }),
                red: rangeProp({channel: 3, label: "Red"}),
                green: rangeProp({channel: 4, label: "Red"}),
                blue: rangeProp({channel: 5, label: "Red"}),
                white: rangeProp({channel: 6, label: "White"}),
                colorPreset: rangeProp({channel: 7, label: "Color Preset"}),
                colorFade: rangeProp({channel: 8, label: "Color Fade"}),
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
                                white: "white",
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
