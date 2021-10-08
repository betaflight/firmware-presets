# Firmware Presets

A simple way to configure your Betaflight Flight Controller Firmware settings.

- [Introduction](https://github.com/betaflight/firmware-presets#introduction)
- [Applying and using Presets](https://github.com/betaflight/firmware-presets#applying-and-using-presets)
- [Providing feedback](https://github.com/betaflight/firmware-presets#providing-feedback)
- [Creating new presets](https://github.com/betaflight/firmware-presets#creating-new-presets)
- [Modifying existing presets](https://github.com/betaflight/firmware-presets#modifying-existing-presets)
- [Preset specifications](https://github.com/betaflight/firmware-presets#preset-specifications)
- [Credits](https://github.com/betaflight/firmware-presets#credits)

## Introduction

The Betaflight Preset system makes it easy for a user to find and apply CLI 'snippets' to configure and modify their firmware settings.

All Presets go through a checking and approval process before being made publicly available.

>WARNING: When a Preset is saved, the configuration settings are permanently changed!  Users MUST make a backup of their previous settings, and know how to restore their settings from the backup.

## Applying and using Presets

- Make a backup of your current settings (go to CLI, type `dump all`, and save that data to a safe place)`
- Go to the Preset tab in Configurator
- Search for the Preset that you want to apply and click on it
- Review the changes that will be made (optional) by clicking `Open Online`
- Click `Apply` - this writes the settings to the CLI
- Click `Save` to permanently write the changes to the firmware.  There is no undo function.  

A Preset's description fields should explain the purpose of the Preset and, generally, what will be changed.  More information may be available in the Pull Requests associated with the Preset. 

If a Preset changes things that you don't want to change, make a note of those changes and revert them manually later.  For example, if a complex Preset includes a Rates change, make a note of your existing rates, apply and save the Preset, then give it a try with the new rates.  If you don't like the new rates, manually restore your original settings.

More than one Preset can be applied, sequentially, before saving.  If the same field is changed by multiple presets, the last applied Preset takes precedence.

## Providing feedback

Currently, the best way to provide feedback is by adding a comment to the Pull Request that generated the preset.  

A link to the associated Pull Request is included in the Preset itself, or you can use the inbuilt Github pull request search function.

## Creating new presets

Submissions for new presets must be made with a GitHub *Pull Request* (PR):
- A separate PR is required for each Preset.
- Every PR will be assessed carefully by Betaflight developers.
- Approval is not automatic, and may take some time.
- Since CLI names and preset values will change from version to version, it's usually best to make separate presets for 4.2 or 4.3
- The Preset must comply with the [specifications](Preset-specifications) and must include a concise description of what will be changed

Before final submission of the PR, check the preset by:
- installing `node.js` for your OS
- running `node indexer/check.js` in a terminal window from your draft's working directory.

After creating the PR, push a commit that includes the URL for the Pull Reqest field.

After approval, the author:
- should be responsive to feedback from users via comments to the originating PR
- is responsible for maintaining compatibility with future Betaflight firmware releases

## Modifying existing presets

Presets may be modified, with or without permission of the author, by a subsequent pull request.

Any PR that modifies an existing Preset must be linked to the original PR, so that the author will receive notification of any proposed changes.

## Preset specifications

Presets contain CLI snippets that will be applied by the user.

To find a Preset, the user will search by keywords, categories, or name.  Carefully consider the content of these fields when submitting a Preset.  

Checking out similar Presets beforehand may be useful.

| Field | Notes |
| ----------- | ----------- |
| File name | unique, brief, descriptive, include author, underscores not spaces eg race_4in_ctzsnooze |
| Title | explanatory, include the main characteristics of the preset. |
| FirmwareVersion | one line for each supported version. as many lines as requred. Ensure that all CLI commands are readable by the firmware versions listed.  CLI commands that do not match will throw errors.  If a Preset support two versions by including two versions of the same command, explain to the user that an error will be gene|
| Official | True only for betaflight developed Presets |
| Category | `TUNE` category should only include PIDs, PID modifiers and filters.  Use `MIXED` when a changes are made across more than one category, eg a complete setup for a BNF. |
| Keywords | Choose carefully.  Make it easy for your intended user to find your preset.  Comma separate each entry. |
| Author | Your Github name or nickname. |
| Description | Clearly explain what is changed, especially if Rates, Motor protocols, Rx links or VTx tables are changed. If filter setup requires RPM filtering, be sure to state this.  Text can flow across multiple Description lines. |
| Include | Inserts data from one or more separate Presets ahead of the CLI commands of this Preset.  Useful to enforce defaults ahead of your commands. |
| Region | Commands within a region are optional.  When a region is specified, the user is presented with a checkbox to apply, or not apply, the commands within the region.  The default check-box behaviour can be specified.  Each region must have a unique name. More info [here](Region)|

### General Preset structure:

```
# Title: 7in long range cinematic by userx
# FirmwareVersion: 4.2
# FirmwareVersion: 4.3
# Category: TUNE
# Official: true
# Keywords: word1, word2, word3
# Author: Name Lastname / Pilotname
# Description: Description line1
# Description: Description line2  (as many description lines as needed)
# include: file/to/include1.txt
# include: file/to/include2.txt

<cli command 1>
<cli command 2>
....
<cli command n>

# region begin (checked) region1Name
<cli command n + 1>
<cli command n + 2>
...
<cli command m>
# region end

# region begin (unchecked) region2Name
<cli command m + 1>
<cli command m + 2>
...
<cli command k>
# region end
```

### Categories
All presets must be assigned to one category, which may be one of the following:
```
    TUNE, RATES, RC_LINK, RC_SMOOTHING, OSD, VTX, LEDS, MODES,  MIXED, BNF
```

| Category | Notes |
| ----------- | ----------- |
| TUNE | PID parameters and sub-parameters like TPA, Antigravity, Thrust Linear, etc, including Filter parameters including RPM filtering.  May include motor_output_limit, throttle curve / scale, feedforward_boost, feedforward_transition or feedforward_limit, vbat_sag_compensation, Throttle Boost, and the like.  Should not include `RC_lINK` or `RC_SMOOTHING` settings unless provided in Regions that are set to unchecked by default.  |
| RATES | Rates type and the values that affect rates (rc_rate, expo and s_rate).  Throttle curve settings, rate limits, or level expo settings are changed, they should be provided in separate presets.  A Rates name may be provided in an optional default-off Region.  TPA should *not* be included in a Rates preset, it is a `TUNE` parameter.|
| RC_LINK | The type of link (serial, PPM), the protocol used (SBus, CRSF, Spektrum etc), including telemetry settings, units, precision settings, etc, and the feedforward_averaging and feedforward_smoothing, and feedforward_jitter settings that must be configured to suit the link speed.  Separate Presets, or Regions, may be used for RC links that can be set to different speeds.|
| RC_SMOOTHING | RC smoothing settings vary how reactive the stick is to sudden stick changes.  Auto configurations can provide anything from race to cinematic levels of smoothness, but the final amount of smoothness in an auto configuration also depends on the RC link speed.  Manual rc_smoothing configurations can provide more consistent smoothing across a wider range of RC Link speeds.  
| OSD | Any collection of OSD related parameters.  May include report_cell_voltage, debug_mode or similar settings that affect what is shown on the OSD.  |
| VTX | A VTx table or related settings |
| LEDS | LED configurations |
| MODES | Mode switch and Adjustment configurations | 
| MIXED | Any Preset that includes settings from more than one category, or for settings that don't fall readily into other categories.  Examples include: a complete configuration with rates, tune, link, and LED settings; or a set of GPS, Launch Control, Camera Control or similar values.
| BNF | A complete configuration for a pre-built machine.  Regions may be used to provide alternatives options for RC_LINK, RC_SMOOTHING, or other settings. | 

### Official
True applies only to Betaflight developed Presets
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

When a CLI preset contains regions, the user will see a list of available regions with checkboxes. This list will appear in the preset dialog, and the user can apply some, all or none of them.

One example of using regions is a BNF quad Preset. The manufacturer could add different regions for different radio protocols such as SBUS, Crossfire, Ghost, etc. The user can select the radio protocol when the preset is applied.

Another example could be to provide different RC_Smoothing settings, for example, to suit fast freestyle, HD freestyle or Cinematic usage within the same overall tune.

A region starts with `# region begin <region name>` directive. It can be extended with `(checked)` or `(unchecked)` to specify whether this region should be selected by default or not.

Every region should be closed with `# region end`. Between `# region begin <region name>` and `# region end` there is a list of CLI commands included in the region.
Nested regions are not allowed yet.
Regions could be split into multiple parts although it is not recommended for readability.

Regions within an included Preset will not be shown, unless ‘dummy’ region/s have been pre-defined for each of the regions that you want to include from the included Preset, like this:
```
# region begin <first_region_name_from_preset_x>
# region end
# region begin <second_region_name_from_preset_x>
# region end
(for however many regions in preset_x that you want to include)
# include path/preset_x
```

## Credits

The Preset system was developed by @limonspb for Betaflight 4.3.

