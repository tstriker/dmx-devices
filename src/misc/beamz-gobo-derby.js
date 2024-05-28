import {ModelFactory} from "../device.js";
import {rangeProp} from "../utils.js";

export default ModelFactory({
    model: "Beamz Gobo Derby",
    widthCm: 20,
    type: "rgbw-light",

    config: [
        {
            name: "9ch",
            props: {
                rotation: rangeProp({label: "Rotation"}),
                dimmer: rangeProp({defaultVal: 1}),
                wheel: {
                    label: "Derby Color",
                    modes: [
                        {chVal: 0, val: "off", color: "#fff"},
                        {chVal: 10, val: "red", color: "#ff0000"},
                        {chVal: 20, val: "green", color: "#00ff00"},
                        {chVal: 30, val: "blue", color: "#4f9ae5"},
                        {chVal: 40, val: "amber", color: "#feb204"},

                        {chVal: 50, val: "red + green", color: "#ffff00"},
                        {chVal: 60, val: "green + blue"},
                        {chVal: 70, val: "blue + amber"},
                        {chVal: 80, val: "red + amber"},
                        {chVal: 90, val: "red + blue"},
                        {chVal: 100, val: "green + amber"},

                        {chVal: 110, val: "blue + green + amber"},
                        {chVal: 120, val: "red + blue + amber"},
                        {chVal: 130, val: "red + green + amber"},
                        {chVal: 140, val: "red + green + blue"},
                        {chVal: 150, val: "All On"},
                        {chVal: 160, val: "LED Automatic"},
                    ],
                    defaultVal: "red + green",
                },

                strobe: rangeProp({defaultVal: 0}),
                uv1: rangeProp({defaultVal: 0, label: "UV 1"}),
                uv2: rangeProp({defaultVal: 0, label: "UV 2"}),

                autoSound: rangeProp({defaultVal: 0, ui: false}),
                autoSoundUV: rangeProp({defaultVal: 0, ui: false}),
            },
            pixels: [
                {
                    id: "light",
                    label: "Light",
                    controls: {},
                },
            ],
        },
    ],
});
