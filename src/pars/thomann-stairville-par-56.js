import {ModelFactory} from "../device.js";
import {rangeProp} from "../utils.js";

export default ModelFactory({
    model: "Thomann Stairville Par 56",
    widthCm: 20,
    type: "rgb-light",
    config: [
        {
            name: "5ch",
            props: {
                mode: {
                    modes: [
                        {chVal: 0, val: "RGB"},
                        {chVal: 64, val: "7 Color fade"},
                        {chVal: 128, val: "7 Colour Change"},
                        {chVal: 192, val: "3 Colour Change"},
                    ],
                },
                red: rangeProp({label: "Red"}),
                green: rangeProp({label: "Green"}),
                blue: rangeProp({label: "Blue"}),
                speed: rangeProp({label: "Speed"}),
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
