import {ModelFactory} from "../device.js";
import {rangeProp} from "../utils.js";

export default ModelFactory({
    model: "LeDJ Stage Par CZ 100",
    widthCm: 20,
    type: "w-light",
    config: [
        {
            name: "4ch",
            props: {
                dimmer: rangeProp({activeDefault: 255}),
            },
            pixels: [
                {
                    id: `light`,
                    label: `Light`,
                    controls: {
                        color: {
                            type: "w-light",
                            props: {
                                dimmer: "dimmer",
                            },
                        },
                    },
                },
            ],
        },
    ],
});
