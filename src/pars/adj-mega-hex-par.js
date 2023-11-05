import {ModelFactory} from "../device.js";
import {rangeProp} from "../utils.js";

let strobe = {
    // even though the tripar is capable of several strobe modes, we default to the standard
    // as anything more sophisticated can be implemented on software side
    defaultDMXVal: 63,
    stops: [
        {val: 0, chVal: 63},
        {val: 0.1, chVal: 64},
        {val: 1, chVal: 95},
    ],
};

let colorControl = {
    type: "rgbw-light",
    props: {
        red: "red",
        green: "green",
        blue: "blue",
        white: "white",
    },
};

function getPixels(controls) {
    return [{id: "light", label: "Light", controls}];
}

export default ModelFactory({
    model: "ADJ Mega HEX Par",
    widthCm: 20,
    type: "rgbw-light",

    config: [
        {
            name: "6ch",
            props: {
                red: rangeProp({}),
                green: rangeProp({}),
                blue: rangeProp({}),
                white: rangeProp({}),
                amber: rangeProp({}),
                uv: rangeProp({}),
            },
            pixels: getPixels({color: colorControl}),
        },
        {
            name: "8ch",
            props: {
                red: rangeProp({}),
                green: rangeProp({}),
                blue: rangeProp({}),
                white: rangeProp({}),
                amber: rangeProp({}),
                uv: rangeProp({}),
                brightness: rangeProp({defaultDMXVal: 255}),
                strobe,
            },
            pixels: getPixels({
                color: colorControl,
            }),
        },
    ],
});
