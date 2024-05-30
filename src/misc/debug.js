import {ModelFactory} from "../device.js";
import {rangeProp} from "../utils.js";

function channels(i) {
    let channelProps = {};
    for (let channel = 1; channel <= i; channel++) {
        channelProps[`ch${channel < 10 ? "0" + channel : channel}`] = rangeProp({
            label: channel < 10 ? `0${channel}` : channel,
        });
    }
    return {
        props: channelProps,
        pixels: [{id: "dummy"}], // needs a dummy pixel to attach to, or otherwise the code doesn't recognise it
    };
}

export default ModelFactory({
    company: "RGB Monster",
    model: "Debug Device",
    type: "debug",
    config: [
        {name: "1ch", ...channels(1)},
        {name: "2ch", ...channels(2)},
        {name: "4ch", ...channels(4)},
        {name: "8ch", ...channels(8)},
        {name: "16ch", ...channels(16)},
        {name: "32ch", ...channels(32)},
        {name: "64ch", ...channels(64)},
        {name: "256ch", ...channels(256)},
    ],
});
