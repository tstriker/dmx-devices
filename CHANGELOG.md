# 0.3.1

* Add an easy way to access all config names via a static prop
  on the fixture class

# 0.3.0

* Switch from identifying configs by channel count to a
  symbolic name
* Add repeatProps and repeatPixels funcs to utils that
  allow packing pixels for pixel and par bars

# 0.2.0

* Switch the API over from an amalgamation of controls to
  separate pixels and controls within; WIP


# 0.1.17

* Introduce pixel groups that allow logical grouping of
  pixels in LED and PAR bars; WIP

# 0.1.12

* Add ADJ MegaTRIPar and Chauvet SlimPAR 56

# 0.1.11
* Minor perf improvements, and add support for white cans
  where you can feed in color and it will set it to max
  brightness; also add beamz cob30ww as a result

# 0.1.10
* Massively improve performance on many props frequent updates
  by debouncing the updates on device level (firing one
  dmx update per frame, rather than all props)

# 0.1.9
* Add the most limited RGB par because that's a thing

# 0.1.8
* Fix unintentional prop rewrites when passed in a partial
  DMX (e.g. "update just these 4 props" would reset everything that
  was not mentioned
* Flip resetDMX flag on device to be false by default, thus
  default is a safer "do not overwrite anything else"

# 0.1.7
* Do not touch dimmer after all in `color` control as
  while you can go from rgba to rgb, you can't get back properly
  as there are two paths. simplest not to touch the dimmer
  instead and poke colors themselves. this frees up dimmer to be
  truly the single source of truth in brightness

# 0.1.6
* Fix setting/getting colors in control when alpha is present
  (was setting float values and then tripping on reading them)

# 0.1.5
* Fix parsing alpha in control (maps to value/dimmer)

# 0.1.4
* Add ADJ Mega HEX Par

# 0.1.3
* RGBLight control's `.color` now checks for alpha

# 0.1.2
* controls are now sorted by `order` property which is mostly
  relevant for LED bars, strips and so on, where orientation
  matters. pass in reverseLights=true in the device constructor
  to flip the direction. I'm not exactly sure which way is the right
  way but some factory defaults make no sense
