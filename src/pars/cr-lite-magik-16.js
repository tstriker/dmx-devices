import {ModelFactory} from "../device.js";
import {rangeProp} from "../utils.js";

export default ModelFactory({
    model: "CR Lite Magik 16",
    widthCm: 20,
    type: "rgbw-light",

    config: {
        name: "9ch",
        props: {
            brightness: rangeProp({defaultVal: 1}),
            red: rangeProp({}),
            green: rangeProp({}),
            blue: rangeProp({}),
            white: rangeProp({}),
            uv: rangeProp({}),
            amber: rangeProp({}),
            strobe: {
                stops: [
                    {val: 0, chVal: 63},
                    {val: 0.1, chVal: 64},
                    {val: 1, chVal: 95},
                ],
                defaultVal: 0,
            },
            colorChange: rangeProp({}),
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
                },
            },
        ],
    },
});
