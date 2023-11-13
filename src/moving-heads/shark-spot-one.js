import {ModelFactory} from "../device.js";

export default ModelFactory({
    model: "Shark Spot One - 14",
    type: "moving head",
    config: {
        name: "14ch",
        props: {
            panCoarse: {
                channel: 1,
                label: "Pan Degrees",
                stops: [
                    {chVal: 0, val: 0},
                    {chVal: 42, val: 90},
                    {chVal: 84, val: 180},
                    {chVal: 128, val: 270},
                    {chVal: 170, val: 360},
                    {chVal: 212, val: 450},
                    {chVal: 255, val: 540},
                ],
            },

            panFine: {
                channel: 2,
                label: "Pan+",
                stops: [
                    {chVal: 0, val: 0},
                    {chVal: 255, val: 1},
                ],
            },

            tiltCoarse: {
                channel: 3,
                label: "Tilt Degrees",
                stops: [
                    {chVal: 0, val: -90},
                    {chVal: 128, val: 0},
                    {chVal: 255, val: 90},
                ],
            },

            tiltFine: {
                channel: 4,
                label: "Tilt+",
                stops: [
                    {chVal: 0, val: 0},
                    {chVal: 255, val: 1},
                ],
            },

            moveSpeed: {
                channel: 5,
                label: "Movement Speed",
                stops: [
                    {chVal: 0, val: 1},
                    {chVal: 255, val: 0},
                ],
            },

            dimmer: {
                channel: 6,
                label: "Dimmer",
                stops: [
                    {chVal: 0, val: 0},
                    {chVal: 255, val: 1},
                ],
            },
            strobe: {
                channel: 7,
                // strobe ideally would map to 0=off, >0: strobe intensity
                label: "Strobe",
                stops: [
                    {label: "off", chVal: 0, discrete: true, val: 0},
                    {label: "slow", chVal: 10, val: 0.01},
                    {label: "fast", chVal: 250, val: 1},
                ],
            },

            color: {
                channel: 8,
                label: "Color",
                modes: [
                    {chVal: 0, val: "white", color: "#fff"},
                    {chVal: 25, val: "red", color: "#ff0000"},
                    {chVal: 51, val: "yellow", color: "#f5ef27"},
                    {chVal: 76, val: "cyan", color: "#00ffff"},
                    {chVal: 101, val: "green", color: "#00ff00"},
                    {chVal: 126, val: "orange", color: "#ed982e"},
                    {chVal: 151, val: "magenta", color: "#ff00ff"},
                    {chVal: 176, val: "blue", color: "#4f9ae5"},
                    {chVal: 201, val: "rainbow"},
                ],
            },
            rainbowSpeed: {
                channel: 8,
                label: "Rainbow Speed",
                modifies: "color",
                condition: device => device.color.val == "rainbow",
                stops: [
                    {chVal: 0, val: 0.1, label: "slow"},
                    {chVal: 54, val: 1, label: "fast"},
                ],
            },

            gobo: {
                channel: 9,
                label: "Gobo",
                modes: [
                    {chVal: 0, val: "Off"},
                    {chVal: 10, val: "Rings"},
                    {chVal: 27, val: "Seashell"},
                    {chVal: 44, val: "Marble"},
                    {chVal: 61, val: "Triangle"},
                    {chVal: 78, val: "Bubbles"},
                    {chVal: 195, val: "Gobos Clockwise"},
                    {chVal: 225, val: "Gobos C-Clockwise"},
                ],
            },
            goboShake: {
                channel: 9,
                label: "Gobo Shake",
                modifies: "gobo",
                condition: device => device.gobo.dmx >= 10,
                stops: [
                    {chVal: 0, val: 0, label: "slow"},
                    {chVal: 20, val: 1, label: "fast"},
                ],
            },

            goboRotation: {
                channel: 10,
                // rotation would ideally map to <0 for c-clockwise, 0=stop, >0 clockwise
                label: "Gobo Rotation",
                stops: [
                    {chVal: 0, val: "Stop", discrete: true, val: 0},
                    {chVal: 10, val: "Clockwise", val: -1},
                    {chVal: 130, val: "Stop", discrete: true, val: 0},
                    {chVal: 131, val: "C-Clockwise", val: 0.01},
                    {chVal: 255, val: "C-Clockwise", val: 1},
                ],
            },

            focus: {
                channel: 11,
                label: "Focus",
                stops: [
                    {chVal: 0, val: 0},
                    {chVal: 255, val: 1},
                ],
            },

            prism: {
                channel: 12,
                label: "Prism",
                modes: [
                    {chVal: 0, val: false, label: "Prism Off"},
                    {chVal: 129, val: true, label: "Prism On"},
                ],
            },

            program: {
                channel: 13,
                label: "Program",
                modes: [
                    {chVal: 0, val: 0, label: "Off"},
                    {chVal: 11, val: "white", label: "White + open"},
                    {chVal: 21, val: "blueG1", label: "Blue + gobo 1"},
                    {chVal: 31, val: "purpleG2", label: "Purple + gobo 2"},
                    {chVal: 41, val: "orangeG3", label: "Orange + gobo 3"},
                    {chVal: 51, val: "whiteG4", label: "White + gobo 4"},
                    {chVal: 61, val: "whiteG5", label: "White + gobo 5"},
                    {chVal: 71, val: "whitePrism", label: "White + open + prism"},
                    {chVal: 81, val: "whiteG1RPrism", label: "Blue + gobo 1 + rotation medium + prism"},
                    {chVal: 91, val: "purpleG2RPrism", label: "Purple + gobo 2 + rotation medium + prism"},
                    {chVal: 101, val: "orangeG3RPrism", label: "Orange + gobo 3 + rotation medium + prism"},
                    {chVal: 111, val: "whiteG4RPrism", label: "White + gobo 4 + rotation medium + prism"},
                    {chVal: 121, val: "whiteG5RPrism", label: "White + gobo 5 + rotation medium + prism"},
                    {chVal: 131, val: "rainbowG1Prism", label: "Auto play color + gobo 1 + prism"},
                    {chVal: 141, val: "rainbowG2Prism", label: "Auto play color + gobo 2 + prism"},
                    {chVal: 151, val: "rainbowG3Prism", label: "Auto play color + gobo 3 + prism"},
                    {chVal: 161, val: "rainbowG4Prism", label: "Auto play color + gobo 4 + prism"},
                    {chVal: 171, val: "rainbowG5Prism", label: "Auto play color + gobo 5 + prism"},
                    {chVal: 181, val: "rainbowGSoundPrism", label: "Color + gobo + sound-controlled prism"},
                ],
            },

            func: {
                channel: 14,
                label: "Function",
                modes: [
                    {chVal: 0, val: 0, label: "Off"},
                    {chVal: 11, val: "p1", label: "Built-in program 1"},
                    {chVal: 21, val: "p2", label: "Built-in program 2"},
                    {chVal: 31, val: "p3", label: "Built-in program 3"},
                    {chVal: 41, val: "p4", label: "Built-in program 4"},
                    {chVal: 51, val: "p5", label: "Built-in program 5"},
                    {chVal: 61, val: "p6", label: "Built-in program 6"},
                    {chVal: 71, val: "p7", label: "Built-in program 7"},
                    {chVal: 81, val: "p7", label: "Built-in program 8"},
                    {chVal: 91, val: "sound", label: "Sound controlled mode off to high sensitivity"},
                    {chVal: 231, val: "reset", label: "Reset"},
                ],
            },
            soundSensitivity: {
                channel: 14,
                label: "Sound Sensitivity",
                modifies: "func",
                condition: device => device.func.dmx >= 91 && device.func.dmx <= 230,
                stops: [
                    {label: "off", chVal: 1, val: 0},
                    {label: "high", chVal: 140, val: 1},
                ],
            },
        },
    },
});
