import {ModelFactory} from "../device.js";
import {rangeProp, repeatProps, repeatPixels} from "../utils.js";

let dimmer = rangeProp({label: "Dimmer", defaultVal: 1});
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

// the spectrapix batten is exactly same as the beamz 224, except they put the strobe in 53 channel mode at the start
// not in the end (makes way more sense)
export default ModelFactory({
    model: "Equinox SpectraPix Batten",
    widthCm: 110,
    type: "two-row-bar",
    config: [
        {
            name: "3ch 2",
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
            name: "24ch",
            lights: 8,
            props: repeatProps(1, 8, {"red#": red, "green#": green, "blue#": blue}),
            pixels: repeatPixels(8, {
                id: "light#",
                label: "Light #",
                controls: {
                    dimmer: "dimmer#",
                    strobe: "strobe#",
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
            name: "48ch",
            lights: 16,

            props: repeatProps(1, 16, {"red#": red, "green#": green, "blue#": blue}),
            pixels: repeatPixels(16, {
                id: "light#",
                label: "Light #",
                group: idx => (idx <= 8 ? 0 : 1),
                controls: {
                    dimmer: "dimmer#",
                    strobe: "strobe#",
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
                strobe,
                ...repeatProps(16, {"red#": red, "green#": green, "blue#": blue}),
            },
            pixels: repeatPixels(16, {
                id: "light#",
                label: "Light #",
                group: idx => (idx <= 8 ? 0 : 1),
                controls: {
                    dimmer: "dimmer#",
                    strobe: "strobe#",
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
