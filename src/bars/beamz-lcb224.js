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
    model: "Beamz LCB 224",
    widthCm: 110,
    type: "two-row-bar",
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
            name: "5ch",
            lights: 1,
            props: {dimmer, strobe, red, green, blue},
            pixels: [
                {
                    id: "light",
                    label: "Light",
                    controls: {
                        dimmer: "dimmer",
                        strobe: "strobe",
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
            name: "48ch",
            lights: 16,
            props: repeatProps(16, {"red#": red, "green#": green, "blue#": blue}),
            pixels: repeatPixels(16, {
                id: "light#",
                label: "Light #",
                group: idx => (idx <= 8 ? 0 : 1),
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

        {
            name: "53ch",
            lights: 16,
            props: {
                dimmer,
                ...repeatProps(16, {"red#": red, "green#": green, "blue#": blue}),
                strobe: {...strobe, channel: 53},
            },
            pixels: repeatPixels(16, {
                id: "light#",
                label: "Light #",
                group: idx => (idx <= 8 ? 0 : 1),
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
