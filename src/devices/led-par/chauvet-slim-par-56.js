import {ModelFactory, rangeProp} from "../../device.js";

let red = rangeProp({channel: 1, label: "Red"});
let green = rangeProp({channel: 2, label: "Green"});
let blue = rangeProp({channel: 3, label: "Blue"});

let strobe = rangeProp({channel: 5, label: "Blue"});
let programs = rangeProp({channel: 6, label: "Blue"});

export default ModelFactory({
    label: "Chauvet Slim PAR 56",
    widthCm: 20,
    type: "rgb-light",

    config: [
        {
            channels: 3,
            props: {red, green, blue},
            controls: [
                {
                    name: "light",
                    type: "rgb-light",
                    label: "Light",
                    props: {
                        red: "red",
                        green: "green",
                        blue: "blue",
                    },
                },
            ],
        },
        {
            channels: 7,
            props: {
                red,
                green,
                blue,
                colorMacros: rangeProp({channel: 4, label: "Blue"}),
                strobe: rangeProp({channel: 5, label: "Blue"}),
                programs: rangeProp({channel: 6, label: "Blue"}),
                dimmer: rangeProp({channel: 7, label: "Dimmer", defaultVal: 255}),
            },
            controls: [
                {
                    name: "light",
                    type: "rgb-light",
                    label: "Light",
                    props: {
                        red: "red",
                        green: "green",
                        blue: "blue",
                        dimmer: "dimmer",
                    },
                },
            ],
        },
    ],
});
