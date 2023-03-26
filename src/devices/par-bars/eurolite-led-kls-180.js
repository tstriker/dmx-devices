import {ModelFactory, rangeProp} from "../../device.js";

function rgbw(...addresses) {
    // generates the rgb props triplet and colors control
    let config = {props: {}, controls: []};

    addresses.forEach((address, idx) => {
        // we want to start with 1, not 0
        idx += 1;

        config.props = {
            ...config.props,
            [`red${idx}`]: rangeProp({channel: address + 0, label: `Red ${idx}`}),
            [`green${idx}`]: rangeProp({channel: address + 1, label: `Green ${idx}`}),
            [`blue${idx}`]: rangeProp({channel: address + 2, label: `Blue ${idx}`}),
            [`white${idx}`]: rangeProp({channel: address + 3, label: `White ${idx}`}),
        };

        config.controls.push({
            name: `light${idx}`,
            type: "rgb-light",
            label: `Light ${idx}`,
            order: idx,
            props: {
                red: `red${idx}`,
                green: `green${idx}`,
                blue: `blue${idx}`,
                white: `white${idx}`,
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
            ...rgbw(1).props,
        },
        controls: [...rgbw(1).controls],
    },

    {
        channels: 4,
        lights: 1,
        props: {
            ...rgbw(1).props,
            white1: rangeProp({channel: 4, label: `White 1`}),
        },
        controls: [...rgbw(1).controls],
    },

    {
        channels: 21,
        lights: 4,
        props: {
            dimmer: rangeProp({channel: 1, label: "Dimmer", defaultVal: 255}),
            spotStrobe: strobe(2, "Strobe Speed"),
            internalProgram: strobe(2, "Internal Programs"),
            strobeWhite: strobe(2, "Strobe: white"),

            ...rgbw(5, 9, 13, 17).props,

            dmxPrograms: strobe(21, "Programs via DMX"),
        },
        controls: [...rgbw(5, 9, 13, 17).controls],
    },
];

export default ModelFactory({
    label: `Eurolite LED KLS 180`,
    widthCm: 60,
    type: "rgb-bar",
    config: configs,
});
