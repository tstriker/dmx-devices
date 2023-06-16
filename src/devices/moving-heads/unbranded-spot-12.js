import {ModelFactory} from "../../device.js";
import {rangeProp} from "../../utils.js";

export default ModelFactory({
    model: "Unbranded moving head 12ch",
    type: "moving head",
    config: {
        name: "12ch",
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
                degrees: 200,
                label: "Tilt Degrees",
                stops: [
                    {chVal: 0, val: 0},
                    {chVal: 255, val: 200},
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

            color: {
                channel: 5,
                label: "Color",
                modes: [
                    {chVal: 0, val: "white"},
                    {chVal: 10, val: "red"},
                    {chVal: 20, val: "yellow"},
                    {chVal: 30, val: "blue"},
                    {chVal: 40, val: "green"},
                    {chVal: 50, val: "orange"},
                    {chVal: 60, val: "magenta"},
                    {chVal: 70, val: "cyan"},
                    {chVal: 80, val: "magenta + cyan"},
                    {chVal: 90, val: "orange + magenta"},
                    {chVal: 100, val: "green + orange"},
                    {chVal: 110, val: "blue + green"},
                    {chVal: 120, val: "yellow + blue"},
                    {chVal: 130, val: "red + yellow"},
                    {chVal: 140, val: "rainbow"},
                ],
            },

            rainbowSpeed: {
                channel: 5,
                label: "Rainbow Speed",
                modifies: "color",
                condition: device => device.color.val == "rainbow",
                stops: [
                    {chVal: 0, val: 0.1, label: "slow"},
                    {chVal: 115, val: 1, label: "fast"},
                ],
            },

            gobo: {
                channel: 6,
                label: "Gobo",
                modes: [
                    {chVal: 0, val: "Off"},
                    {chVal: 8, val: "Flower"},
                    {chVal: 16, val: "Bubbles"},
                    {chVal: 24, val: "Fishes"},
                    {chVal: 32, val: "Vortex"},
                    {chVal: 40, val: "Triangles"},
                    {chVal: 48, val: "Rosebud"},
                    {chVal: 56, val: "Swirl"},
                    {chVal: 128, val: "Gobos C-Clockwise"},
                ],
            },
            goboSpeed: {
                channel: 6,
                label: "Gobo Change Speed",
                modifies: "gobo",
                condition: device => device.gobo.chVal >= 128,
                stops: [
                    {chVal: 0, val: 0.1, label: "slow"},
                    {chVal: 127, val: 1, label: "fast"},
                ],
            },

            strobe: {
                channel: 7,
                label: "Strobe",
                stops: [
                    {label: "off", chVal: 0, discrete: true, val: 0},
                    {label: "slow", chVal: 10, val: 0.01},
                    {label: "fast", chVal: 249, val: 1},
                ],
            },
            dimmer: rangeProp({channel: 8, label: "Dimmer"}),
            speed: rangeProp({channel: 9, label: "Motor speed"}),
            automatic: rangeProp({channel: 10, label: "Automatic"}),
            reset: rangeProp({channel: 11, label: "Reset"}),
            ligtStrip: {
                channel: 12,
                label: "Light strips",
                modes: [
                    {chVal: 0, val: "off"},
                    {chVal: 5, val: "red"},
                    {chVal: 20, val: "green"},
                    {chVal: 35, val: "blue"},
                    {chVal: 50, val: "yellow"},
                    {chVal: 65, val: "magenta"},
                    {chVal: 80, val: "cyan"},
                    {chVal: 95, val: "white"},

                    {chVal: 110, val: "red + yellow"},
                    {chVal: 125, val: "red + magenta"},
                    {chVal: 140, val: "red + cyan"},
                    {chVal: 155, val: "green + yellow"},
                    {chVal: 170, val: "green + cyan"},
                    {chVal: 185, val: "green + white"},
                    {chVal: 200, val: "blue + magenta"},
                    {chVal: 215, val: "blue + cyan"},
                    {chVal: 230, val: "blue + white"},
                    {chVal: 245, val: "cycle"},
                ],
            },
        },
    },
});
