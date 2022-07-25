# 0.1.2

* controls are now sorted by `order` property which is mostly 
  relevant for LED bars, strips and so on, where orientation 
  matters. pass in reverseLights=true in the device constructor
  to flip the direction. I'm not exactly sure which way is the right
  way but some factory defaults make no sense
