import {ModelFactory} from "../device.js";
import {rangeProp} from "../utils.js";

export default ModelFactory({
    model: "Thomann Stairville Octagon Theatre CW WW",
    widthCm: 20,
    type: "rgb-light",
    config: [
        {
            name: "5ch",
            props: {
                cool: rangeProp({label: "Cool White"}),
                warm: rangeProp({label: "Warm White"}),
                strobe: rangeProp({label: "Strobe"}),
                mode: rangeProp({ui: false}),
                brightness: rangeProp({label: "Dimmer (always on)", activeDefault: 255, ui: false}),
            },

            pixels: [
                {
                    id: `light`,
                    label: `Light`,
                    controls: {
                        color: {
                            type: "cool-warm-light",
                            props: {
                                cool: "cool",
                                warm: "warm",
                            },
                        },
                        strobe: "strobe",
                    },
                },
            ],
        },
    ],
});
