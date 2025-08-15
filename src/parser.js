import {ModelFactory} from "./device.js";

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

        // props was an packed array, but now i'm packing it more tightly and allowing
        // not to have nulls
        let channelMappings = {};
        let countsByProp = {};

        let firstAvailable = 0;
        props.forEach(prop => {
            if (!prop) {
                // the old nulls that we don't need anymore
                return;
            }

            prop = typeof prop == "string" ? {type: prop} : prop;

            let propType = prop.type == "custom" ? prop.label || "custom" : prop.type;

            channelMappings[firstAvailable] = prop;
            countsByProp[propType] = (countsByProp[propType] || 0) + 1;

            if (countsByProp[propType] > 1) {
                prop.repetition = countsByProp[propType];
            }

            if (prop?.repeats > 1) {
                prop.group = countsByProp[propType] - 1;

                for (let i = 1; i < prop.repeats; i++) {
                    let repeatIdx = firstAvailable + i * prop.every;

                    let repeatedProp = {...prop, repetition: i + 1};
                    delete repeatedProp.repeats;
                    delete repeatedProp.every;
                    channelMappings[repeatIdx] = repeatedProp;
                }
            }

            // don't try to be overly smart about determining first available
            // instead just sniff it out
            for (let channel = 0; channel < 512; channel++) {
                if (!channelMappings[channel]) {
                    firstAvailable = channel;
                    break;
                }
            }
        });

        props = [];
        for (let channel = 0; channel < firstAvailable; channel++) {
            props.push(channelMappings[channel]);
        }

        // turn props from a list of prop types into a dict with unique labels
        let propsCounter = {};
        let propsDict = {};

        props.forEach(prop => {
            if (typeof prop == "string") {
                // simplified prop types
                prop = {type: prop};
            }

            delete prop.val; // just in case value has wondered in somehow; XXX - delete it upstream instead

            if (prop.default_value != undefined) {
                prop.defaultVal = parseInt(prop.default_value || 0);
                delete prop.default_value;
            }
            if (prop.default_active != undefined) {
                prop.activeDefault = parseInt(prop.default_active || 0);
                delete prop.default_active;
            }

            if ((prop.modes || []).length > 1) {
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

            if (propsCounter[propName] > 1 || prop.repetition) {
                propName = `${propName}${propsCounter[propName]}`;
            }
            propsDict[propName] = prop;
        });
        // console.log("props dict", propsDict);

        // get max repetitions so that we can dumbly go through bunch of inferring
        let maxRepetitions = Math.max(...Object.values(propsCounter));

        let pixels = [];

        // we identify pixels by their repetition number, e.g. if we have 3 red props,
        // or 3 tilt props, that means we have three pixels. we then parse these into controls
        // that we know, e.g. pixel1.color = {red1,green1, blue1}
        for (let pixelIdx = 0; pixelIdx <= maxRepetitions; pixelIdx++) {
            let numbered = propName => (pixelIdx == 0 ? propName : `${propName}${pixelIdx}`);
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

            let group = null;

            if (exists("red")) {
                group = numberedProp("red").group || 0;

                if (exists("white")) {
                    controls.color = {type: "rgbw-light", props: ["red", "green", "blue", "white"]};
                } else {
                    controls.color = {type: "rgb-light", props: ["red", "green", "blue"]};
                }

                // convert the prop list into {red: red1, green: green1,...}
                controls.color.props = Object.fromEntries(
                    controls.color.props.map(propName => [propName, numbered(propName)])
                );
            } else if (exists("white")) {
                group = numberedProp("dimmer").group || 0;
                controls.color = {type: "w-light", props: ["dimmer"]};

                // convert the prop list into {red: red1, green: green1,...}
                controls.color.props = Object.fromEntries(
                    controls.color.props.map(propName => [propName, numbered(propName)])
                );
            }

            let pixel = {controls};
            if (group != null) {
                pixel.group = group;
            }

            if (Object.keys(pixel.controls).length) {
                pixels.push(pixel);
            }
        }
        if (!pixels.length) {
            pixels = [{}];
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
