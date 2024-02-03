import {ModelFactory} from "../device.js";
import {rangeProp} from "../utils.js";

export default ModelFactory({
    model: "Chauvet 120ST",
    type: "rgb-light",
    config: {
        name: "3ch",
        props: {
            dimmer: rangeProp({label: "Dimmer"}),

            wheel: {
                label: "Color Wheel",
                modes: [
                    {chVal: 0, val: "coolWhite", color: "#fff"},
                    {chVal: 32, val: "warmWhite", color: "#fff"},

                    {chVal: 64, val: "yellow", color: "#f5ef27"},
                    {chVal: 96, val: "purple", color: "#ad2eed"},
                    {chVal: 128, val: "green", color: "#00ff00"},
                    {chVal: 160, val: "red", color: "#ff0000"},
                    {chVal: 192, val: "blue", color: "#4f9ae5"},
                    {chVal: 224, val: "orange", color: "#ed982e"},
                ],
                defaultVal: "warmWhite", // yellow sits in the middle of color wheel, so a good place to return to
            },

            strobe: {
                stops: [
                    {val: 0, chVal: 7},
                    {val: 0.1, chVal: 8},
                    {val: 1, chVal: 215},
                ],
                defaultVal: 0,
            },
        },

        pixels: [
            {
                id: "light",
                label: "Light",
                controls: {
                    strobe: "strobe",
                },
            },
        ],
    },
});
