import {ModelFactory} from "../device.js";
import {rangeProp} from "../utils.js";

export default ModelFactory({
    model: "Beamz MHL75",
    type: "moving head",
    config: {
        name: "15ch",
        props: {
            pan: {
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
                defaultVal: 360, // point straight ahead at 360 degrees to allow 90 degree freedom either direction
            },

            panFine: {
                label: "Pan Fine",
                stops: [
                    {chVal: 0, val: 0},
                    {chVal: 255, val: 3.6},
                ],
            },

            tilt: {
                degrees: 180,
                label: "Tilt",
                stops: [
                    {chVal: 0, val: 0},
                    {chVal: 255, val: 180},
                ],
                defaultVal: 90, // point straight up/down  by default to avoid blinding anyone
            },

            tiltFine: {
                label: "Tilt Fine",
                stops: [
                    {chVal: 0, val: 0},
                    {chVal: 255, val: 1.3},
                ],
            },

            speed: {
                label: "Speed",
                stops: [
                    {chVal: 0, val: 1},
                    {chVal: 255, val: 0.01},
                ],
                defaultVal: 1,
            },

            dimmer: rangeProp({label: "Dimmer", defaultVal: 1}),
            spot: rangeProp({label: "Spot Light"}),
            strobe: rangeProp({label: "Strobe"}),
            wheel: {
                label: "Color Wheel",
                modes: [
                    {chVal: 0, val: "white", color: "#fff"},
                    {chVal: 16, val: "white-red"},
                    {chVal: 24, val: "red", color: "#ff0000"},
                    {chVal: 32, val: "red-green"},
                    {chVal: 40, val: "green", color: "#00ff00"},
                    {chVal: 48, val: "green-Blue"},
                    {chVal: 56, val: "blue", color: "#4f9ae5"},
                    {chVal: 64, val: "blue-yellow"},
                    {chVal: 72, val: "yellow", color: "#f5ef27"},
                    {chVal: 80, val: "yellow-purple"},
                    {chVal: 88, val: "purple", color: "#ad2eed"},
                    {chVal: 96, val: "purple-orange"},
                    {chVal: 104, val: "orange", color: "#ed982e"},
                    {chVal: 112, val: "orange-white"},

                    {chVal: 128, val: "CCW rotation"},
                    {chVal: 190, val: "stop rotation"},
                    {chVal: 194, val: "CW rotation"},
                ],
                defaultVal: "yellow", // yellow sits in the middle of color wheel, so a good place to return to
            },

            gobo: {
                label: "Gobo",
                modes: [
                    {chVal: 0, val: "Fill"},
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

            washRed: rangeProp({label: "Wash Red"}),
            washGreen: rangeProp({label: "Wash Green"}),
            washBlue: rangeProp({label: "Wash Blue"}),
            washWhite: rangeProp({label: "Wash White"}),
            washStrobe: rangeProp({label: `Wash Strobe`}),
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
                    wheel: "wheel",
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
