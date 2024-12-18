import {ModelFactory} from "../device.js";
import {rangeProp} from "../utils.js";

let configs = [];

// generate 1, 2, 4, and 8 segment versions (same light, just the number of individually controllable lights change
// based on the allocated channel count
[9, 16, 30, 58].forEach(channels => {
    // we get 1/2/4/8 segments, with seven controls per segment
    let lights = (channels - 2) / 7;

    let config = {
        lights,
        props: {
            // chases live at the end of the config (channels n and n-1)
            chase: {
                channel: channels - 1,
                label: "Chase",
                ui: false,
                modes: [
                    {chVal: 0, val: 0, label: "Off"},
                    {chVal: 8, val: "chase1", label: "Built-in program 1"},
                    {chVal: 23, val: "chase2", label: "Built-in program 2"},
                    {chVal: 38, val: "chase3", label: "Built-in program 3"},
                    {chVal: 53, val: "chase4", label: "Built-in program 4"},
                    {chVal: 68, val: "chase5", label: "RGBW Bounce"},
                    {chVal: 83, val: "chase6", label: "Built-in program 6"},
                    {chVal: 98, val: "chase7", label: "RGBW Chase"},
                    {chVal: 113, val: "chase8", label: "RGB Spaced chase"},
                    {chVal: 128, val: "chase9", label: "Multi-color Inwards Fill"},

                    {chVal: 143, val: "chase10", label: "Built-in program 10"},
                    {chVal: 158, val: "chase11", label: "BG Chase"},
                    {chVal: 173, val: "chase12", label: "Multi-color spaced bounce and chase"},
                    {chVal: 188, val: "chase13", label: "Unload left"},
                    {chVal: 203, val: "chase14", label: "Unload right"},
                    {chVal: 218, val: "chase15", label: "Fade chase"},
                    {chVal: 233, val: "chase16", label: "Fade bounce"},
                    {chVal: 248, val: "chase17", label: "Sound effect 1-16"},
                ],
            },
            chaseSensitivity: {
                channel: channels - 1,
                label: "Chase Sensitivity",
                modifies: "chase",
                ui: false,
                condition: device => device.chase.dmx < 248,
                stops: [
                    {label: "off", chVal: 0, val: 0},
                    {label: "high", chVal: 14, val: 1},
                ],
            },

            chaseSpeed: rangeProp({channel: channels, label: "Chase Speed", ui: false}),
        },

        pixels: [],
    };

    for (let idx = 1; idx <= lights; idx += 1) {
        let colorAddress = (idx - 1) * 7;
        config.props = {
            ...config.props,
            [`dimmer${idx}`]: rangeProp({channel: colorAddress + 1, label: `Dimmer ${idx}`, activeDefault: 255, ui: false}),

            [`strobe${idx}`]: {
                channel: colorAddress + 2,
                label: `Strobe ${idx}`,
                ui: false,
                stops: [
                    {chVal: 0, val: 0},
                    {chVal: 1, val: 0.001},
                    {chVal: 255, val: 1},
                ],
            },
            [`red${idx}`]: rangeProp({channel: colorAddress + 3, label: `Red ${idx}`}),
            [`green${idx}`]: rangeProp({channel: colorAddress + 4, label: `Green ${idx}`}),
            [`blue${idx}`]: rangeProp({channel: colorAddress + 5, label: `Blue ${idx}`}),
            [`white${idx}`]: rangeProp({channel: colorAddress + 6, label: `White ${idx}`}),
            [`cycle${idx}`]: rangeProp({channel: colorAddress + 7, label: `Auto ${idx}`, ui: false}),
        };

        config.pixels.push({
            id: `light${idx}`,
            label: `Light ${idx}`,
            controls: {
                color: {
                    type: "rgbw-light",
                    props: {
                        red: `red${idx}`,
                        green: `green${idx}`,
                        blue: `blue${idx}`,
                        white: `white${idx}`,
                    },
                },
                dimmer: `dimmer${idx}`,
                strobe: `strobe${idx}`,
            },
        });
    }

    configs.push({...config, channels, name: `${channels}ch`});
});

export default ModelFactory({
    model: `Beamz LCB 244`,
    widthCm: 110,
    type: "rgbw-bar",
    config: configs,
});
