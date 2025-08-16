import {parseFixtureConfig} from "../parser.js";

export default parseFixtureConfig({
    model: "Beamz COB30WW",
    widthCm: 20,
    type: "w-light",
    modes: [
        {
            name: "3ch",
            props: [
                {type: "white", activeDefault: 255},
                "strobe",
                {
                    type: "custom",
                    label: "mode",
                    modes: [
                        {chVal: 0, val: 0, label: "Light Off"},
                        {chVal: 10, val: "auto_1", label: "Light On"},
                        {chVal: 40, val: "auto_2", label: "Pulse"},
                        {chVal: 70, val: "auto_3", label: "Strobe"},
                        {chVal: 100, val: "auto_4", label: "Dim-strobe"},
                        {chVal: 130, val: "sound_1", label: "Equalizer Pulse"},
                        {chVal: 160, val: "sound_2", label: "Equalizer Dim"},
                        {chVal: 190, val: "sound_3", label: "Equalizer Pulse 2"},
                    ],
                    defaultVal: 10,
                },
            ],
        },
    ],
});
