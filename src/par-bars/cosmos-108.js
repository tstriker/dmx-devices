import {ModelFactory} from "../device.js";
import {rangeProp} from "../utils.js";

function rgb(...addresses) {
    // generates the rgb props triplet and colors pixel
    let config = {props: {}, pixels: []};

    addresses.forEach((address, idx) => {
        // we want to start with 1, not 0
        idx += 1;

        config.props = {
            ...config.props,
            [`red${idx}`]: rangeProp({channel: address + 0, label: `Red ${idx}`}),
            [`green${idx}`]: rangeProp({channel: address + 1, label: `Green ${idx}`}),
            [`blue${idx}`]: rangeProp({channel: address + 2, label: `Blue ${idx}`}),
        };

        config.pixels.push({
            id: `light${idx}`,
            label: `Light ${idx}`,
            controls: {
                color: {
                    type: "rgb-light",
                    props: {
                        red: `red${idx}`,
                        green: `green${idx}`,
                        blue: `blue${idx}`,
                    },
                },
            },
        });
    });

    return config;
}

function strobe(channel, label) {
    return rangeProp({label: "Strobe"});
}

export default ModelFactory({
    model: `Cosmos 108`,
    widthCm: 60,
    type: "par-bar",
    config: [
        {
            name: "15ch",
            lights: 4,
            props: {
                mode: rangeProp({channel: 1, label: "Mode", ui: false}),
                dimmer: rangeProp({channel: 2, label: "Dimmer", activeDefault: 255}),
                strobe: rangeProp({channel: 3, label: "Strobe"}),
                ...rgb(4, 7, 10, 13).props,
            },
            pixels: [...rgb(4, 7, 10, 13).pixels],
        },
    ],
});
