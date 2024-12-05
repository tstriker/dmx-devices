import {ModelFactory} from "../device.js";
import {rangeProp} from "../utils.js";

export default ModelFactory({
    model: "CentoLight Plot 200FZ",
    widthCm: 20,
    type: "w-light",
    config: [
        {
            name: "2ch",
            props: {
                dimmer: rangeProp({activeDefault: 255}),
                zoom: rangeProp({}),
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
                        zoom: "zoom",
                    },
                },
            ],
        },

        {
            name: "3ch",
            props: {
                dimmer: rangeProp({activeDefault: 255}),
                strobe: {
                    label: "Strobe",
                    stops: [
                        {chVal: 0, val: 0, label: "off"},
                        {chVal: 10, val: 0.01},
                        {chVal: 255, val: 1},
                    ],
                },
                zoom: rangeProp({label: "Zoom"}),
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
                        strobe: "strobe",
                    },
                },
            ],
        },
    ],
});
