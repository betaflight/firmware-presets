# Firmware Presets

Configuration Snippets for the Betaflight Flight Controller Firmware


## Snippet template

```
# Title: Preset title
# FirmwareVersion: 4.3 or 4.2 etc (optional)
# Author: Name                    (optional)
# Description: Description line1  (optional)
# Description: Description line2  (optional, as many additional lines as needed)

<cli command 1>
<cli command 2>
....
<cli command n>
```
All presets must be located in the "presets" folder or it's subfolders.
It is recommended that every presets subfolder have a **default.txt** file that will reset all related settings to defaults. In this case every preset file can have commands that are different from the defaults only.
