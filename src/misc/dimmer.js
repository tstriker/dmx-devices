import {ModelFactory} from "../device.js";
import {rangeProp} from "../utils.js";

export default ModelFactory({
    model: "Dimmer",
    widthCm: 20,
    type: "fader",
    config: {
        name: "1ch",
        props: {
            fader: rangeProp({label: "Fader", activeDefault: 1}),
        },

        pixels: [
            {
                id: `fader`,
                label: `Fader`,
                controls: {
                    color: {
                        type: "fader",
                        props: {
                            fader: "fader",
                        },
                    },
                },
            },
        ],
    },
});
