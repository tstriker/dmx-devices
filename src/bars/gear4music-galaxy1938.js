import {ModelFactory} from "../device.js";
import {rangeProp, repeatProps, repeatPixels} from "../utils.js";

let red = rangeProp({label: "Red"});
let green = rangeProp({label: "Green"});
let blue = rangeProp({label: "Blue"});

export default ModelFactory({
    model: "Gear4Music Galaxy 19/38",
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
            name: "6ch",
            lights: 1,
            props: {
                red,
                green,
                blue,
                strobe: {
                    label: "Strobe",
                    stops: [
                        {chVal: 0, val: 0},
                        {chVal: 10, val: 0.1},
                        {chVal: 255, val: 1},
                    ],
                },
                strobeModes: rangeProp({label: "Dimming and strobe modes"}),
                autoRun: rangeProp({label: "Auto running speed"}),
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
        {
            name: "14ch",
            lights: 4,

            props: {
                ...repeatProps(4, {"red#": red, "green#": green, "blue#": blue}),
                strobe: {
                    label: "Strobe",
                    stops: [
                        {chVal: 0, val: 0},
                        {chVal: 10, val: 0.1},
                        {chVal: 255, val: 1},
                    ],
                },
                dimmer: rangeProp({label: "Dimmer", activeDefault: 1}),
            },
            pixels: repeatPixels(4, {
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
