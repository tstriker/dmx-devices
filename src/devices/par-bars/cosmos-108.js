import {ModelFactory, rangeProp} from "../../device.js";

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
    return {
        channel,
        label: label || "Strobe",
        stops: [
            {chVal: 0, val: 0},
            {chVal: 15, val: 0.1},
            {chVal: 255, val: 1},
        ],
    };
}

let configs = [
    {
        channels: 15,
        lights: 4,
        props: {
            mode: rangeProp({channel: 1, label: "Mode", defaultVal: 0}),
            dimmer: rangeProp({channel: 2, label: "Dimmer", defaultVal: 255}),
            spotStrobe: strobe(3, "Strobe Speed"),
            ...rgb(4, 7, 10, 13).props,
        },
        pixels: [...rgb(4, 7, 10, 13).pixels],
    },
];

export default ModelFactory({
    label: `Cosmos 108`,
    widthCm: 60,
    type: "par-bar",
    config: configs,
});
