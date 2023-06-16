import {ModelFactory} from "../../device.js";

export default ModelFactory({
    company: "Eurolite",
    model: "Eurolite SD-201",
    type: "bubble-machine",
    config: {
        name: "1ch",
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
