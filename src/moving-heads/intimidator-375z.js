import {ModelFactory} from "../device.js";
import {rangeProp} from "../utils.js";

export default ModelFactory({
    model: "Beamz Intimidator 375z",
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

            wheel: {
                label: "Color Wheel",
                modes: [
                    {chVal: 0, val: "white"},
                    {chVal: 8, val: "orange"},
                    {chVal: 16, val: "lime green"},
                    {chVal: 24, val: "cyan"},
                    {chVal: 32, val: "red"},
                    {chVal: 40, val: "green"},
                    {chVal: 48, val: "magenta"},
                    {chVal: 56, val: "yellow"},
                    {chVal: 64, val: "white"},
                ],
                defaultDMXVal: 72, // yellow sits in the middle of color wheel, so a good place to return to
            },

            gobo: {
                label: "Gobo",
                modes: [
                    {chVal: 0, val: "Off"},
                    {chVal: 8, val: "Gobo 1"},
                    {chVal: 16, val: "Gobo 2"},
                    {chVal: 24, val: "Gobo 3"},

                    {chVal: 32, val: "Gobo 4"},
                    {chVal: 40, val: "Gobo 5"},
                    {chVal: 48, val: "Gobo 6"},
                    {chVal: 56, val: "Gobo 7"},
                ],
            },

            gobo_rotation: rangeProp({label: "Gobo Rotation"}),
            prism: rangeProp({label: "Prism"}),
            focus: rangeProp({label: "Focus"}),

            dimmer: rangeProp({label: "Dimmer", defaultDMXVal: 255}),

            shutter: rangeProp({label: "Shutter"}),
            strobe: rangeProp({label: "Strobe"}),

            f1: rangeProp({label: "f1"}),
            f2: rangeProp({label: "f2"}),
            zoom: rangeProp({label: "zoom"}),
        },

        pixels: [
            {
                id: "light",
                label: "Light",
                controls: {
                    gobo: "gobo",
                    wheel: "wheel",
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
                        degrees: 270,
                        props: {
                            coarse: "tilt",
                            fine: "tiltFine",
                        },
                    },
                },
            },
        ],
    },
});
