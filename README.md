# Firmware Presets

A simple way to configure your Betaflight Flight Controller Firmware settings.

- [Introduction](#introduction)
- [Applying and using Presets](#applying-and-using-presets)
- [Providing feedback](#providing-feedback)
- [Custom sources](#custom-sources)
- [Creating new presets](#creating-new-presets)
- [Tips for preset authors](#tips-for-authors)
- [Modifying existing presets](#modifying-existing-presets)
- [Preset specifications](#preset-specifications)
- [Credits](#credits)

## Introduction

The Betaflight Preset system makes it easy for a user to find and apply CLI 'snippets' to configure or modify their firmware settings.

All Presets go through a checking and approval process before being made publicly available.

>WARNING: When a Preset is saved, the configuration settings are permanently changed!  Users MUST make a backup of their previous settings, and know how to restore their settings from the backup.

## Applying and using Presets

- Make a backup of your current settings (go to CLI, type `dump all`, and save that data to a safe place)`
- Go to the Preset tab in Configurator
- Search for the Preset that you want to apply, and click on it
- Read the description, and optionally review the changes that will be made by clicking `Open Online`
- Select from the available `Options` using the checkboxes
- Click `Apply` - this writes the settings to the CLI
- Click `Save` to permanently write the changes to the firmware.  There is no undo function.  

If a Preset changes things that you don't want to change, make a note of those changes *before applying the preset*, and change them manually, later, in the CLI.  For example, if a complex Preset includes a Rates change that you don't want, make a note of your existing Rates, apply and save the Preset, then give it a try with the new rates.  If you don't like the new rates, manually restore your original settings.

More than one Preset can be applied, sequentially, before saving.  If the same field is changed by multiple presets, the last applied Preset takes precedence.

It is normal to need to reconnect to the Flight Controller after leaving the Presets tab.  This is because the Presets system involves interactions with the CLI, and on leaving CLI we must reconnect.

## Providing feedback to the Preset developer

Currently, the best way to provide feedback is by adding a comment to the Pull Request that generated the preset.  Use the `Discussion` button in the Apply Preset window to go to the Pull Request.

Alternatively, search the [Firmware Presets Pull Request page](https://github.com/betaflight/firmware-presets/pulls).

## Custom sources

Developers and tuners can add a link in Configurator to their own Preset repository.  This allows developers to test their Presets locally before submitting PRs, allows tuners or board suppliers to develop and share custom Presets, and allows individuals to keep an online backup of their personal presets.

Steps are:
- clone the Presets repository to your GitHub account
- make a separate branch from Master and create your own Presets there
- run `node indexer/indexer.js` and `node indexer/check.js`
- push your branch to Github

To use a custom Preset source:
- in Configurator, go to Presets > Preset Sources
- set the URL field to `https://github.com/sourceGithubAccountName/firmware-presets/``
- set the Github branch field to the branch name you pushed

Any end-user can then apply your custom presets.

Unless you rebase to master to ensure that this branch is up to date with Betaflight, any existing Presets may become out of date.  

You may choose to remove all the other Presets, leaving only those you have made, and you may replace or remove the directory structure.  You must re-build the index file and push it to Github after file or directory changes.  

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

A Preset should therefore overwrite any value that must be set to a specific value, disable or turn off values or settings that need to be off, and provide checkboxes to let the user choose, where appropriate, alternative settings.

**Before final submission of the PR**, check the preset by:
- installing `node.js` for your OS
- running `node indexer/check.js` in a terminal window from your draft's working directory.  The checker should return `OK`.  If not, correct the errors and try again.

Remember to include the pull request URL in the `Discussion` field.

**After approval**, the author:
- should be responsive to feedback from users via comments to the originating PR
- is responsible for maintaining compatibility with future Betaflight firmware releases

## Tips for authors

If you want to add your presets to the **official Betaflight Presets Repo**, and thinking to open your first Pull Request (PR), please consider the following tips and common mistakes:
1. Do **not** include index files updates in the PR. You can run check.js locally or run indexer in a separate branch, or just don't `git add` it to the commit.
2. Split the separate presets into separate PRs. Especially if your presets are not connected with each other.
3. Don't create multiple PRs if you are just starting, start with just one PR. Check it time-to-time if there are any corrections suggested, wait for it to be merged and then proceed with the next presets you wanted to add.
4. Make sure `#$ DESCRIPTION` explains nicely what the preset is doing. You can even include pictures of modes/osd if you use `#$ PARSER: MARKED`. User must know what he is getting.
5. Always self-check your PR in the GitHub web-view. Do it **every** time when you make a new PR, or if you update it. Respect the review team. If you don't check the web-view of your PR upon updates, why would they check. The main thing to check in the web view: Files changed tab.
6. Don't forget about `#$ DISCUSSION: link/to/your/pr`
7. If you messed up your PR and would like to start from scratch, do **not** close your existing PR. You can alwas start from scratch without closing your PR. Just save your preset somewhere locally on your PC, then remove your local branch and create a branch with the same name. When you done adding your preset to the branch just force-push it to the `origin`. Your PR is connected with your branch name.
8. Use indentation for the code inside `#$ OPTION` and `#$ OPTION_GROUP`. 4 spaces for each level of nesting (see examples below).

And remember - a new preset file needs a new PR. Modification for the existing preset also requires a new PR.

## Modifying existing presets

Presets may be modified, with or without permission of the author, by a subsequent pull request.

Any PR that modifies an existing Preset must be linked to the original PR, so that the author will receive notification of any proposed changes.

## Preset specifications

A Preset must include a field structure that complies with the specifications below, and one or more CLI 'snippets' as a payload.

### Fields

**Mandatory fields**
```
 TITLE, FIRMWARE_VERSION, CATEGORY, STATUS
```

**Optional fields**
```
    KEYWORDS, AUTHOR, DESCRIPTION, INCLUDE, OPTION, FORCE_OPTIONS_REVIEW, OPTION_GROUP BEGIN, DISCUSSION, DISCLAIMER, INCLUDE_DISCLAIMER, WARNING, INCLUDE_WARNING, HIDDEN
```
All field tags must be:
- preceded with `#$ `, 
- be `CAPITALISED`, and 
- end with a colon `:` (except `OPTION END` tags, no colon there)
- eg `#$ KEYWORDS:`

| Field | Notes |
| ----------- | ----------- |
| File name | Unique, brief, descriptive, include author, underscores not spaces eg race_4in_ctzsnooze |
| TITLE | Explanatory, clear, concise; include the main characteristics of the preset. |
| FIRMWARE_VERSION | One line for each supported version. as many lines as requred. Ensure that all CLI commands are readable by the firmware versions listed.  CLI commands that do not match will throw errors.  If a Preset support two versions by including two versions of the same command, explain to the user that an error will be gene|
| CATEGORY | See category list below.  Only approved category names will be accepted. |
| STATUS | `OFFICIAL` for Betaflight developed Presets, `COMMUNITY` for user-contributed Presets, or `EXPERIMENTAL` for 'in-development' Presets |
| KEYWORDS | Choose carefully.  Make it easy for your intended user to find your preset with keywords that you expect they will use.  Comma separate each entry. |
| AUTHOR | Your Github name or nickname. |
| DESCRIPTION| Clearly explain what will be changed, and, where relevant, what will not be changed. For example, if  filter setup requires RPM filtering, be sure to state this. Each ``#$ DESCRIPTION:` line results in a separate paragraph.  A blank `#$ DESCRIPTION:` line results in a blank line between paragraphs. All description text should be placed above any includes or options. |
| FORCE_OPTIONS_REVIEW | Opens a dialog advising the user to review the options if they have not done so before applying the Preset.|
| INCLUDE | Inserts data from one or more separate Presets ahead of the CLI commands of this Preset.  Useful to enforce defaults ahead of your commands. See details below.|
| OPTION | Commands within `OPTION` tags present the user with a checkbox to apply, or not apply, the enclosed commands.  The default check-box behaviour can be specified.  Each `OPTION` must have a unique name. For more info, [click here](https://github.com/betaflight/firmware-presets#OPTION). |
| OPTION_GROUP | Text to appear before a group of Options. The group can be made mutually exclusive by prepending the (Exclusive) directive to the name of the group |
| DISCLAIMER | Field containing text for a disclaimer. |
| INCLUDE_DISCLAIMER | path to file containing text for a disclaimer, starting from `presets/`` |
| WARNING | Field containing text for a warning. Intended to be a final dialog before accepting the Preset |
| INCLUDE_WARNING | path to file containing text for a warning, starting from `presets/`, functionally the same as warning. |
| DISCUSSION | Field containing a URL that links to the feedback and discussion page for the preset.  At present this must be set to the URL of the PR that generated the Preset. |
| HIDDEN | `#$ HIDDEN: true` prevents a Preset from being indexed, and hence prevents it being found by a user search.  Intended for 'invisible' Presets that are only included in other Presets. |

### Example Preset structure:

```
#$ TITLE: 7in long range cinematic by userx
#$ FIRMWARE_VERSION: 4.2
#$ FIRMWARE_VERSION: 4.3
#$ CATEGORY: TUNE
#$ STATUS: EXPERIMENTAL
#$ KEYWORDS: word1, word2, word3
#$ AUTHOR: Name Lastname / Pilotname
#$ DESCRIPTION: Description paragraph1
#$ DESCRIPTION: Description pagagraph2  (as many description paragraphs as needed)
#$ DISCLAIMER: Text of disclaimer (mandatory for VTx Presets)
#$ WARNING: Text of warning
#$ DISCUSSION: https://github.com/betaflight/firmware-presets/pull/nn
#$ FORCE_OPTIONS_REVIEW

#$ INCLUDE: presets/4.3/rates/defaults.txt

<cli command 1>
<cli command 2>
....
<cli command n>

#$ OPTION BEGIN (CHECKED): Region 1 name
    <cli command n + 1>
    <cli command n + 2>
    ...
    <cli command m>
#$ OPTION END

#$ OPTION_GROUP BEGIN: This group name
    #$ OPTION BEGIN (UNCHECKED): Region 2 name
        <cli command m + 1>
        <cli command m + 2>
    #$ OPTION END
    #$ OPTION BEGIN (UNCHECKED): Region 3 name
        <cli command j + 1>
        <cli command j + 2>
        <cli command j + 3>
    #$ OPTION END
#$ OPTION_GROUP END
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
| RC_LINK | The type of link (serial, PPM), the protocol used (SBus, CRSF, Spektrum etc), including telemetry settings, units, precision settings, etc, and the feedforward_averaging and feedforward_smooth_factor, and feedforward_jitter settings that must be configured to suit the link speed.  Separate Presets, or Regions, may be used for RC links that can be set to different speeds.|
| RC_SMOOTHING | RC smoothing settings vary how reactive the stick is to sudden stick changes.  Auto configurations can provide anything from race to cinematic levels of smoothness, but the final amount of smoothness in an auto configuration also depends on the RC link speed.  Manual rc_smoothing configurations can provide more consistent smoothing across a wider range of RC Link speeds.  
| OSD | Any collection of OSD related parameters.  May include report_cell_voltage, debug_mode or similar settings that affect what is shown on the OSD.  |
| VTX | A VTx table or related settings.  The disclaimer below at note 1 must be included.|
| LEDS | LED configurations |
| MODES | Mode switch and Adjustment configurations | 
| OTHER | Any Preset that includes settings from more than one category, or for settings that don't fall readily into other categories.  Examples include: a complete configuration with rates, tune, link, and LED settings; or a set of GPS, Launch Control, Camera Control or similar values.
| BNF | A complete configuration for a pre-built machine.  Regions may be used to provide alternatives options for RC_LINK, RC_SMOOTHING, or other settings. | 

Note 1: The following disclaimer is MANDATORY for VTx presets:
> The information provided in these presets is for educational and entertainment purposes only. Betaflight makes no representations as to the safety or legality of the use of any information provided herein. End users assume all responsibility and liability for ensuring they comply with all relevant laws and regulations.
>Using these VTX tables may be in breach of your local RF laws. You as the end user must research and comply with your local regulations. In using these presets, the user assumes any and all liability associated with breaching local regulations.

### Setting a motor protocol
Preset authors are allowed to set motor protocol inside of these preset categoris: TUNE, FILTERS, OTHER, BNF even outside of the `#$ OPTIONS`.

`set motor_pwm_protocol = .....`

**However, a proper `#$ WARNING:` or `#$ INCLUDE_WARNING:` must be set in this case for safety.** Users and authors must understand that setting, for example, DSHOT with the ESCs that don't support DSHOT is dangerous and can spin up the motors right away without arming.

Note: None of the default.txt files are resetting the motor protocol.

### INCLUDE
Optional paths to other Presets that are to be included in the current Preset.

The path must be the full path from the root of the Presets directory.

- Works like the C/C++ `#include` function.
- Sequential `INCLUDE` statements allow multiple Presets to be applied.. 
- Recursion of `INCLUDE` is supported. 
- Metaproperties of `INCLUDE` Presets are ignored.

Example:  `#$ INCLUDE: presets/4.3/category/preset_x.txt`

### OPTION
`OPTION` tags let the user apply groups of settings with simple checkboxes from a dropdown list in the Apply dialog.  Each `OPTION` fills one line in the dropdown list.  No text or blank lines are possible in the `OPTION` list.

The Preset author sets the checkbox default to be ticked or un-ticked, and specifies the label next to the checkbox.

If the author wants to warn the user to review the options, they can make a dialog appear saying, "Please review the list of options" by including this line in the header:
```
#$ FORCE_OPTIONS_REVIEW: TRUE
````

Options work similar to the C# preprocessor directive `#region`.

One example where `OPTION` may be useful is in a `BNF` or `TUNE` Preset. The Preset could provide different options for different radio protocols, eg SBUS, Crossfire, Ghost, etc. The user can then select the radio protocol to be used when the preset is applied.

Another example could be to provide different RC_Smoothing settings, to suit race, HD freestyle or Cinematic usage within the same overall tune.

Another example is where a user may want to retain a personal setting, eg motor output limit, when applying a TUNE that might also like to set that value to some specific value.  Here the tuner can give an option to use their value, but allow the user to not accept that suggestion.

An `OPTION` region starts with an `#$ OPTION BEGIN: <option name>` tag, and must end with an `#$ OPTION END` tag.  The payload of CLI lines is put in-between these tags.  The `option name` appears with a checkbox to the left, and when selected, loads the CLI lines.

The default state of the checkbox may be set to either `(CHECKED)` or `(UNCHECKED)` by default.  CLI values that are not reset to defaults earlier in the preset must be `UNCHECHKED`.

Options can be 'grouped' under a 'title' or 'group name' using this syntax:

```
#$ OPTION_GROUP BEGIN: your group name
    <options>
#$ OPTION_GROUP END
````

Complete `OPTION` example syntax looks like this:
```
#$ OPTION_GROUP BEGIN: this group name
    #$ OPTION BEGIN (UNCHECKED): <Option1 name>
        CLI payload strings
    #$ OPTION END
    #$ OPTION BEGIN (UNCHECKED): <Option2 name>
        CLI payload strings
    #$ OPTION END
#$ OPTION_GROUP END
```

You can also make a set of options mutually exclusive, i.e. only one option can be checked within the group at once.
```
#$ OPTION_GROUP BEGIN: (Exclusive) A Mutually Exclusive set of options
    #$ OPTION BEGIN (UNCHECKED): Option the first
        CLI payload strings
    #$ OPTION END
    #$ OPTION BEGIN (UNCHECKED): Other option that might conflict with the first
        CLI payload strings
    #$ OPTION END
#$ OPTION_GROUP END
```

Note 1: nested `OPTION` tags are not supported.

Note 2: If an included Preset has options, those options will not be shown to the user, unless ‘dummy’ option tags have been supplied, pre-defined, for each of the regions from the included Preset, like this:
```
#$ OPTION BEGIN: <first_option_name_from_preset_x>
#$ OPTION END
#$ OPTION BEGIN: <second_region_name_from_preset_x>
#$ OPTION END
(for however many options exist in preset_x that you want to provide)
#$ INCLUDE: presets/4.3/category/preset_x.txt
```

## Credits

The Preset system was developed by @limonspb for Betaflight 4.3.

