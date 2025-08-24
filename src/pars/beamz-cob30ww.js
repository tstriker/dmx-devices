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
                        {ch_val: 0, val: 0, label: "Light Off"},
                        {ch_val: 10, val: "auto_1", label: "Light On"},
                        {ch_val: 40, val: "auto_2", label: "Pulse"},
                        {ch_val: 70, val: "auto_3", label: "Strobe"},
                        {ch_val: 100, val: "auto_4", label: "Dim-strobe"},
                        {ch_val: 130, val: "sound_1", label: "Equalizer Pulse"},
                        {ch_val: 160, val: "sound_2", label: "Equalizer Dim"},
                        {ch_val: 190, val: "sound_3", label: "Equalizer Pulse 2"},
                    ],
                    defaultVal: 10,
                },
            ],
        },
    ],
});
