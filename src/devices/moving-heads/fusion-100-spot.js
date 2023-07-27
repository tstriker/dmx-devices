import {ModelFactory} from "../../device.js";
import {rangeProp} from "../../utils.js";

export default ModelFactory({
    model: "Fusion 100 Spot",
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
                defaultDMXVal: 170, // point straight ahead at 360 degrees to allow 90 degree freedom either direction
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
                defaultDMXVal: 127, // point straight up/down  by default to avoid blinding anyone
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
            },

            dimmer: rangeProp({label: "Dimmer"}),
            strobe: rangeProp({label: "Strobe", defaultDMXVal: 255}),

            wheel: {
                label: "Color Wheel",
                modes: [
                    {chVal: 0, val: "white"},
                    {chVal: 14, val: "red"},
                    {chVal: 32, val: "yellow"},
                    {chVal: 50, val: "cyan"},
                    {chVal: 68, val: "green"},
                    {chVal: 86, val: "orange"},
                    {chVal: 104, val: "magenta"},
                    {chVal: 122, val: "blue"},
                ],
                defaultDMXVal: 68, // yellow sits in the middle of color wheel, so a good place to return to
            },

            gobo: {
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

            rotation: rangeProp({label: "Rotation"}),
            focus: rangeProp({label: "Focus"}),
            prism: rangeProp({label: "Prism"}),

            led_macro: rangeProp({label: "LED macro"}),
            tilt_macro: rangeProp({label: "Tilt macro"}),
        },

        pixels: [
            {
                id: "light",
                label: "Light",
                controls: {
                    dimmer: "dimmer",
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
