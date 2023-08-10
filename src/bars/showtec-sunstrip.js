import {ModelFactory} from "../device.js";
import {rangeProp} from "../utils.js";

function wPixel(idx) {
    return {
        id: `light${idx}`,
        label: `Light ${idx}`,
        controls: {
            color: {
                type: "w-light",
                props: {
                    white: `dimmer${idx}`,
                },
            },
        },
    };
}

export default ModelFactory({
    company: "Showtec",
    model: "Sunstrip",
    type: "rgbw-bar",
    config: [
        {
            name: "10ch",
            props: {
                dimmer1: rangeProp({label: "Light 1"}),
                dimmer2: rangeProp({label: "Light 2"}),
                dimmer3: rangeProp({label: "Light 3"}),
                dimmer4: rangeProp({label: "Light 4"}),
                dimmer5: rangeProp({label: "Light 5"}),
                dimmer6: rangeProp({label: "Light 6"}),
                dimmer7: rangeProp({label: "Light 7"}),
                dimmer8: rangeProp({label: "Light 8"}),
                dimmer9: rangeProp({label: "Light 9"}),
                dimmer10: rangeProp({label: "Light 10"}),
            },
            pixels: [
                wPixel(1),
                wPixel(2),
                wPixel(3),
                wPixel(4),
                wPixel(5),
                wPixel(6),
                wPixel(7),
                wPixel(8),
                wPixel(9),
                wPixel(10),
            ],
        },
    ],
});
