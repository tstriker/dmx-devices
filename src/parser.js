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
        for (let channel = 0; channel < mode.channels; channel++) {
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
            let defaultActiveVal = prop.default_active;
            let defaultVal = prop.default_value;
            delete prop.default_active;
            delete prop.default_value;

            let propType = prop.type == "custom" ? prop.label : prop.type;

            propsCounter[propType] = (propsCounter[propType] || 0) + 1;
            let propName = propType;
            if (propsCounter[propType] > 1 || prop.repetition) {
                propName = `${propType}${propsCounter[propType]}`;
            }

            let propObj = rangeProp({...prop, occurence: propsCounter[propType]});
            propObj.ui = prop.ui === false ? false : true; //
            if (!propType) {
                propObj.ui = false;
            }

            if (propType == "gobo") {
                propObj.modes = (propObj.modes || []).map(obj => ({chVal: obj.ch_val, val: obj.val}));
            }

            if (propType == "wheel") {
                propObj.modes = (propObj.modes || []).map(obj => ({
                    chVal: obj.ch_val,
                    val: obj.color,
                    color: obj.color,
                }));
            }

            if (defaultActiveVal) {
                if (propObj.modes) {
                    let defaultMode = propObj.modes.filter(mode => mode.chVal == defaultActiveVal)[0];
                    if (defaultMode) {
                        propObj.activeDefault = defaultMode.val;
                    }
                } else {
                    let modeMap = calcModeMap({stops: propObj.stops});
                    propObj.activeDefault = modeMap[defaultActiveVal].val;
                }
            }

            if (defaultVal) {
                if (propObj.modes) {
                    let defaultMode = propObj.modes.filter(mode => mode.chVal == defaultVal)[0];
                    if (defaultMode) {
                        propObj.defaultVal = defaultMode.val;
                    }
                } else {
                    let modeMap = calcModeMap({stops: propObj.stops});
                    propObj.defaultVal = modeMap[defaultVal].val;
                }
            }

            propsDict[propName] = propObj;
        });
        // console.log("props dict", propsDict);

        if ((propsDict.red || propsDict.red1) && propsDict.dimmer) {
            // if we have the red channel, we can mix colors and so dimmer should be always on
            //propsDict.dimmer.activeDefault = 1;
            //propsDict.dimmer.ui = false;
        }

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
                // moving head pixels and rgb are mutually exclusive RN
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
