import {ModelFactory} from "../device.js";
import {rangeProp} from "../utils.js";

export default ModelFactory({
    model: "F1600 Pro Faze",
    config: {
        name: "2ch",
        props: {
            dimmer: rangeProp({label: "Intensity"}),
            speed: rangeProp({label: "Fan Speed"}),

            // haze: {
            //     channel: 1,
            //     label: "Haze Intensity",
            //     stops: [
            //         {label: "off", chVal: 0, discrete: true, val: 0},
            //         {label: "slow", chVal: 50, val: 0.01},
            //         {label: "fast", chVal: 255, val: 1},
            //     ],
            // },
            // fan: {
            //     channel: 2,
            //     label: "Fan Speed",
            //     stops: [
            //         {label: "off", chVal: 0, discrete: true, val: 0},
            //         {label: "slow", chVal: 50, val: 0.01},
            //         {label: "fast", chVal: 255, val: 1},
            //     ],
            // },
        },

        pixels: [
            {
                id: `haze`,
                label: `Haze`,
                props: {
                    intensity: "intensity",
                    speed: "speed",
                },
            },
        ],
    },
});
