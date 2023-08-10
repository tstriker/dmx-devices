import {ModelFactory} from "../../device.js";
import {rangeProp} from "../../utils.js";

function channels(i) {
    let channelProps = {};
    for (let channel = 1; channel <= i; channel++) {
        channelProps[`ch${channel}`] = rangeProp({label: `Ch ${channel}`});
    }
    return channelProps;
}

export default ModelFactory({
    company: "RGB Monster",
    model: "Debug Device",
    type: "debug",
    config: [
        {
            name: "1ch",
            props: channels(1),
        },
        {
            name: "2ch",
            props: channels(2),
        },
        {
            name: "4ch",
            props: channels(4),
        },
        {
            name: "8ch",
            props: channels(8),
        },
        {
            name: "16ch",
            props: channels(16),
        },
        {
            name: "32ch",
            props: channels(32),
        },
        {
            name: "64ch",
            props: channels(64),
        },
        {
            name: "256ch",
            props: channels(256),
        },
    ],
});
