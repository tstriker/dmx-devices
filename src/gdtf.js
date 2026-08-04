// Turns a GDTF fixture description into the config shape parseFixtureConfig understands.
//
// GDTF (gdtf-share.com) is the fixture format published by manufacturers themselves. A .gdtf file is a zip
// whose description.xml holds the whole device; the caller unpacks that and hands us the parsed document,
// so nothing here needs to know about zips or the network.
//
// The format sits two levels deeper than ours. A DMXChannel claims one or two slots through its Offset,
// carries a LogicalChannel naming the attribute, and splits the 0-255 range into ChannelFunctions that each
// own a band and can name their own attribute - a shutter channel is typically one open band, one strobe
// band, another open band and so on, twenty times over. We keep the channel's headline attribute as the prop
// type and fold the bands underneath it into the mode buttons the prop offers.

// GDTF attribute names come from a published dictionary, so this is a lookup rather than the name sniffing
// a QLC+ definition needs. Anything missing lands as a custom prop keeping its attribute as the label.
let attributeProps = {
    Pan: "pan_coarse",
    Tilt: "tilt_coarse",
    PositionMSpeed: "speed",

    Dimmer: "dimmer",
    Shutter1: "strobe",

    ColorAdd_R: "red",
    ColorAdd_G: "green",
    ColorAdd_B: "blue",
    ColorAdd_W: "white",
    ColorAdd_A: "amber",
    ColorAdd_RY: "amber",
    ColorAdd_UV: "uv",
    ColorAdd_WW: "warm_white",
    ColorAdd_CW: "cool_white",

    Color1: "wheel",
    Color2: "wheel",
    Gobo1: "gobo",
    Gobo2: "gobo",
    Gobo1Pos: "rotation",
    Gobo2Pos: "rotation",
    Gobo1PosRotate: "rotation",
    Gobo2PosRotate: "rotation",
    Prism1: "prism",

    Zoom: "zoom",
    Focus1: "focus",
};

// housekeeping attributes that belong in the patch so the channel count adds up, but not on a fader
let hiddenAttributes = new Set(["NoFeature", "Control1", "Control2", "Function", "Reserved"]);

// a custom channel carved into more bands than this is an effect bank - listing them all is noise
let maxCustomModes = 12;

function attributeOf(element) {
    return (element && element.getAttribute("Attribute")) || "";
}

/** GDTF writes DMX values as "raw/bytes" - rescale to the 0-255 our props address. */
function dmxValue(value) {
    let [raw, bytes] = (value || "0/1").split("/");
    let size = parseInt(bytes) || 1;
    let scale = Math.pow(256, size) - 1;
    return Math.round(((parseInt(raw) || 0) / scale) * 255);
}

/** Wheel slots carry CIE xyY, which is what the manufacturer measured rather than a guess at a hex code. */
function xyYToHex(color) {
    let [x, y] = (color || "").split(",").map(parseFloat);
    if (!x || !y) {
        return null;
    }

    // back to XYZ, holding luminance at full so the swatch shows the hue rather than the fixture's output
    let scaledY = 1;
    let scaledX = (scaledY / y) * x;
    let scaledZ = (scaledY / y) * (1 - x - y);

    let red = scaledX * 3.2406 + scaledY * -1.5372 + scaledZ * -0.4986;
    let green = scaledX * -0.9689 + scaledY * 1.8758 + scaledZ * 0.0415;
    let blue = scaledX * 0.0557 + scaledY * -0.204 + scaledZ * 1.057;

    let channels = [red, green, blue].map(channel => {
        let gamma = channel <= 0.0031308 ? channel * 12.92 : 1.055 * Math.pow(Math.max(channel, 0), 1 / 2.4) - 0.055;
        let scaled = Math.round(Math.min(Math.max(gamma, 0), 1) * 255);
        return scaled.toString(16).padStart(2, "0");
    });

    return `#${channels.join("")}`;
}

function readWheels(root) {
    let wheels = {};
    for (let wheel of root.querySelectorAll("Wheels > Wheel")) {
        wheels[wheel.getAttribute("Name")] = [...wheel.querySelectorAll("Slot")].map(slot => ({
            name: slot.getAttribute("Name"),
            color: xyYToHex(slot.getAttribute("Color")),
        }));
    }
    return wheels;
}

