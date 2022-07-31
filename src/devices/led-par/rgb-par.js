import {ModelFactory, rangeProp} from "../../device.js";

export default ModelFactory({
    label: "RGB Par",
    widthCm: 20,
    type: "rgb-light",
    config: {
        props: {
            red: rangeProp({channel: 1, label: "Red"}),
            green: rangeProp({channel: 2, label: "Green"}),
            blue: rangeProp({channel: 3, label: "Blue"}),
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
                },
            },
        ],
    },
});
