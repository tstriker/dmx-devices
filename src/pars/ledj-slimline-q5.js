import {ModelFactory} from "../device.js";
import {rangeProp} from "../utils.js";

export default ModelFactory({
    model: "Slimline Q5",
    widthCm: 20,
    type: "rgb-light",
    config: [
        {
            name: "3ch",
            props: {
                red: rangeProp({label: "Red"}),
                green: rangeProp({label: "Red"}),
                blue: rangeProp({label: "Red"}),
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
            name: "7ch RGBW",
            props: {
                dimmer: rangeProp({label: "Dimmer", defaultVal: 1}),
                strobe: rangeProp({label: "Strobe"}),
                red: rangeProp({label: "Red"}),
                green: rangeProp({label: "Red"}),
                blue: rangeProp({label: "Red"}),
                white: rangeProp({label: "White"}),
                colorCycle: rangeProp({label: "Color Cycle", ui: false}),
            },
            pixels: [
                {
                    id: "light",
                    label: "Light",
                    controls: {
                        color: {
                            type: "rgbw-light",
                            props: {
                                red: "red",
                                green: "green",
                                blue: "blue",
                                white: "white",
                            },
                        },
                        strobe: "strobe",
                    },
                },
            ],
        },
    ],
});
