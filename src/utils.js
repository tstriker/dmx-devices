export function round(val, precision) {
    let multiplier = Math.pow(10, precision || 0);
    return Math.round(val * multiplier) / multiplier;
}

export function range(start, end, step) {
    if (end === undefined) {
        [start, end, step] = [0, start, 1];
    }

    step = Math.abs(step) || 1;
    if (end < start) {
        step = step * -1;
    }

    function* iterator() {
        for (let i = start; start < end ? i < end : i > end; i += step) {
            yield i;
        }
    }

    return [...iterator()];
}

export function between(val, bounds) {
    return bounds.some(([lower, upper]) => val >= lower && val <= upper);
}

export function rangeProp({channel = null, label = null, defaultVal = 0, activeDefault = 0, ...other}) {
    return {
        channel,
        label,
        stops: [
            {chVal: 0, val: 0},
            {chVal: 255, val: 1},
        ],
        defaultVal,
        activeDefault,
        ...other,
    };
}

export function repeatProps(repetitions, props, fromChannel) {
    let res = {};

    let channel = fromChannel;
    for (let i = 1; i <= repetitions; i += 1) {
        Object.entries(props).forEach(([propName, config]) => {
            let name = propName.replace("#", i);
            res[name] = {...config};
            if (channel) {
                res[name].channel = channel;
                channel += 1;
            }
        });
    }
    return res;
}

export function repeatPixels(repetitions, pixelConfig) {
    let res = [];
    for (let i = 1; i <= repetitions; i += 1) {
        let pixel = {
            id: pixelConfig.id.replace("#", i),
            label: pixelConfig.label.replace("#", i),
            group: (pixelConfig.group instanceof Function ? pixelConfig.group(i) : pixelConfig.group) || 0,
            controls: {},
        };
        Object.entries(pixelConfig.controls).forEach(([control, config]) => {
            if (typeof config == "string") {
                // direct mapping
                pixel.controls[control] = config.replace("#", i);
            } else if (config.props) {
                // a type of sorts, this one will come with props
                pixel.controls[control] = {
                    ...config,
                    props: Object.fromEntries(
                        Object.entries(config.props).map(([controlProp, prop]) => [controlProp, prop.replace("#", i)])
                    ),
                };
            }
        });

        res.push(pixel);
    }
    return res;
}