/**
 * The wheel a channel's slots refer to.
 *
 * A ChannelFunction may name its wheel outright, but plenty of real files leave that off and rely on the
 * reader to work it out, so fall back to matching the wheel's name against the attribute and then to the
 * fixture's only wheel.
 */
function wheelFor(fn, attribute, wheels) {
    let named = wheels[fn.getAttribute("Wheel")];
    if (named) {
        return named;
    }

    let wanted = /^Gobo/.test(attribute) ? "gobo" : "colou?r";
    let matched = Object.keys(wheels).find(name => new RegExp(wanted, "i").test(name));
    if (matched) {
        return wheels[matched];
    }

    let all = Object.values(wheels);
    return all.length == 1 ? all[0] : [];
}

/** The bands a channel is carved into, as {chVal, label, color} in DMX order. */
function readBands(channel, attribute, wheels) {
    let bands = [];

    for (let fn of channel.querySelectorAll("ChannelFunction")) {
        let slots = wheelFor(fn, attribute, wheels);
        let sets = [...fn.querySelectorAll("ChannelSet")];

        if (!sets.length) {
            bands.push({chVal: dmxValue(fn.getAttribute("DMXFrom")), label: fn.getAttribute("Name")});
            continue;
        }

        for (let set of sets) {
            // a ChannelSet names the band far better than the function does - "Pulse Strobe" beats "STROBE 14"
            let slotIndex = parseInt(set.getAttribute("WheelSlotIndex")) || 0;
            bands.push({
                chVal: dmxValue(set.getAttribute("DMXFrom")),
                label: set.getAttribute("Name") || fn.getAttribute("Name"),
                color: slotIndex > 0 ? (slots[slotIndex - 1] || {}).color : null,
            });
        }
    }

    bands.sort((first, second) => first.chVal - second.chVal);

    // a shutter returns to plain "Open" between every strobe band, so the same label comes round a dozen
    // times over. Each distinct effect earns a button; the repeats of one already reached say nothing.
    let seen = new Set();
    return bands.filter(band => {
        if (seen.has(band.label)) {
            return false;
        }
        seen.add(band.label);
        return true;
    });
}

function buildModes(propType, bands) {
    if (propType == "wheel") {
        // only the bands that actually landed on a wheel slot carry a colour worth showing
        let coloured = bands.filter(band => band.color);
        if (coloured.length) {
            return coloured.map(band => ({ch_val: band.chVal, color: band.color}));
        }
        return bands.map(band => ({ch_val: band.chVal, val: band.label}));
    }

    if (propType == "gobo") {
        return bands.map(band => ({ch_val: band.chVal, val: band.label}));
    }

    if (["strobe", "prism"].includes(propType)) {
        return bands.map(band => ({ch_val: band.chVal, val: band.label, custom: "stop"}));
    }

    if (propType == "custom" && bands.length > 1 && bands.length <= maxCustomModes) {
        return bands.map(band => ({ch_val: band.chVal, val: band.label, custom: "stop"}));
    }

    return null;
}

/**
 * The value that leaves a shutter open, so a scene isn't run through a closed one.
 *
 * The fixture's own declared default is the manufacturer's answer and beats anything we work out, but only
 * when it really does land in an open band - plenty of definitions rest at zero, which is shut.
 */
function shutterOpenValue(bands, declaredDefault) {
    let open = bands.filter(band => /open/i.test(band.label || "") && !/strobe|pulse|random/i.test(band.label || ""));
    if (!open.length) {
        return null;
    }

    let bandAt = declaredDefault == null ? null : bands.filter(band => band.chVal <= declaredDefault).pop();
    if (bandAt && open.includes(bandAt)) {
        return declaredDefault;
    }

    return open[0].chVal;
}

