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
                strobe: {
                    label: "Strobe",
                    stops: [
                        {chVal: 0, val: 0, label: "off"},
                        {chVal: 16, val: 0.01},
                        {chVal: 255, val: 1},
                    ],
                },
                mode: rangeProp({}),
                pixelDimmer: rangeProp({label: "Dimmer (always on)", defaultVal: 1}),
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
