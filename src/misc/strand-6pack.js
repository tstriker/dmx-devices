import {ModelFactory} from "../device.js";
import {rangeProp} from "../utils.js";

export default ModelFactory({
    company: "Strand",
    model: "Strand 6Pack",
    type: "multi-pack",
    config: [
        {
            name: "6ch",
            props: {
                dimmer1: rangeProp({label: "Light 1"}),
                dimmer2: rangeProp({label: "Light 2"}),
                dimmer3: rangeProp({label: "Light 3"}),
                dimmer4: rangeProp({label: "Light 4"}),
                dimmer5: rangeProp({label: "Light 5"}),
                dimmer6: rangeProp({label: "Light 6"}),
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
                {
                    id: `light5`,
                    label: `Light 5`,
                    controls: {
                        color: {
                            type: "w-light",
                            props: {
                                dimmer: "dimmer5",
                            },
                        },
                    },
                },
                {
                    id: `light6`,
                    label: `Light 6`,
                    controls: {
                        color: {
                            type: "w-light",
                            props: {
                                dimmer: "dimmer6",
                            },
                        },
                    },
                },
            ],
        },
    ],
});