function buildProp(channel, wheels) {
    let logical = channel.querySelector("LogicalChannel");
    let primary = channel.querySelector("ChannelFunction");
    let attribute = attributeOf(logical) || attributeOf(primary);
    let propType = attributeProps[attribute] || "custom";
    let bands = readBands(channel, attribute, wheels);
    let prop = {type: propType};

    if (propType == "custom") {
        prop.label = attribute || "Channel";
        if (hiddenAttributes.has(attribute)) {
            prop.ui = false;
        }
    }

    if (["pan_coarse", "tilt_coarse"].includes(propType) && primary) {
        // the physical range is the real travel the manufacturer measured, not the 540/270 we would assume
        let from = parseFloat(primary.getAttribute("PhysicalFrom"));
        let to = parseFloat(primary.getAttribute("PhysicalTo"));
        if (!isNaN(from) && !isNaN(to) && to != from) {
            prop.degrees = Math.round(Math.abs(to - from));
        }
    }

    let modes = buildModes(propType, bands);
    if (modes && modes.length > 1) {
        prop.modes = modes;
    }

    let defaultValue = primary && dmxValue(primary.getAttribute("Default"));
    if (defaultValue) {
        prop.default_value = defaultValue;
    }

    if (propType == "dimmer") {
        prop.default_active = 255;
    } else if (propType == "strobe") {
        let open = shutterOpenValue(bands, defaultValue);
        if (open != null) {
            prop.default_active = open;
            prop.default_value = open;
        }
    }

    return {prop, attribute};
}

function buildMode(mode, wheels) {
    let props = {};
    let highest = 0;

    for (let channel of mode.querySelectorAll("DMXChannels > DMXChannel")) {
        let offsets = (channel.getAttribute("Offset") || "")
            .split(",")
            .map(offset => parseInt(offset))
            .filter(offset => offset > 0);

        if (!offsets.length) {
            // a channel with no offset is a virtual one - it steers other channels and takes no DMX slot
            continue;
        }

        let {prop, attribute} = buildProp(channel, wheels);
        props[offsets[0]] = prop;

        // the second offset is the fine byte of the same attribute
        for (let fine of offsets.slice(1)) {
            if (prop.type.endsWith("_coarse")) {
                props[fine] = {type: prop.type.replace("_coarse", "_fine")};
            } else {
                // "red fine" reads better than the "ColorAdd_R fine" the dictionary would give us
                let name = prop.type == "custom" ? attribute : prop.type;
                props[fine] = {type: "custom", label: `${name} fine`, ui: false};
            }
        }

        highest = Math.max(highest, ...offsets);
    }

    let ordered = [];
    for (let channel = 1; channel <= highest; channel++) {
        ordered.push(props[channel] || {type: "custom", label: "Unused", ui: false});
    }

    return {name: mode.getAttribute("Name") || `${highest}ch`, channels: highest, props: ordered};
}

function guessType(modes, attributes) {
    let types = new Set();
    for (let mode of modes) {
        for (let prop of mode.props) {
            types.add(prop.type);
        }
    }

    if (attributes.has("Haze1") || attributes.has("Fog1")) {
        return "haze";
    }

    if (types.has("pan_coarse") && types.has("tilt_coarse")) {
        return "moving head";
    }
    if (types.has("gobo")) {
        return "moving head";
    }

    // a fixture repeating a cell's worth of props down its length is a bar rather than a single lamp
    let cells = modes.map(mode => {
        let repeats = {};
        for (let prop of mode.props) {
            repeats[prop.type] = (repeats[prop.type] || 0) + 1;
        }
        return Math.max(0, ...["red", "white", "dimmer"].map(type => repeats[type] || 0));
    });

    if (Math.max(0, ...cells) > 2) {
        return "bar";
    }

    return "par can";
}

/**
 * Converts a parsed GDTF description.xml into a fixture config.
 *
 * @param {Document} doc - description.xml, parsed with DOMParser in the browser
 * @returns {object} config accepted by parseFixtureConfig, or null if the document holds no DMX mode
 */
export function parseGDTF(doc) {
    let root = doc.querySelector("FixtureType");
    if (!root) {
        return null;
    }

    let wheels = readWheels(root);
    let modes = [...root.querySelectorAll("DMXModes > DMXMode")]
        .map(mode => buildMode(mode, wheels))
        .filter(mode => mode.channels > 0);

    if (!modes.length) {
        return null;
    }

    let manufacturer = root.getAttribute("Manufacturer") || "";
    let name = root.getAttribute("LongName") || root.getAttribute("Name") || "";
    let model = [manufacturer, name].filter(Boolean).join(" ").trim();

    // the raw attributes say things the mapped props no longer can - a hazer's channels both land on custom
    let attributes = new Set([...root.querySelectorAll("LogicalChannel")].map(attributeOf));

    return {
        model,
        manufacturer,
        type: guessType(modes, attributes),
        source: "gdtf",
        modes,
    };
}

export {xyYToHex, dmxValue};
