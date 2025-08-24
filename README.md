# Proper, programmable access to devices that support DMX

TL;DR instead of saying "set channel 37 to 141" why not say "set light1 to 'pink'".

# Alpha quality code disclaimer

This package is in its very early days, the API hasn't stabilised yet
and much is yet to be figured out, so do use it with this caveat in mind.
I'd be eager to hear any usecases, so do give a shout on github!

# Installation

`npm install dmx-devices`

# Demo

```javascript
// import a device, a Beamz RGBW bar in this case
import {BeamzLCB244} from "dmx-devices";

// init at address 1 in 58 channel mode (this specific bar supports 9, 16,
// 30, and 58 channel modes)
let bar = new BeamzLCB244(1, "58ch");

// set color to pink. the reason why the property is called `light1` is
// because in 58 channel mode you get access to 8 individual light groups
// on the LED bar
bar.light1.color = "pink";

// `dmx` property is a dict of {channel: value} that you can forward to
// the DMX controller
console.log(bar.dmx);

> {"1":0,"2":0,"3":255,"4":192,"5":203,"6":192,"7":0,"8":0,"9":0...
```

# Currently recognized devices & adding your own

Check the [devices directory](https://github.com/tstriker/dmx-devices/tree/main/src/devices) for all currently recognized devices.

The [LED Par](https://github.com/tstriker/dmx-devices/blob/main/src/devices/pars/par.js) is a good starting point for figuring how to create your own config.
