import {ModelFactory} from "../../device.js";
import {rangeProp} from "../../utils.js";

export default ModelFactory({
    model: "Beamz MHL75",
    type: "moving head",
    config: {
        name: "15ch",
        props: {
            pan: {
                channel: 1,
                degrees: 540,
                label: "Pan",
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
                label: "Pan Fine",
                stops: [
                    {chVal: 0, val: 0},
                    {chVal: 255, val: 3.6},
                ],
            },

            tilt: {
                channel: 3,
                degrees: 180,
                label: "Tilt",
                stops: [
                    {chVal: 0, val: 0},
                    {chVal: 255, val: 180},
                ],
            },

            tiltFine: {
                channel: 4,
                label: "Tilt Fine",
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

            dimmer: rangeProp({channel: 6, label: "Dimmer", defaultDMXVal: 255}),
            spot: rangeProp({channel: 7, label: "Spot Light", defaultDMXVal: 0}),
            strobe: rangeProp({channel: 8, label: "Strobe", defaultDMXVal: 0}),
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
                    dimmer: "dimmer",
                    color: {
                        type: "rgbw-light",
                        props: {
                            red: "washRed",
                            green: "washGreen",
                            blue: "washBlue",
                            white: "washWhite",
                        },
                    },
                    washStrobe: "washStrobe",

                    spot: "spot",
                    gobo: "gobo",
                    colorWheel: "colorWheel",
                    strobe: "strobe",
                    pan: {
                        type: "degrees",
                        degrees: 540,
                        props: {
                            coarse: "pan",
                            fine: "panFine",
                        },
                    },
                    tilt: {
                        type: "degrees",
                        degrees: 180,
                        props: {
                            coarse: "tilt",
                            fine: "tiltFine",
                        },
                    },
                    speed: "speed",
                },
            },
        ],
    },
});
