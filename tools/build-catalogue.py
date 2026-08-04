"""Build the fixture catalogue this package ships.

Two libraries feed it, and they barely overlap - 237 fixtures in common out of 1733, so both earn their keep:

  QLC+ (Apache 2.0)  ~1700 definitions as XML, strongest on the budget end - Eurolite, Stairville, Showtec,
                     beamZ. Small enough to convert whole and ship as finished fixture models.
  GDTF Share         ~9500 fixtures published by the manufacturers themselves, strongest on pro touring gear
                     - Chauvet Professional, Martin, Robe. Far too large to ship, so we build a search index
                     and leave the definitions to be fetched one at a time and converted by src/gdtf.js.

The catalogue is data rather than code, so it belongs wherever it gets served from rather than in this
package - point --out at the consuming app's static directory.

    python tools/build-catalogue.py --out ../showtime/public/fixture-catalogue
    python tools/build-catalogue.py --out <dir> --report <export.json>   # plus coverage against a patch export

The QLC+ download is cached in /tmp, so repeat runs are offline. The GDTF index needs a free gdtf-share.com
account; put it in ~/.config/gdtf-share.json as {"user": ..., "password": ...} and it stays out of the repo.
"""

import argparse
import datetime as dt
import http.cookiejar
import json
import os
import re
import sys
import tarfile
import urllib.request
import xml.etree.ElementTree as ET

from collections import Counter, defaultdict

QLCPLUS_TARBALL = "https://codeload.github.com/mcallegari/qlcplus/tar.gz/refs/heads/master"
CACHE_PATH = "/tmp/qlcplus-fixtures.tar.gz"
CATALOGUE_NAME = "qlcplus.json"

GDTF_LOGIN = "https://gdtf-share.com/apis/public/login.php"
GDTF_LIST = "https://gdtf-share.com/apis/public/getList.php"
GDTF_CREDENTIALS = "~/.config/gdtf-share.json"
GDTF_INDEX_NAME = "gdtf-index.json"

NS = "{http://www.qlcplus.org/FixtureDefinition}"

# QLC+ fixture type -> our fixture type
FIXTURE_TYPES = {
    "Color Changer": "par can",
    "Dimmer": "par can",
    "Moving Head": "moving head",
    "Scanner": "moving head",
    "LED Bar (Beams)": "par bar",
    "LED Bar (Pixels)": "bar",
    "Smoke": "haze",
    "Hazer": "haze",
}

# QLC+ channel preset -> our prop type. Anything absent becomes a "custom" prop keeping its QLC+ name as the
# label, so no channel is ever silently dropped from a mode.
CHANNEL_PRESETS = {
    "IntensityMasterDimmer": "dimmer",
    "IntensityDimmer": "dimmer",
    "IntensityRed": "red",
    "IntensityGreen": "green",
    "IntensityBlue": "blue",
    "IntensityWhite": "white",
    "IntensityAmber": "amber",
    "IntensityUV": "uv",
    "PositionPan": "pan_coarse",
    "PositionPanFine": "pan_fine",
    "PositionTilt": "tilt_coarse",
    "PositionTiltFine": "tilt_fine",
    "SpeedPanSlowFast": "speed",
    "SpeedPanFastSlow": "speed",
    "SpeedTiltSlowFast": "speed",
    "SpeedTiltFastSlow": "speed",
    "SpeedPanTiltSlowFast": "speed",
    "SpeedPanTiltFastSlow": "speed",
    "ColorMacro": "wheel",
    "ColorWheel": "wheel",
    "GoboWheel": "gobo",
    "GoboIndex": "rotation",
    "ShutterStrobeSlowFast": "strobe",
    "ShutterStrobeFastSlow": "strobe",
    "BeamFocusNearFar": "focus",
    "BeamFocusFarNear": "focus",
    "BeamZoomSmallBig": "zoom",
    "BeamZoomBigSmall": "zoom",
}

# presets with no counterpart of ours that are also of no use on a fader, so they stay off the UI
HIDDEN_PRESETS = {"NoFunction"}

# QLC+ <Colour> tag on a legacy intensity channel -> our prop type
COLOUR_TAGS = {
    "Red": "red",
    "Green": "green",
    "Blue": "blue",
    "White": "white",
    "Amber": "amber",
    "UV": "uv",
}

