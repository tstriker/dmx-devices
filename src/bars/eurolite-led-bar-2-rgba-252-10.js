import {ModelFactory} from "../device.js";
import {rangeProp} from "../utils.js";

export default ModelFactory({
    model: "Eurolite LED Bar 2 RGBA 252/10",
    widthCm: 20,
    type: "rgb-light",
    config: [
        {
            name: "4ch",
            props: {
                red: rangeProp({label: "Red"}),
                green: rangeProp({label: "Green"}),
                blue: rangeProp({label: "Blue"}),
                blue: rangeProp({label: "Amber"}),
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
                            },
                        },
                        amber: "amber",
                    },
                },
            ],
        },
    ],
});
