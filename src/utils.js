import chroma from "chroma-js";

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

export function colorToRGBW(color) {
    // note - while this func might be correct, it seems to diminish other colors
    // one solution is to use the white additively.
    // megamath https://www.neltnerlabs.com/saikoled/how-to-convert-from-hsi-to-rgb-white
    color = chroma(color);
    let [h, s, i] = color.hsi();

    h = ((h || 0) * Math.PI) / 180;
    let r, g, b, w;

    if (h < 2.09439) {
        let cos_h = Math.cos(h);
        let cos_1047_h = Math.cos(1.047196667 - h);
        r = ((s * 255 * i) / 3) * (1 + cos_h / cos_1047_h);
        g = ((s * 255 * i) / 3) * (1 + (1 - cos_h / cos_1047_h));
        b = 0;
        w = 255 * (1 - s) * i;
    } else if (h < 4.188787) {
        h = h - 2.09439;
        let cos_h = Math.cos(h);
        let cos_1047_h = Math.cos(1.047196667 - h);
        g = ((s * 255 * i) / 3) * (1 + cos_h / cos_1047_h);
        b = ((s * 255 * i) / 3) * (1 + (1 - cos_h / cos_1047_h));
        r = 0;
        w = 255 * (1 - s) * i;
    } else {
        h = h - 4.188787;
        let cos_h = Math.cos(h);
        let cos_1047_h = Math.cos(1.047196667 - h);
        b = ((s * 255 * i) / 3) * (1 + cos_h / cos_1047_h);
        r = ((s * 255 * i) / 3) * (1 + (1 - cos_h / cos_1047_h));
        g = 0;
        w = 255 * (1 - s) * i;
    }

    return [r, g, b, w];
}