# capability presets that describe a colour wheel slot, a gobo slot, or a discrete mode we can offer as a button
COLOUR_CAPABILITIES = {"ColorMacro", "ColorDoubleMacro", "ColorWheelIndex"}
GOBO_CAPABILITIES = {"GoboMacro", "GoboShakeMacro"}

# a "custom" channel with more discrete steps than this is an effect/macro bank - listing them all is noise
MAX_CUSTOM_MODES = 12

HEX_COLOUR = re.compile(r"^#[0-9a-fA-F]{6}$")


def _fetch_library():
    """Returns the QLC+ .qxf files as {path: xml text}, downloading the repo tarball once."""
    if not os.path.exists(CACHE_PATH):
        print(f"downloading {QLCPLUS_TARBALL}...")
        urllib.request.urlretrieve(QLCPLUS_TARBALL, CACHE_PATH)

    definitions = {}
    with tarfile.open(CACHE_PATH) as archive:
        for member in archive:
            if not member.name.endswith(".qxf") or "/resources/fixtures/" not in member.name:
                continue
            definitions[member.name.split("/resources/fixtures/")[1]] = archive.extractfile(member).read()

    return definitions


def _text(element, tag):
    found = element.find(NS + tag)
    return (found.text or "").strip() if found is not None else ""


def _int(value):
    try:
        return int(value)
    except (TypeError, ValueError):
        return None


def _capabilities(channel):
    """Returns the channel's capabilities as (min, max, preset, label, colours) tuples."""
    caps = []
    for cap in channel.findall(NS + "Capability"):
        colours = [cap.get(res) for res in ("Res1", "Res2") if HEX_COLOUR.match(cap.get(res) or "")]
        caps.append(
            (
                _int(cap.get("Min")) or 0,
                _int(cap.get("Max")) or 0,
                cap.get("Preset") or "",
                (cap.text or "").strip(),
                colours,
            )
        )
    return sorted(caps)


def _prop_type(channel, caps):
    """Works out our prop type for a QLC+ channel, from its preset if it has one and its group if not."""
    preset = channel.get("Preset")
    if preset:
        if preset in CHANNEL_PRESETS:
            return CHANNEL_PRESETS[preset], True
        return "custom", preset not in HIDDEN_PRESETS and not preset.endswith("Fine")

    name = (channel.get("Name") or "").lower()
    group = _text(channel, "Group")
    fine = _text(channel, "Group") and channel.find(NS + "Group").get("Byte") == "1"

    if group == "Intensity":
        colour = _text(channel, "Colour")
        if colour in COLOUR_TAGS:
            return COLOUR_TAGS[colour], True
        if "dimmer" in name or "intensity" in name or "master" in name:
            return "dimmer", True
        return "custom", True

    if group == "Pan":
        return ("pan_fine" if fine else "pan_coarse"), True

    if group == "Tilt":
        return ("tilt_fine" if fine else "tilt_coarse"), True

    if group == "Colour":
        if any(cap[2] in COLOUR_CAPABILITIES for cap in caps):
            return "wheel", True
        return "custom", True

    if group == "Gobo":
        if "rotat" in name or "index" in name:
            return "rotation", True
        if any(cap[2] in GOBO_CAPABILITIES for cap in caps):
            return "gobo", True
        return "custom", True

    if group == "Shutter":
        if "iris" in name:
            return "custom", True
        return "strobe", True

    if group == "Prism":
        return "prism", True

    if group == "Beam":
        if "zoom" in name:
            return "zoom", True
        if "focus" in name:
            return "focus", True
        if "iris" in name or "frost" in name:
            return "custom", True
        return "custom", True

    if group == "Speed":
        if "pan" in name or "tilt" in name:
            return "speed", True
        return "custom", True

    # Effect, Maintenance and Nothing are housekeeping - they belong in the patch but not on a fader
    return "custom", group not in ("Maintenance", "Nothing")


