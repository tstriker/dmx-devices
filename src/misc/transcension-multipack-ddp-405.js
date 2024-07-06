import {ModelFactory} from "../device.js";
import {rangeProp} from "../utils.js";

export default ModelFactory({
    company: "Transcension",
    model: "Transcension Multi Pack DDP-405",
    type: "multi-pack",
    config: [
        {
            name: "1ch",
            props: {
                dimmer1: rangeProp({label: "Dimmer"}),
            },
            pixels: [
                {
                    id: `light`,
                    label: `Light`,
                    controls: {
                        color: {
                            type: "w-light",
                            props: {
                                dimmer: "dimmer1",
                            },
                        },
                    },
                },
            ],
        },

        {
            name: "4ch",
            props: {
                dimmer1: rangeProp({label: "Light 1"}),
                dimmer2: rangeProp({label: "Light 2"}),
                dimmer3: rangeProp({label: "Light 3"}),
                dimmer4: rangeProp({label: "Light 4"}),
            },
            pixels: [
                {
                    id: `light1`,
                    label: `Light 1`,
                    controls: {
                        color: {
                            type: "w-light",
                            props: {
                                dimmer: "dimmer1",
                            },
                        },
                    },
                },
                {
                    id: `light2`,
                    label: `Light 2`,
                    controls: {
                        color: {
                            type: "w-light",
                            props: {
                                dimmer: "dimmer2",
                            },
                        },
                    },
                },
                {
                    id: `light3`,
                    label: `Light 3`,
                    controls: {
                        color: {
                            type: "w-light",
                            props: {
                                dimmer: "dimmer3",
                            },
                        },
                    },
                },
                {
                    id: `light4`,
                    label: `Light 4`,
                    controls: {
                        color: {
                            type: "w-light",
                            props: {
                                dimmer: "dimmer4",
                            },
                        },
                    },
                },
            ],
        },
    ],
});
