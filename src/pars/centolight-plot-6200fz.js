import {ModelFactory} from "../device.js";
import {rangeProp} from "../utils.js";

export default ModelFactory({
    model: "Centolight Plot FZ6200",
    widthCm: 20,
    type: "rgb-light",

    config: [
        {
            name: "12ch",
            props: {
                dimmer: rangeProp({label: "Dimmer", activeDefault: 255}),
                cct: rangeProp({label: "CCT", ui: false}),
                // dimmer change determines wheter we specify output in kelvins, or RGB
                // right now we can only work with RGB as my kelvin math is weak
                dimmerChange: rangeProp({label: "Dimmer Change", defaultVal: 255, ui: false}),

                red: rangeProp({label: "Red"}),
                green: rangeProp({label: "Green"}),
                blue: rangeProp({label: "Blue"}),
                lime: rangeProp({label: "Lime"}),
                amber: rangeProp({label: "Amber"}),
                cyan: rangeProp({label: "Cyan"}),
                zoom: rangeProp({label: "Zoom"}),
                strobe: rangeProp({label: "Strobe"}),
            },
            pixels: [
                {
                    id: "light",
                    label: "Light",
                    controls: {
                        color: {
                            name: "light",
                            type: "rgb-light",
                            label: "Light",
                            props: {
                                red: "red",
                                green: "green",
                                blue: "blue",
                            },
                        },
                        dimmer: "dimmer",
                        strobe: "strobe",
                    },
                },
            ],
        },
    ],
});