def _prop_modes(prop_type, caps):
    """Turns capabilities into the mode buttons our wheel/gobo/strobe props expose."""
    modes = []

    if prop_type == "wheel":
        for low, _high, preset, label, colours in caps:
            if colours:
                modes.append({"ch_val": low, "color": colours[0].lower()})
            elif preset in COLOUR_CAPABILITIES and label:
                modes.append({"ch_val": low, "val": label})
        return modes

    if prop_type == "gobo":
        for low, _high, preset, label, _colours in caps:
            if preset in GOBO_CAPABILITIES or not preset:
                modes.append({"ch_val": low, "val": label or f"Gobo {len(modes)}"})
        return modes

    if prop_type in ("strobe", "prism"):
        for low, _high, _preset, label, _colours in caps:
            modes.append({"ch_val": low, "val": label, "custom": "stop"})
        return modes

    if prop_type == "custom" and 0 < len(caps) <= MAX_CUSTOM_MODES:
        for low, _high, _preset, label, _colours in caps:
            modes.append({"ch_val": low, "val": label, "custom": "stop"})

    return modes


def _shutter_open_value(caps):
    """The DMX value that opens the shutter - what we want a strobe channel to sit at while a scene runs.

    Fixtures often declare open twice, once as a narrow band near zero and once as a wide one at the top. We
    take the widest, which leaves the most room either side of a value that has to survive a fader nudge.
    """
    open_ranges = [(high - low, high) for low, high, preset, _label, _colours in caps if preset == "ShutterOpen"]
    if not open_ranges:
        return None

    return max(open_ranges)[1]


def _build_prop(channel, caps, degrees):
    prop_type, visible = _prop_type(channel, caps)
    prop = {"type": prop_type}

    if prop_type == "custom":
        prop["label"] = channel.get("Name") or "Channel"

    if prop_type in ("pan_coarse", "tilt_coarse") and degrees.get(prop_type):
        prop["degrees"] = degrees[prop_type]

    modes = _prop_modes(prop_type, caps)
    if modes:
        prop["modes"] = modes

    default_value = _int(channel.get("Default"))
    if default_value:
        prop["default_value"] = default_value

    if prop_type == "dimmer":
        prop["default_active"] = 255
    elif prop_type == "strobe":
        shutter_open = _shutter_open_value(caps)
        if shutter_open is not None:
            prop["default_active"] = shutter_open
            prop.setdefault("default_value", shutter_open)

    if not visible:
        prop["ui"] = False

    return prop


def _collapse_repeats(props, heads):
    """Folds a pixel bar's repeated channel block into our every/repeats props.

    A QLC+ mode lists every pixel's channels in full and describes the grouping with <Head> elements. Where
    those heads sit at a regular stride and repeat the same prop types, we keep the first block and null the
    rest, which is how our own bar models are stored.
    """
    starts = sorted(min(_int(channel.text) or 0 for channel in head.findall(NS + "Channel")) for head in heads)
    if len(starts) < 2:
        return props

    stride = starts[1] - starts[0]
    if stride < 1 or any(later - earlier != stride for earlier, later in zip(starts, starts[1:])):
        return props

    first, repeats = starts[0], len(starts)
    if first + stride * repeats > len(props):
        return props

    for offset in range(stride):
        block_type = (props[first + offset] or {}).get("type")
        for repeat in range(1, repeats):
            if (props[first + offset + repeat * stride] or {}).get("type") != block_type:
                return props

    collapsed = list(props)
    for offset in range(stride):
        collapsed[first + offset] = {**props[first + offset], "every": stride, "repeats": repeats}
    for channel in range(first + stride, first + stride * repeats):
        collapsed[channel] = None

    return collapsed


def _pan_tilt_degrees(element):
    physical = element.find(NS + "Physical")
    focus = physical.find(NS + "Focus") if physical is not None else None
    if focus is None:
        return {}

    return {
        "pan_coarse": _int(focus.get("PanMax")),
        "tilt_coarse": _int(focus.get("TiltMax")),
    }


