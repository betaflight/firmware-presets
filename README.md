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

The Betaflight Preset system makes it easy for a user to find and apply CLI 'snippets' to configure or modify their firmware settings.

All Presets go through a checking and approval process before being made publicly available.

>WARNING: When a Preset is saved, the configuration settings are permanently changed!  Users MUST make a backup of their previous settings, and know how to restore their settings from the backup.

## Applying and using Presets

- Make a backup of your current settings (go to CLI, type `dump all`, and save that data to a safe place)`
- Go to the Preset tab in Configurator
- Search for the Preset that you want to apply, and click on it
- Read the description, and optionally review the changes that will be made by clicking `Open Online`
- Select from the available `options` using the checkboxes
- Click `Apply` - this writes the settings to the CLI
- Click `Save` to permanently write the changes to the firmware.  There is no undo function.  

If a Preset changes things that you don't want to change, make a note of those changes *before applying the preset*, and change them manually, later, in the CLI.  For example, if a complex Preset includes a Rates change that you don't want, make a note of your existing Rates, apply and save the Preset, then give it a try with the new rates.  If you don't like the new rates, manually restore your original settings.

More than one Preset can be applied, sequentially, before saving.  If the same field is changed by multiple presets, the last applied Preset takes precedence.

It is normal to need to reconnect to the Flight Controller after leaving the Presets tab.  This is because the Presets system involves interactions with the CLI, and on leaving CLI we must reconnect.

## Providing feedback to the Preset developer

Currently, the best way to provide feedback is by adding a comment to the Pull Request that generated the preset.  Use the `Discussion` button in the Apply Preset window to go to the Pull Request.

Alternatively, search the [Firmware Presets Pull Request page](https://github.com/betaflight/firmware-presets/pulls).

## Creating new presets

**Submissions for new presets** must be made with a GitHub [Firmware Preset Pull Request](https://github.com/betaflight/firmware-presets/pulls) (PR):
- A separate PR is required for each Preset.
- Every PR will be carefully assessed by Betaflight developers.
- Approval is not automatic, and may take some time.
- Since CLI names and preset values will change from version to version, it's usually best to make separate presets for 4.2 or 4.3
- The Preset must comply with the [specifications](https://github.com/betaflight/firmware-presets#preset-specifications) and must include a concise description of what will be changed

When making a Preset, the changes to be made to the existing configuration can be applied in four fundamentally different ways:  

- **Replace or force overwrite one or more values** with new values that actively achieve something, eg change a PID value, or a parameter set to a higher than default value.
- **Force some values to off, or to default**, so that regardless of the user's prior configuration, these settings will no longer be active, or will be at default values.  This requires lines in the Preset that set the parameters to off, or to their default values, or by `including` a defaults file before applying the active changes.  'Including' a defaults file before your changes can provide a 'clean slate' over which active changes are written.  It can, howeever, make more changes than are needed.  Always check that an included defaults file only makes the changes you really need, and doesn't mess with settings that a user would likely want to keep, or are irrelevant to your Preset.
- **Ignore some values**, or not change values that don't matter to your Preset, at whatever value the user the user has in their configuration, by not mentioning those parameters in the Preset.
- **Provide checkboxes** so that the user can choose between alternative or optional groups of values, eg to provide alternate filter settings to suit noisy or clean setups, or let the user choose to have Thrust Linear active on their quad.  This can be done with the `Option` directive.

A Preset should therefore overwrite any value that must be set to a specific value, disable or turn off values or settings that need to be off, and provide checkbox options (regions) to let the user choose, where appropriate, between alternative options.

**Before final submission of the PR**, check the preset by:
- installing `node.js` for your OS
- running `node indexer/check.js` in a terminal window from your draft's working directory.  The checker should return `OK`.  If not, correct the errors and try again.

Remember to include the pull request URL in the `Discussion` field.

**After approval**, the author:
- should be responsive to feedback from users via comments to the originating PR
- is responsible for maintaining compatibility with future Betaflight firmware releases

## Modifying existing presets

Presets may be modified, with or without permission of the author, by a subsequent pull request.

Any PR that modifies an existing Preset must be linked to the original PR, so that the author will receive notification of any proposed changes.

## Preset specifications

A Preset must include a field structure that complies with the specifications below, and one or more CLI 'snippets' as a payload.

### Fields

**Mandatory fields**
```
 Title, FirmwareVersion, Category, Official
```

**Optional fields**
```
    Author, Description, Include, Keywords, Discussion, Nosearch
