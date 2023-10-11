import {ModelFactory} from "../device.js";
import {rangeProp} from "../utils.js";

export default ModelFactory({
    model: "LeDJ Stage Par CZ 120",
    widthCm: 20,
    type: "rgba-light",
    config: [
        {
            name: "4ch",
            props: {
                red: rangeProp({label: "Red"}),
                green: rangeProp({label: "Green"}),
                blue: rangeProp({label: "Blue"}),
                amber: rangeProp({label: "Amber"}),
            },
            pixels: [
                {
                    id: "light",
                    label: "Light",
                    controls: {
                        color: {
                            type: "rgb-light",
                            props: {
                                red: "red",
                                green: "green",
                                blue: "blue",
                               // amber: "amber",
                            },
                        },
                        amber: "amber",
                    },
                },
            ],
        },
    ],
});
