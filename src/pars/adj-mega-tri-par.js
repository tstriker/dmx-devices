import {ModelFactory} from "../device.js";
import {rangeProp} from "../utils.js";

let strobe = {
    // even though the tripar is capable of several strobe modes, we default to the standard
    // as anything more sophisticated can be implemented on software side
    label: "Strobe",
    modes: [
        {chVal: 32, val: "Don't strobe"},
        {chVal: 64, val: "Strobe slow-fast", range: 32},
        {chVal: 128, val: "Pulse strobe", range: 32},
        {chVal: 192, val: "Random strobe", range: 32},
    ],
    defaultVal: 32,
};

let colorControl = {
    name: "light",
    type: "rgb-light",
    label: "Light",
    props: {
        red: "red",
        green: "green",
        blue: "blue",
    },
};

export default ModelFactory({
    model: "ADJ Mega TRI Par",
    widthCm: 20,
    type: "rgb-light",

    config: [
        {
            name: "4ch",
            props: {
                red: rangeProp({}),
                green: rangeProp({}),
                blue: rangeProp({}),
                uv: rangeProp({}),
            },
            pixels: [
                {
                    id: "light",
                    label: "Light",
                    controls: {
                        color: colorControl,
                        uv: "uv",
                    },
                },
            ],
        },
        {
            name: "6ch",
            props: {
                red: rangeProp({}),
                green: rangeProp({}),
                blue: rangeProp({}),
                uv: rangeProp({}),
                strobe: strobe,
                brightness: rangeProp({label: "Dimmer (always on)", activeDefault: 255, ui: false}),
            },
            pixels: [
                {
                    id: "light",
                    label: "Light",
                    controls: {
                        color: colorControl,
                    },
                },
            ],
        },
    ],
});
