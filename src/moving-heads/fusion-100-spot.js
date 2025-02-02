import {ModelFactory} from "../device.js";
import {rangeProp} from "../utils.js";

export default ModelFactory({
    model: "Fusion 100 Spot",
    type: "moving head",
    config: [
        {
            name: "8ch",
            props: {
                panCoarse: {
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
                    defaultVal: 127, // point straight ahead at 360 degrees to allow 90 degree freedom either direction
                },

                tiltCoarse: {
                    degrees: 180,
                    label: "Tilt",
                    stops: [
                        {chVal: 0, val: 0},
                        {chVal: 255, val: 180},
                    ],
                    defaultVal: 127, // point straight up/down  by default to avoid blinding anyone
                },

                dimmer: rangeProp({label: "Dimmer", activeDefault: 255}),

                wheel: {
                    label: "Color Wheel",
                    modes: [
                        {chVal: 0, val: "white", color: "#fff"},
                        {chVal: 14, val: "red", color: "#ff0000"},
                        {chVal: 32, val: "yellow", color: "#f5ef27"},
                        {chVal: 50, val: "cyan", color: "#00ffff"},
                        {chVal: 68, val: "green", color: "#00ff00"},
                        {chVal: 86, val: "orange", color: "#ed982e"},
                        {chVal: 104, val: "magenta", color: "#ff00ff"},
                        {chVal: 122, val: "blue", color: "#4f9ae5"},
                    ],
                    defaultVal: "green", // by default sit in the middle for faster spin-to times
                },

                gobo: {
                    label: "Gobo",
                    modes: [
                        {chVal: 0, val: "Off"},
                        {chVal: 9, val: "Stars"},
                        {chVal: 34, val: "Vortex"},
                        {chVal: 59, val: "Tri-dots"},
                        {chVal: 84, val: "Triangle"},
                        {chVal: 109, val: "Hearts"},

                        {chVal: 134, val: "Gobos Clockwise"},
                        {chVal: 195, val: "Gobos C-Clockwise"},
                    ],
                },

                rotation: rangeProp({label: "Gobo Rotation"}),
                focus: rangeProp({label: "Focus"}),
                prism: rangeProp({label: "Prism"}),
            },

            pixels: [
                {
                    id: "light",
                    label: "Light",
                    controls: {
                        fader: "dimmer",
                        gobo: "gobo",
                        wheel: "wheel",
                        speed: "speed",
                        pan: {
                            type: "degrees",
                            degrees: 540,
                            props: {
                                coarse: "panCoarse",
                            },
                        },
                        tilt: {
                            type: "degrees",
                            degrees: 180,
                            props: {
                                coarse: "tiltCoarse",
                            },
                        },
                    },
                },
            ],
        },
        {
            name: "15ch",
            props: {
                panCoarse: {
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
                    defaultVal: 127, // point straight ahead at 360 degrees to allow 90 degree freedom either direction
                },

                panFine: {
                    label: "Pan Fine",
                    stops: [
                        {chVal: 0, val: 0},
                        {chVal: 255, val: 3.6},
                    ],
                },

                tiltCoarse: {
                    degrees: 180,
                    label: "Tilt",
                    stops: [
                        {chVal: 0, val: 0},
                        {chVal: 255, val: 180},
                    ],
                    defaultVal: 127, // point straight up/down  by default to avoid blinding anyone
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
                    defaultVal: 0,
                    stops: [
                        {chVal: 0, val: 1},
                        {chVal: 255, val: 0.01},
                    ],
                },

                dimmer: rangeProp({label: "Dimmer", activeDefault: 255}),
                strobe: rangeProp({label: "Strobe", defaultVal: 255}),

                wheel: {
                    label: "Color Wheel",
                    modes: [
                        {chVal: 0, val: "white", color: "#fff"},
                        {chVal: 14, val: "red", color: "#ff0000"},
                        {chVal: 32, val: "yellow", color: "#f5ef27"},
                        {chVal: 50, val: "cyan", color: "#00ffff"},
                        {chVal: 68, val: "green", color: "#00ff00"},
                        {chVal: 86, val: "orange", color: "#ed982e"},
                        {chVal: 104, val: "magenta", color: "#ff00ff"},
                        {chVal: 122, val: "blue", color: "#4f9ae5"},
                    ],
                    defaultVal: 68, // middle of the color wheel
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

                led_macro: rangeProp({label: "LED macro", ui: false}),
                tilt_macro: rangeProp({label: "Tilt macro", ui: false}),
            },

            pixels: [
                {
                    id: "light",
                    label: "Light",
                    controls: {
                        fader: "dimmer",
                        gobo: "gobo",
                        wheel: "wheel",
                        strobe: "strobe",
                        pan: {
                            type: "degrees",
                            degrees: 540,
                            props: {
                                coarse: "panCoarse",
                                fine: "panFine",
                            },
                        },
                        tilt: {
                            type: "degrees",
                            degrees: 180,
                            props: {
                                coarse: "tiltCoarse",
                                fine: "tiltFine",
                            },
                        },
                    },
                },
            ],
        },
    ],
});
