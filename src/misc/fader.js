import {ModelFactory} from "../device.js";
import {rangeProp} from "../utils.js";

export default ModelFactory({
    model: "Fader",
    widthCm: 20,
    type: "light",
    config: {
        name: "1ch",
        props: {
            brightness: rangeProp({label: "Brightness"}),
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
