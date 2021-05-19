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
# Defaults: path/to/defaults1.txt
# Defaults: path/to/defaults2.txt (as many default snippets as needed)

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

### Defaults
Optional paths to defaults snippet files to reset parameters before applying the current preset.
Allows multiple defaults.

### Mandatory properties
```
 Title, FirmwareVersion, Category, Official
```

### Optional properties
```
    Author, Description, Defaults, Keywords
```
