import {ModelFactory, rangeProp} from "../../device.js";

function rgb(addresses) {
    // generates the rgb props triplet and colors control
    let config = {props: {}, controls: []};

    if (!Array.isArray(addresses)) {
        addresses = [addresses];
    }

    addresses.forEach((address, idx) => {
        // we want to start with 1, not 0
        idx += 1;

        config.props = {
            ...config.props,
            [`red${idx}`]: rangeProp({channel: address + 0, label: `Red ${idx}`}),
            [`green${idx}`]: rangeProp({channel: address + 1, label: `Green ${idx}`}),
            [`blue${idx}`]: rangeProp({channel: address + 2, label: `Blue ${idx}`}),
        };

        config.controls.push({
            name: `light${idx}`,
            type: "rgb-light",
            label: `Light ${idx}`,
            upper: idx > 8, // 224 has a unique design of two leds arranged vertically. lights 9-16 is upper row
            order: 8 - ((idx - 1) % 8), // reverse the light position on the bar by default as the factory default is cray
            props: {
                red: `red${idx}`,
                green: `green${idx}`,
                blue: `blue${idx}`,
            },
        });
    });

    return config;
}

function strobe(channel) {
    return {
        channel,
        label: "Strobe",
        stops: [
            {chVal: 0, val: 0},
            {chVal: 10, val: 0.1},
            {chVal: 255, val: 1},
        ],
    };
}

let configs = [
    {
        channels: 3,
        lights: 1,
        props: {
            ...rgb(1).props,
        },
        controls: [...rgb(1).controls],
    },

    {
        channels: 5,
        lights: 1,
        props: {
            dimmer: rangeProp({channel: 1, label: "Dimmer", default: 255}),
            strobe: strobe(2),
            ...rgb(3).props,
        },
        controls: [...rgb(3).controls],
    },

    {
        channels: 48,
        lights: 16,
        props: {
            ...rgb([1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34, 37, 40, 43, 46]).props,
        },
        controls: [...rgb([1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34, 37, 40, 43, 46]).controls],
    },
];

export default ModelFactory({
    label: `Beamz LCB 224`,
    widthCm: 110,
    type: "two-row-bar",
    config: configs,
});