```

| Field | Notes |
| ----------- | ----------- |
| File name | Unique, brief, descriptive, include author, underscores not spaces eg race_4in_ctzsnooze |
| Title | Explanatory, clear, concise; include the main characteristics of the preset. |
| FirmwareVersion | One line for each supported version. as many lines as requred. Ensure that all CLI commands are readable by the firmware versions listed.  CLI commands that do not match will throw errors.  If a Preset support two versions by including two versions of the same command, explain to the user that an error will be gene|
| Official | True or False; true only for Betaflight developed Presets |
| Category | See category list below.  Only approved category names will be accepted. |
| Keywords | Choose carefully.  Make it easy for your intended user to find your preset with keywords that you expect they will use.  Comma separate each entry. |
| Author | Your Github name or nickname. |
| Description | Clearly explain what will be changed, and, where relevant, what will not be changed. For example, if  filter setup requires RPM filtering, be sure to state this. Each ``# Description` line results in a separate paragraph.  A blank `# Description` line results in a blank line between paragraphs.|
| Include | Inserts data from one or more separate Presets ahead of the CLI commands of this Preset.  Useful to enforce defaults ahead of your commands. See details below.|
| Option | Commands within `Option` tags present the user with a checkbox to apply, or not apply, the enclosed commands.  The default check-box behaviour can be specified.  Each `Option` group must have a unique name. For more info, 
[click here](https://github.com/betaflight/firmware-presets#Option). |
| Discussion | Field containing a URL that links to the feedback and discussion page for the preset.  At present this must be set to the URL of the PR that generated the Preset. |
| Nosearch | `# Nosearch: true` prevents a Preset from being indexed, and hence prevents it being found by a user search.  Intended for 'invisible' Presets that are only included in other Presets. |

### Example Preset structure:

```
# Title: 7in long range cinematic by userx
# FirmwareVersion: 4.2
# FirmwareVersion: 4.3
# Category: TUNE
# Official: true
# Keywords: word1, word2, word3
# Author: Name Lastname / Pilotname
# Description: Description paragraph1
# Description: Description pagagraph2  (as many description paragraphs as needed)
# Discussion: https://github.com/betaflight/firmware-presets/pull/nn

# include: file/to/include1.txt
# include: file/to/include2.txt

<cli command 1>
<cli command 2>
....
<cli command n>

# option begin (checked) region1Name
<cli command n + 1>
<cli command n + 2>
...
<cli command m>
# option end

# option begin (unchecked) region2Name
<cli command m + 1>
<cli command m + 2>
...
<cli command k>
# option end
```

### Categories

All presets must be assigned one of the following categories:
```
    TUNE, RATES, FILTERS, RC_LINK, RC_SMOOTHING, OSD, VTX, LEDS, MODES, OTHER, BNF
```

| Category | Notes |
| ----------- | ----------- |
| TUNE | PID parameters and sub-parameters like TPA, Antigravity, Thrust Linear, etc, including Filter parameters including RPM filtering.  May include motor_output_limit, throttle curve / scale, feedforward_boost, feedforward_transition or feedforward_limit, vbat_sag_compensation, Throttle Boost, and the like.  Should not include `RC_lINK` or `RC_SMOOTHING` settings unless provided in Regions that are set to unchecked by default. |
| RATES | Rates type and the values that affect rates (rc_rate, expo and s_rate).  Throttle curve settings, rate limits, or level expo settings are changed, they should be provided in separate presets.  A Rates name may be provided in an optional default-off Region.  TPA should *not* be included in a Rates preset, it is a `TUNE` parameter.|
| FILTERS | Filter settings optimised to suit a particular type of build.  Since filter optimisation depends greatly on whether or not RPM filtering is active, we must state the RPM filtering requirement be active in the name and in the description.  A region may be provided with alternate settings for the situation where RPM filtering is not available. |
| RC_LINK | The type of link (serial, PPM), the protocol used (SBus, CRSF, Spektrum etc), including telemetry settings, units, precision settings, etc, and the feedforward_averaging and feedforward_smoothing, and feedforward_jitter settings that must be configured to suit the link speed.  Separate Presets, or Regions, may be used for RC links that can be set to different speeds.|
| RC_SMOOTHING | RC smoothing settings vary how reactive the stick is to sudden stick changes.  Auto configurations can provide anything from race to cinematic levels of smoothness, but the final amount of smoothness in an auto configuration also depends on the RC link speed.  Manual rc_smoothing configurations can provide more consistent smoothing across a wider range of RC Link speeds.  
| OSD | Any collection of OSD related parameters.  May include report_cell_voltage, debug_mode or similar settings that affect what is shown on the OSD.  |
| VTX | A VTx table or related settings |
| LEDS | LED configurations |
| MODES | Mode switch and Adjustment configurations | 
| OTHER | Any Preset that includes settings from more than one category, or for settings that don't fall readily into other categories.  Examples include: a complete configuration with rates, tune, link, and LED settings; or a set of GPS, Launch Control, Camera Control or similar values.
| BNF | A complete configuration for a pre-built machine.  Regions may be used to provide alternatives options for RC_LINK, RC_SMOOTHING, or other settings. | 


### Include
Optional paths to other Presets that are to be included in the current Preset. 

- Works like the C/C++ `#include` function.
- Sequential `include` statements allow multiple Presets to be applied.. 
- recursion of `include` is not supported. 
- Metaproperties of `include` Presets are ignored.


### Option
`option` tags give the user control over some parts of a Preset with simple checkboxes.

The Preset author can decide if the checkbox should be checked or unchecked, by default, and defines the label next to the checkbox.

`option` tags organise a set of CLI commands into a named group, and work similar to the C# preprocessor directive `#region`.

The user will see a list of checkboxes in the 'Apply' dialog, and can apply some, all or none of the CLI content, according to which options are checked.

One example of using options is a BNF or TUNE Preset. The Preset could provide different options for different supported radio protocols such as SBUS, Crossfire, Ghost, etc. The user could select the radio protocol to be used when the preset is applied.

Another example could be to provide different RC_Smoothing settings, for example, to configure some settings to specifically suit fast freestyle, HD freestyle or Cinematic usage within the same overall tune.

An `option` region starts with a `# option begin <option name>` tag. The default state of the checkbox is set by including either `(checked)` or `(unchecked)` in the tag. Every `# option` tag must be closed with `# option end`. The CLI payload goes in the middle.

Complete `option` syntax looks like this:
```
# option begin (unchecked) <option name>
CLI payload strings
# option end
```

Note 1: nested `Option` tags are not supported.

Note 2: If an included Preset has options, those options will not be shown to the user, unless ‘dummy’ option tags have been supplied, pre-defined, for each of the regions from the included Preset, like this:
```
# option begin <first_option_name_from_preset_x>
# option end
# option begin <second_region_name_from_preset_x>
# option end
(for however many options exist in preset_x that you want to provide)
# include path/preset_x
```

## Credits

The Preset system was developed by @limonspb for Betaflight 4.3.

