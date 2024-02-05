import {ModelFactory} from "../device.js";
import {rangeProp} from "../utils.js";

export default ModelFactory({
    model: "Chauvet EVE E-50Z",
    widthCm: 20,
    type: "w-light",
    config: {
        name: "3ch",
        props: {
            brightness: rangeProp({label: "Brightness", defaultVal: 0}),
            strobe: {
                label: "Strobe",
                stops: [
                    {chVal: 0, val: 0, label: "off"},
                    {chVal: 10, val: 0.01},
                    {chVal: 255, val: 1},
                ],
            },
            dimmerMode: {
                label: "Dimmer Mode",
                modes: [
                    {chVal: 0, val: "display", label: "From Display"},
                    {chVal: 52, val: "off", label: "Mode Off"},

                    {chVal: 102, val: "fast", label: "Fast"},
                    {chVal: 153, val: "medium", label: "Medium"},
                    {chVal: 204, val: "slot", label: "Slow"},
                ],
                defaultVal: "display",
            },
        },

        pixels: [
            {
                id: "light",
                label: "Light",
                controls: {
                    color: {
                        type: "w-light",
                        props: {
                            white: "brightness",
                        },
                    },
                    strobe: "strobe",
                },
            },
        ],
    },
});
