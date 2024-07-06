import {ModelFactory} from "../device.js";
import {rangeProp} from "../utils.js";

let Strobe = {
    props: {strobe: "strobe"},
    get(props) {
        // strobe universally should be: 0=off, 0.01..1 = flickering faster and faster
        let chVal = props.strobe.chVal;
        if (chVal < 64) {
            return 0;
        } else if (chVal <= 95) {
            return (chVal - 63) / 32;
        }
    },

    set(props, value) {
        if (value == 0) {
            props.strobe.dmx = 32;
        } else {
            props.strobe.dmx = 64 + Math.floor(value * 31);
        }
    },
};

export default ModelFactory({
    model: "Centolight Plot FZ6200",
    widthCm: 20,
    type: "rgb-light",

    config: [
        {
            name: "12ch",
            props: {
                dimmer: rangeProp({label: "Dimmer", activeDefault: 1}),
                cct: rangeProp({label: "CCT", ui: false}),
                // dimmer change determines wheter we specify output in kelvins, or RGB
                // right now we can only work with RGB as my kelvin math is weak
                dimmerChange: rangeProp({label: "Dimmer Change", defaultVal: 1, ui: false}),

                red: rangeProp({label: "Red"}),
                green: rangeProp({label: "Green"}),
                blue: rangeProp({label: "Blue"}),
                lime: rangeProp({label: "Lime"}),
                amber: rangeProp({label: "Amber"}),
                cyan: rangeProp({label: "Cyan"}),
                zoom: rangeProp({label: "Zoom"}),
                strobe: {
                    label: "Strobe",
                    stops: [
                        {chVal: 0, val: 0, label: "off"},
                        {chVal: 10, val: 0.01},
                        {chVal: 255, val: 1},
                    ],
                },
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
