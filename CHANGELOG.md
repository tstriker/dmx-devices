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
