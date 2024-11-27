import {ModelFactory} from "./device.js";
import {rangeProp} from "./utils.js";
import {calcModeMap} from "./props.js";

export function parseFixtureConfig(config) {
    // takes json-friendly config and renders a device factory, with inferred pixels and all
    let res = JSON.parse(JSON.stringify(config));

    let deviceModes = res.modes;
    delete res.modes;
    res.config = [];

    deviceModes.forEach(mode => {
        // console.log("raw mode", mode);

        // clone so we don't end up in weird echoes
        let props = JSON.parse(JSON.stringify(mode.props));

        // make sure each prop is present
        let totalChannels = Math.max(mode.channels, props.length);
        for (let channel = 0; channel < totalChannels; channel++) {
            props[channel] = props[channel] || {type: null, label: ""};
        }

        // repeat the repeated props and for each repeated mark the number of repetition
        props.forEach((prop, idx) => {
            if (prop.repeats > 1) {
                for (let i = 0; i < prop.repeats; i++) {
                    let repeatIdx = idx + i * prop.every;

                    props[repeatIdx] = {
                        ...prop,
                        repetition: i + 1,
                    };
                    delete props[repeatIdx].repeats;
                    delete props[repeatIdx].every;
                }
            }
        });
        // console.log("repeated props", props);

        // turn props from a list of prop types into a dict with unique labels
        let propsCounter = {};
        let propsDict = {};

        props.forEach(prop => {
            delete prop.val; // just in case value has wondered in somehow; XXX - delete it upstream instead

            if (prop.default_value != undefined) {
                prop.defaultVal = parseInt(prop.default_value || 0);
                delete prop.default_value;
            }
            if (prop.default_active != undefined) {
                prop.activeDefault = parseInt(prop.default_active || 0);
                delete prop.default_active;
            }

            if (prop.modes) {
                // deal with props that have modes, either as stops or ranges
                let modes = (prop.modes || []).map((conf, idx) => {
                    let mode = {
                        chVal: conf.ch_val,
                        val: conf.color ? conf.color : conf.val,
                    };
                    if (conf.color) {
                        mode.color = conf.color;
                    }

                    if (conf.custom == "stop") {
                        mode.stop = conf.val;
                    } else if (conf.custom == "range") {
                        let nextChVal = prop.modes[idx + 1]?.ch_val || 256;
                        mode.range = nextChVal - mode.chVal - 1;
                    }

                    return mode;
                });
                prop.modes = modes;
            } else {
                // if we don't have modes, we assume a simple full range
                prop.stops = [
                    {chVal: 0, val: 0},
                    {chVal: 255, val: 1},
                ];
            }

            let propName = prop.type == "custom" ? prop.label : prop.type;
            if (!propName) {
                prop.ui = false;
            } else {
                prop.ui = prop.ui === false ? false : true;
            }

            propsCounter[propName] = (propsCounter[propName] || 0) + 1;
            prop.occurence = propsCounter[propName];

            if (propsCounter[propName] > 1 || prop.repetition) {
                propName = `${propName}${propsCounter[propName]}`;
            }
            propsDict[propName] = prop;
        });
        // console.log("props dict", propsDict);

        // get max repetitions so that we can dumbly go through bunch of inferring
        let maxRepetitions = Math.max(...Object.values(propsCounter));

        let pixels = [];
        for (let group = 0; group <= maxRepetitions; group++) {
            let numbered = propName => (group == 0 ? propName : `${propName}${group}`);
            let numberedProp = propName => propsDict[numbered(propName)];
            let exists = propName => numberedProp(propName) !== undefined;
            let ifExists = propName => (exists(propName) ? numbered(propName) : null);

            let controls = {};
            if (exists("pan_coarse")) {
                controls.pan = {
                    type: "degrees",
                    normalized: true,
                    degrees: numberedProp("pan_coarse").degrees || 540,
                    props: {
                        coarse: ifExists("pan_coarse"),
                        fine: ifExists("pan_fine"),
                    },
                };
            }

            if (exists("tilt_coarse")) {
                controls.tilt = {
                    type: "degrees",
                    normalized: true,
                    degrees: numberedProp("tilt_coarse").degrees || 180,
                    props: {
                        coarse: ifExists("tilt_coarse"),
                        fine: ifExists("tilt_fine"),
                    },
                };
            }

            ["gobo", "wheel", "speed"].forEach(field => {
                if (exists(field)) {
                    controls[field] = numbered(field);
                }
            });

            if (exists("red")) {
                if (exists("white")) {
                    controls.color = {type: "rgbw-light", props: ["red", "green", "blue", "white"]};
                } else {
                    controls.color = {type: "rgb-light", props: ["red", "green", "blue"]};
                }

                // convert the prop list into {red: red1, green: green1,...}
                controls.color.props = Object.fromEntries(
                    controls.color.props.map(propName => [propName, numbered(propName)])
                );
            }

            if (Object.keys(controls).length) {
                pixels.push({controls});
            }
        }
        pixels.forEach((pixel, idx) => {
            // add the superfluous ID; not sure why we have it tbh
            pixel.id = `light-${idx + 1}`;
        });
        //console.log("pixels", pixels);

        res.config.push({
            name: mode.name,
            props: propsDict,
            pixels,
        });
    });

    let factory = ModelFactory(res);
    factory.src = config;

    return factory;
}
