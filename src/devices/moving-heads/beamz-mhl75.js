import {ModelFactory, rangeProp} from "../../device.js";

export default ModelFactory({
    label: "Beamz MHL75",
    type: "moving head",
    config: {
        props: {
            panCoarse: {
                channel: 1,
                degrees: 540,
                label: "Pan Degrees",
                stops: [
                    {chVal: 0, val: 0},
                    // {chVal: 42, val: 90},
                    // {chVal: 84, val: 180},
                    // {chVal: 128, val: 270},
                    // {chVal: 170, val: 360},
                    // {chVal: 212, val: 450},
                    {chVal: 255, val: 540},
                ],
            },

            panFine: {
                channel: 2,
                degrees: 3.6,
                label: "Pan+",
                stops: [
                    {chVal: 0, val: 0},
                    {chVal: 255, val: 3.6},
                ],
            },

            tiltCoarse: {
                channel: 3,
                degrees: 270,
                label: "Tilt Degrees",
                stops: [
                    {chVal: 0, val: 0},
                    {chVal: 255, val: 270},
                ],
            },

            tiltFine: {
                channel: 4,
                degrees: 1.3,
                label: "Tilt+",
                stops: [
                    {chVal: 0, val: 0},
                    {chVal: 255, val: 1.3},
                ],
            },

            speed: {
                channel: 5,
                label: "Speed",
                stops: [
                    {chVal: 0, val: 1},
                    {chVal: 255, val: 0.01},
                ],
            },

            washDimmer: rangeProp({channel: 6, label: "Wash Dimmer", defaultVal: 255}),
            spot: rangeProp({channel: 7, label: "Spot Light", defaultVal: 0}),
            strobe: rangeProp({channel: 8, label: "Strobe", defaultVal: 0}),
            colorWheel: {
                channel: 9,
                label: "Color Wheel",
                modes: [
                    {chVal: 0, val: "white"},
                    {chVal: 16, val: "white-red"},
                    {chVal: 24, val: "red"},
                    {chVal: 32, val: "red-green"},
                    {chVal: 40, val: "green"},
                    {chVal: 48, val: "green-Blue"},
                    {chVal: 56, val: "blue"},
                    {chVal: 64, val: "blue-yellow"},
                    {chVal: 72, val: "yellow"},
                    {chVal: 80, val: "80 yellow-purple"},
                    {chVal: 88, val: "purple"},
                    {chVal: 96, val: "purple-orange"},
                    {chVal: 104, val: "orange"},
                    {chVal: 112, val: "orange-white"},
                    {chVal: 120, val: "white"},

                    {chVal: 128, val: "CCW rotation"},
                    {chVal: 190, val: "stop rotation"},
                    {chVal: 194, val: "CW rotation"},
                ],
            },

            gobo: {
                channel: 10,
                label: "Gobo",
                modes: [
                    {chVal: 0, val: "Off"},
                    {chVal: 16, val: "Fog"},
                    {chVal: 32, val: "Vortex"},
                    {chVal: 48, val: "Bubbles"},
                    {chVal: 64, val: "Angular"},
                    {chVal: 80, val: "Tri-dots"},
                    {chVal: 96, val: "Aliens"},
                    {chVal: 112, val: "Focus Ring"},
                    {chVal: 128, val: "Gobos C-Clockwise"},

                    {chVal: 190, val: "Gobos C-Clockwise"},
                    {chVal: 194, val: "Gobos C-Clockwise"},
                ],
            },

            washRed: rangeProp({channel: 11, label: "Wash Red"}),
            washGreen: rangeProp({channel: 12, label: "Wash Green"}),
            washBlue: rangeProp({channel: 13, label: "Wash Blue"}),
            washWhite: rangeProp({channel: 14, label: "Wash White"}),
            washStrobe: rangeProp({channel: 15, label: `Wash Strobe`}),
        },

        pixels: [
            {
                id: "light",
                label: "Light",
                controls: {
                    color: {
                        type: "rgbw-light",
                        props: {
                            red: "washRed",
                            green: "washGreen",
                            blue: "washBlue",
                            white: "washWhite",
                        },
                    },
                },
                dimmer: "washDimmer",
                strobe: "washStrobe",
                gobo: "gobo",
                colorWheel: "colorWheel",

                tilt: "tilt",
                pan: "pan",
            },
        ],
    },
});