def _convert(xml_text):
    """Converts one .qxf definition into a Showtime fixture model, or None if it has nothing patchable."""
    try:
        root = ET.fromstring(xml_text)
    except ET.ParseError:
        return None

    manufacturer = _text(root, "Manufacturer")
    model = _text(root, "Model")
    if not manufacturer or not model:
        return None

    channels = {}
    for channel in root.findall(NS + "Channel"):
        channels[channel.get("Name")] = channel

    fixture_degrees = _pan_tilt_degrees(root)
    modes = []

    for mode in root.findall(NS + "Mode"):
        degrees = {**fixture_degrees, **{k: v for k, v in _pan_tilt_degrees(mode).items() if v}}
        ordered = sorted(mode.findall(NS + "Channel"), key=lambda channel: _int(channel.get("Number")) or 0)
        props = []

        for entry in ordered:
            channel = channels.get((entry.text or "").strip())
            if channel is None:
                props.append({"type": "custom", "label": (entry.text or "").strip() or "Channel", "ui": False})
                continue
            props.append(_build_prop(channel, _capabilities(channel), degrees))

        if not props:
            continue

        heads = mode.findall(NS + "Head")
        if heads:
            props = _collapse_repeats(props, heads)

        modes.append({"name": mode.get("Name") or f"{len(props)}ch", "channels": len(props), "props": props})

    if not modes:
        return None

    return {
        "manufacturer": manufacturer,
        "model": f"{manufacturer} {model}",
        "type": FIXTURE_TYPES.get(_text(root, "Type"), "misc"),
        "source": "qlcplus",
        "modes": modes,
    }


def _gdtf_session():
    """Logs in to GDTF Share and returns an opener holding the session cookie."""
    path = os.path.expanduser(GDTF_CREDENTIALS)
    if not os.path.exists(path):
        return None

    with open(path) as credentials_file:
        credentials = json.load(credentials_file)

    jar = http.cookiejar.CookieJar()
    opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))
    request = urllib.request.Request(
        GDTF_LOGIN,
        data=json.dumps(credentials).encode(),
        headers={"Content-Type": "application/json"},
    )

    with opener.open(request, timeout=30) as response:
        if not json.load(response).get("result"):
            return None

    return opener


def build_gdtf_index(out_dir):
    """Builds the searchable GDTF index.

    The listing already carries each revision's modes and channel counts, so the index needs nothing beyond
    it - the fixture itself only gets downloaded once somebody picks it. Where a fixture has been revised
    several times we keep the newest, which is what the Share itself offers first.
    """
    opener = _gdtf_session()
    if not opener:
        print(f"no usable GDTF credentials at {GDTF_CREDENTIALS} - skipping the GDTF index")
        return None

    with opener.open(GDTF_LIST, timeout=180) as response:
        revisions = json.load(response).get("list") or []

    newest = {}
    for revision in revisions:
        key = (revision["manufacturer"], revision["fixture"])
        if key not in newest or revision["creationDate"] > newest[key]["creationDate"]:
            newest[key] = revision

    fixtures = [
        {
            "manufacturer": revision["manufacturer"],
            "model": f"{revision['manufacturer']} {revision['fixture']}",
            "rid": revision["rid"],
            "modes": [[mode["name"], mode["dmxfootprint"]] for mode in revision["modes"]],
        }
        for revision in newest.values()
    ]
    fixtures.sort(key=lambda fixture: fixture["model"].lower())

    index = {
        "source": "GDTF Share",
        "url": "https://gdtf-share.com",
        "built": dt.datetime.now(dt.UTC).strftime("%Y-%m-%d"),
        "fixtures": fixtures,
    }

    index_path = os.path.join(out_dir, GDTF_INDEX_NAME)
    with open(index_path, "w") as index_file:
        json.dump(index, index_file, separators=(",", ":"))

    size_mb = os.path.getsize(index_path) / 1024 / 1024
    print(f"{len(fixtures)} fixtures from {len(revisions)} revisions -> {index_path} ({size_mb:.1f} MB)")

    return index


