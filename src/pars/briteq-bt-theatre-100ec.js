import {ModelFactory} from "../device.js";
import {rangeProp} from "../utils.js";

export default ModelFactory({
    model: "Briteq BT-Theatre 100EC",
    widthCm: 20,
    type: "light",
    config: {
        name: "2ch",
        props: {
            brightness: rangeProp({label: "Brightness", defaultVal: 1}),
            strobe: {
                label: "Strobe",
                stops: [
                    {chVal: 0, val: 0, label: "off"},
                    {chVal: 5, val: 0.01},
                    {chVal: 255, val: 1},
                ],
            },
        },

        pixels: [
            {
                id: `light`,
                label: `Light`,
                controls: {
                    color: {
                        type: "light",
                        props: {
                            light: "brightness",
                        },
                    },
                    strobe: "strobe",
                },
            },
        ],
    },
});
