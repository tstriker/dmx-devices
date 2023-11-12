import {ModelFactory} from "../device.js";
import {rangeProp} from "../utils.js";

export default ModelFactory({
    model: "Dimmer",
    widthCm: 20,
    type: "light",
    config: {
        name: "1ch",
        props: {
            brightness: rangeProp({label: "Brightness", defaultVal: 1}),
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
                },
            },
        ],
    },
});
