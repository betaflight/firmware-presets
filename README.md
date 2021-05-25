# Firmware Presets

Configuration Snippets for the Betaflight Flight Controller Firmware


## Snippet template

```
# Title: Preset title
# FirmwareVersion: 4.2
# FirmwareVersion: 4.3 (as many versions as needed)
# Category: TUNE
# Official: true
# Keywords: word1, word2, word3
# Author: Name Lastname Pilotname
# Description: Description line1
# Description: Description line2  (as many description lines as needed)
# include: file/to/include1.txt
# include: file/to/include2.txt

<cli command 1>
<cli command 2>
....
<cli command n>
```

### Categories
```
    TUNE, RATES, OSD, VTX, LEDS, MODES, BNF, RC_SMOOTHING, MIXED
```

### Official
```
    True, False
```

### include
Optional paths to snippet files to be included. Works similar to C/C++ `#include`.
Allows multiple files to be included. Recursion is not supported yet. Metaproperties of the included files are being ignored.

### Mandatory properties
```
 Title, FirmwareVersion, Category, Official
```

### Optional properties
```
    Author, Description, Include, Keywords
```
