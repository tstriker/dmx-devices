// Working with a fixture catalogue built by tools/build-catalogue.py.
//
// Two libraries feed one search. The QLC+ catalogue holds finished fixture models that can be patched as they
// are; the GDTF one is an index, so picking an entry from it still needs the .gdtf fetched and run through
// parseGDTF. They barely overlap - 237 fixtures in common out of 1733 - so both are worth carrying.
//
// The data itself is the caller's to build, host and fetch: it runs to 8 MB, it goes stale as manufacturers
// publish revisions, and building it needs a gdtf-share.com account. None of that belongs in a package whose
// job is talking to lights. What lives here is how to read the shape once you have it.

function searchKey(name) {
    return (name || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .trim();
}

/**
 * Merges the two catalogue files into the one list search works over.
 *
 * @param {object} qlcplus - parsed qlcplus.json
 * @param {object} gdtf - parsed gdtf-index.json
 * @returns {Array} fixtures as {model, manufacturer, source, modes, rid?, type?}
 */
export function mergeCatalogues(qlcplus, gdtf) {
    return [
        ...(qlcplus?.fixtures || []),
        // only the QLC+ side names its source per fixture, since it carries whole definitions
        ...(gdtf?.fixtures || []).map(fixture => ({...fixture, source: "gdtf"})),
    ];
}

/** The modes a catalogue entry offers, as {name, channels} - the GDTF index stores them as pairs. */
export function fixtureModes(fixture) {
    return (fixture.modes || []).map(mode => {
        if (Array.isArray(mode)) {
            return {name: mode[0], channels: mode[1]};
        }
        return {name: mode.name, channels: mode.channels};
    });
}

/**
 * Ranked search over a loaded catalogue.
 *
 * Every word typed has to appear somewhere in the fixture's name, so "rogue wash" finds the Rogue R1X Wash
 * without also dragging in every other wash. Matches that start with what was typed come first, since
 * somebody typing "mac 250" wants the MAC 250 ahead of the MAC 250 Krypton.
 */
export function searchFixtures(fixtures, query, limit = 50) {
    let words = searchKey(query).split(" ").filter(Boolean);
    if (!words.length) {
        return [];
    }

    let matches = [];

    for (let fixture of fixtures) {
        let haystack = searchKey(fixture.model);
        if (!words.every(word => haystack.includes(word))) {
            continue;
        }

        let joined = words.join(" ");
        let rank = 2;
        if (haystack.startsWith(joined)) {
            rank = 0;
        } else if (haystack.includes(joined)) {
            rank = 1;
        }

        matches.push({fixture, rank, length: haystack.length});
    }

    matches.sort((first, second) => first.rank - second.rank || first.length - second.length);

    return matches.slice(0, limit).map(match => match.fixture);
}
