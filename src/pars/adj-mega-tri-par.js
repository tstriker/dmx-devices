import {ModelFactory} from "../device.js";
import {rangeProp} from "../utils.js";

let strobe = {
    // even though the tripar is capable of several strobe modes, we default to the standard
    // as anything more sophisticated can be implemented on software side
    label: "Strobe",
    stops: [
        {val: 0, chVal: 63},
        {val: 0.1, chVal: 64},
        {val: 1, chVal: 95},
    ],
    defaultVal: 0,
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
                brightness: rangeProp({defaultVal: 1}),
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
