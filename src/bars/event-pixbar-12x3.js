import {ModelFactory} from "../device.js";
import {rangeProp, repeatProps, repeatPixels} from "../utils.js";

let dimmer = rangeProp({label: "Dimmer", activeDefault: 1});
let strobe = {
    label: "Strobe",
    stops: [
        {chVal: 0, val: 0},
        {chVal: 10, val: 0.1},
        {chVal: 255, val: 1},
    ],
};
let red = rangeProp({label: "Red"});
let green = rangeProp({label: "Green"});
let blue = rangeProp({label: "Blue"});

export default ModelFactory({
    model: "Event Pixbar 12x3",
    widthCm: 110,
    type: "rgb-bar",
    config: [
        {
            name: "3ch",
            lights: 1,
            props: {red, green, blue},
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

        {
            name: "36ch",
            lights: 12,

            props: {
                ...repeatProps(12, {"red#": red, "green#": green, "blue#": blue}),
            },
            pixels: repeatPixels(12, {
                id: "light#",
                label: "Light #",

                controls: {
                    color: {
                        type: "rgb-light",
                        props: {
                            red: "red#",
                            green: "green#",
                            blue: "blue#",
                        },
                    },
                },
            }),
        },
    ],
});
