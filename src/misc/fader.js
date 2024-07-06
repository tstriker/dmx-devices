import {ModelFactory} from "../device.js";
import {rangeProp} from "../utils.js";

export default ModelFactory({
    model: "Fader",
    widthCm: 20,
    type: "fader",
    config: {
        name: "1ch",
        props: {
            fader: rangeProp({}),
        },

        pixels: [
            {
                id: `fader`,
                label: `Fader`,
                controls: {
                    color: {
                        type: "fader",
                        props: {
                            light: "fader",
                        },
                    },
                },
            },
        ],
    },
});