def build(out_dir):
    definitions = _fetch_library()
    fixtures = []
    skipped = []

    for path, xml_text in sorted(definitions.items()):
        fixture = _convert(xml_text)
        if fixture:
            fixtures.append(fixture)
        else:
            skipped.append(path)

    fixtures.sort(key=lambda fixture: fixture["model"].lower())
    catalogue = {
        "source": "QLC+ fixture library (Apache 2.0)",
        "url": "https://github.com/mcallegari/qlcplus",
        "built": dt.datetime.now(dt.UTC).strftime("%Y-%m-%d"),
        "fixtures": fixtures,
    }

    catalogue_path = os.path.join(out_dir, CATALOGUE_NAME)
    with open(catalogue_path, "w") as catalogue_file:
        json.dump(catalogue, catalogue_file, separators=(",", ":"))

    prop_types = Counter(
        prop["type"] for fixture in fixtures for mode in fixture["modes"] for prop in mode["props"] if prop
    )
    size_mb = os.path.getsize(catalogue_path) / 1024 / 1024

    print(f"{len(fixtures)} fixtures, {sum(len(f['modes']) for f in fixtures)} modes -> {catalogue_path} ({size_mb:.1f} MB)")
    print(f"skipped {len(skipped)} definitions with no usable mode")
    print("props by type:", dict(prop_types.most_common()))

    return catalogue


# manufacturers go by several names between a patch sheet and a fixture library
MANUFACTURER_ALIASES = {
    "adj": "americandj",
    "chauvetdj": "chauvet",
    "chauvetprofessional": "chauvet",
    "martinprofessional": "martin",
    "thomannstairville": "stairville",
    "stairvill": "stairville",
}

# a patched model often carries its mode in the name - "Haze 2ch", "iKon profile plus (2 ch)"
MODE_SUFFIX = re.compile(r"[\s/(]*\d+\s*(ch|channel|dmx)\b.*$", re.IGNORECASE)


def _search_key(name):
    name = MODE_SUFFIX.sub("", name or "")
    key = re.sub(r"[^a-z0-9]", "", name.lower())
    for alias, canonical in MANUFACTURER_ALIASES.items():
        if key.startswith(alias):
            return canonical + key[len(alias) :]
    return key


def _mode_summary(fixture):
    """Both catalogues describe modes, but the GDTF index keeps them as [name, channels] pairs."""
    modes = fixture.get("modes") or []
    if modes and isinstance(modes[0], dict):
        return [(mode["name"], mode["channels"]) for mode in modes]
    return [(name, channels) for name, channels in modes]


def report(export_path, catalogues):
    """Checks a Showtime fixtures export against the catalogues and prints what they would and wouldn't cover."""
    with open(export_path) as export_file:
        export = json.load(export_file)

    by_key = defaultdict(list)
    for label, catalogue in catalogues:
        for fixture in (catalogue or {}).get("fixtures", []):
            by_key[_search_key(fixture["model"])].append((label, fixture))

    patched = Counter(fixture["model"] for fixture in export.get("fixtures", {}).values())
    for model in sorted({model["model"] for model in export.get("production_fixtures", [])}):
        patched.setdefault(model, 0)

    rows = []
    covered = 0

    for model, count in sorted(patched.items()):
        key = _search_key(model)
        hits = by_key.get(key)
        kind = "exact"

        if not hits:
            kind = "near"
            hits = [
                entry
                for search_key, entries in by_key.items()
                for entry in entries
                if len(key) > 5 and (key in search_key or search_key in key)
            ]

        if not hits:
            rows.append(f"  [missing] {model} x{count}")
            continue

        covered += count
        sources = "+".join(sorted({label for label, _fixture in hits}))
        _label, fixture = hits[0]
        modes = ", ".join(f"{name} ({channels}ch)" for name, channels in _mode_summary(fixture)[:4])
        rows.append(f"  [{kind:<7}] {model} x{count} -> {sources}: {fixture['model']} | {modes}")

    total = sum(patched.values())
    print(f"\n{export_path}: {len(patched)} distinct models, {total} patched fixtures")
    if total:
        print(f"  covered: {covered}/{total} = {covered / total * 100:.0f}%\n")
    print("\n".join(rows))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", metavar="DIR", required=True, help="directory to write the catalogue files to")
    parser.add_argument("--report", metavar="EXPORT", nargs="*", help="Showtime fixtures exports to check coverage for")
    args = parser.parse_args()

    out_dir = os.path.abspath(os.path.expanduser(args.out))
    if not os.path.isdir(out_dir):
        sys.exit(f"{out_dir} is not a directory - create it first so a typo can't scatter 8 MB somewhere odd")

    catalogues = [("qlcplus", build(out_dir)), ("gdtf", build_gdtf_index(out_dir))]
    for export in args.report or []:
        report(export, catalogues)
