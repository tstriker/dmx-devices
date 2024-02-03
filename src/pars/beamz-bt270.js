import {ModelFactory} from "../device.js";
import {rangeProp} from "../utils.js";

export default ModelFactory({
    model: "Beamz BT270",
    widthCm: 20,
    type: "rgb-light",

    config: [
        {
            name: "3ch",
            props: {
                red: rangeProp({}),
                green: rangeProp({}),
                blue: rangeProp({}),
            },
            pixels: [
                {
                    id: "light",
                    label: "Light",
                    controls: {
                        color: {
                            name: "light",
                            type: "rgb-light",
                            label: "Light",
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
            name: "4ch",
            props: {
                red: rangeProp({}),
                green: rangeProp({}),
                blue: rangeProp({}),
                white: rangeProp({}),
            },
            pixels: [
                {
                    id: "light",
                    label: "Light",
                    controls: {
                        color: {
                            name: "light",
                            type: "rgbw-light",
                            label: "Light",
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
                brightness: rangeProp({label: "Dimmer (always on)", defaultVal: 1}),
                strobe: rangeProp({}),
                red: rangeProp({}),
                green: rangeProp({}),
                blue: rangeProp({}),
                white: rangeProp({}),
                staticColor: rangeProp({}),
                colorMacro: rangeProp({}),
            },
            pixels: [
                {
                    id: "light",
                    label: "Light",
                    controls: {
                        color: {
                            name: "light",
                            type: "rgbw-light",
                            label: "Light",
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
    ],
});
