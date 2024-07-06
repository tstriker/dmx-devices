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
                    dimmer: `dimmer${idx}`,
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
                dimmer1: rangeProp({}),
                dimmer2: rangeProp({}),
                dimmer3: rangeProp({}),
                dimmer4: rangeProp({}),
                dimmer5: rangeProp({}),
                dimmer6: rangeProp({}),
                dimmer7: rangeProp({}),
                dimmer8: rangeProp({}),
                dimmer9: rangeProp({}),
                dimmer10: rangeProp({}),
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
