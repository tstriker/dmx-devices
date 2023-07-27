import {ModelFactory} from "../../device.js";
import {rangeProp} from "../../utils.js";

export default ModelFactory({
    model: "CentoLight Plot 200FZ",
    widthCm: 20,
    type: "w-light",
    config: [
        {
            name: "2ch",
            props: {
                brightness: rangeProp({label: "Brightness"}),
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
                                white: "brightness",
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
                brightness: rangeProp({label: "brightness"}),
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
                                white: "brightness",
                            },
                        },
                        strobe: "strobe",
                    },
                },
            ],
        },
    ],
});
