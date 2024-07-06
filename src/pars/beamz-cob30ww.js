import {ModelFactory} from "../device.js";
import {rangeProp} from "../utils.js";

export default ModelFactory({
    model: "Beamz COB30WW",
    widthCm: 20,
    type: "w-light",
    config: {
        name: "3ch",
        props: {
            dimmer: rangeProp({channel: 1, label: "Dimmer"}),
            strobe: {
                label: "Strobe",
                stops: [
                    {chVal: 0, val: 0, label: "off"},
                    {chVal: 10, val: 0.01},
                    {chVal: 255, val: 1},
                ],
            },
            mode: {
                label: "Mode",
                ui: false,
                modes: [
                    {chVal: 0, val: 0, label: "Light Off"},
                    {chVal: 10, val: "auto_1", label: "Light On"},
                    {chVal: 40, val: "auto_2", label: "Pulse"},
                    {chVal: 70, val: "auto_3", label: "Strobe"},
                    {chVal: 100, val: "auto_4", label: "Dim-strobe"},
                    {chVal: 130, val: "sound_1", label: "Equalizer Pulse"},
                    {chVal: 160, val: "sound_2", label: "Equalizer Dim"},
                    {chVal: 190, val: "sound_3", label: "Equalizer Pulse 2"},
                ],
                defaultVal: "auto_1",
            },
        },

        pixels: [
            {
                id: `light`,
                label: `Light`,
                controls: {
                    color: {
                        type: "w-light",
                        props: {
                            dimmer: "dimmer",
                        },
                    },
                    strobe: "strobe",
                },
            },
        ],
    },
});
