import {ModelFactory, rangeProp} from "../../device.js";

export default ModelFactory({
    label: "Plain LEDLight",
    widthCm: 20,
    type: "rgb-light",
    config: {
        props: {
            dimmer: rangeProp({channel: 1, label: "Dimmer", defaultVal: 255}),
            red: rangeProp({channel: 2, label: "Red"}),
            green: rangeProp({channel: 3, label: "Green"}),
            blue: rangeProp({channel: 4, label: "Blue"}),
            strobe: rangeProp({channel: 5, label: "Strobe"}),
            colorCycle: rangeProp({channel: 6, label: "Color Cycle"}),
        },

        controls: [
            {
                name: "color",
                type: "rgb-light",
                label: `Color`,
                props: {
                    red: "red",
                    green: "green",
                    blue: "blue",
                    strobe: "strobe",
                    dimmer: "dimmer",
                },
            },
        ],
    },
});
