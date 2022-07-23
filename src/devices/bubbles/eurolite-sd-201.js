import {ModelFactory} from "../../device.js";

export default ModelFactory({
    company: "Eurolite",
    label: "Eurolite SD-201",
    type: "bubble-machine",
    config: {
        props: {
            bubbles: {
                channel: 1,
                label: "Bubbles",
                stops: [
                    {label: "off", chVal: 0, discrete: true, val: 0},
                    {label: "slow", chVal: 5, val: 0.01},
                    {label: "fast", chVal: 255, val: 1},
                ],
            },
        },
    },
});
