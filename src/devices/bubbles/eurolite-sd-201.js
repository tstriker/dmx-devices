import {ModelFactory} from "../../device.js";
import {rangeProp} from "../../utils.js";

export default ModelFactory({
    company: "Eurolite",
    model: "Eurolite SD-201",
    type: "bubble-machine",
    config: {
        name: "1ch",
        props: {
            speed: rangeProp({label: "Speed"}),
        },
        pixels: [
            {
                id: `bubbles`,
                label: `Bubbles`,
                speed: "speed",
            },
        ],
    },
});
