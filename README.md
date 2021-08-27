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

# region begin (checked) Name of the region 1
<cli command n + 1>
<cli command n + 2>
...
<cli command m>
# region end

# region begin (unchecked) Name of the region 2
<cli command m + 1>
<cli command m + 2>
...
<cli command k>
# region end
```

### Categories
```
    TUNE, RATES, OSD, VTX, LEDS, MODES, BNF, RC_SMOOTHING, RC_LINK, MIXED
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

### Regions
Regions are optional directives. They can be used to mark a group of CLI commands and give a name for this group. They are similar to C# preprocessor directive `#region`.
When a CLI preset contains regions, a Configurator user will see a list of available regions by their names. This list will appear in the preset dialog once a specific preset is selected. User will be able to select desired regions to apply.

An example of using regions is a BNF quad preset. Manufacturer could add different regions for different radio protocols such as SBUS, Crossfire, Ghost, etc. In this case, a user will be able to select his radio protocol when he applies this preset together with different rc_smoothing settings.

A region starts with `# region begin <region name>` directive. It can be extended with `(checked)` or `(unchecked)` to specify whether this region should be selected by default or not.
Every region should be closed with `# region end`. Between `# region begin <region name>` and `# region end` there is a list of CLI commands included in the region.
Nested regions are not allowed yet.
Regions could be split into multiple parts although it is not recommended for readability.

If you `# include` a preset with the regions inside, these regions will not appear in the final preset.
If you still want to include them, you have to add a dummy region declarations like:
```
# region begin <region name>
# region end
```

Using `# include` is allowed within the region and works as expected:
```
# region begin <region name>
# include file/to/include.txt
# region end
```
