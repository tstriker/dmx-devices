import {ModelFactory} from "../device.js";
import {rangeProp} from "../utils.js";

export default ModelFactory({
    model: "Thomann Stairville Par 56",
    widthCm: 20,
    type: "rgb-light",
    config: [
        {
            name: "6ch",
            props: {
                red: rangeProp({label: "Red"}),
                green: rangeProp({label: "Green"}),
                blue: rangeProp({label: "Blue"}),
                colorMacro: rangeProp({ui: false}),
                strobe: rangeProp({}),
                macro: rangeProp({ui: false}),
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
                    },
                },
            ],
        },
    ],
});
