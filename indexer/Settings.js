'use strict';

const MetadataTypes = {
        STRING:             "STRING",
        STRING_ARRAY:       "STRING_ARRAY", // strings from multiple comment lines
        PRESET_CATEGORY:    "PRESET_CATEGORY", // TUNE/RATES/OSD etc
        FILE_PATH:          "FILE_PATH", // path/to/file.ext and check if file exists
        BOOLEAN:            "BOOLEAN", // true/false
        WORDS_ARRAY:        "WORDS_ARRAY", // "word1, word2, word3"
        FILE_PATH_ARRAY:    "FILE_PATH_ARRAY", // array of path/to/file.ext and check if files exist
        PRESET_STATUS:      "PRESET_STATUS", // official/community/experimental
}

const PresetStatusEnum = ["OFFICIAL", "COMMUNITY", "EXPERIMENTAL"];

const PresetCategories = {
    TUNE:           "TUNE",
    RATES:          "RATES",
    OSD:            "OSD",
    VTX:            "VTX",
    LEDS:           "LEDS",
    MODES:          "MODES",
    RC_SMOOTHING:   "RC_SMOOTHING",
    FILTERS:        "FILTERS",
    RC_LINK:        "RC_LINK",
    BNF:            "BNF",
    OTHER:          "OTHER",
}

const OptionsDirectives = {
    OPTION_DIRECTIVE: "option",
    BEGIN_OPTION_DIRECTIVE: "option begin",
    END_OPTION_DIRECTIVE: "option end",
    OPTION_CHECKED: "(checked)",
    OPTION_UNCHECKED: "(unchecked)",
}

const settings = {
    MetapropertyDirective: "#$",

    PresetCategories: Object.freeze(PresetCategories),

    MetadataTypes: Object.freeze(MetadataTypes),

    OptionsDirectives : Object.freeze(OptionsDirectives),

    PresetStatusEnum : Object.freeze(PresetStatusEnum),

    presetsDir: "presets",
    presetsFileEncoding: "utf-8",

    presetsFileMetadata: Object.freeze({
        title:                {type: MetadataTypes.STRING,           optional: false  },
        firmware_version:     {type: MetadataTypes.STRING_ARRAY,     optional: false  },
        category:             {type: MetadataTypes.PRESET_CATEGORY,  optional: false  },
        status:               {type: MetadataTypes.PRESET_STATUS,    optional: false  },
        author:               {type: MetadataTypes.STRING,           optional: true   },
        description:          {type: MetadataTypes.STRING_ARRAY,     optional: true   },
        include:              {type: MetadataTypes.FILE_PATH_ARRAY,  optional: true   },
        keywords:             {type: MetadataTypes.WORDS_ARRAY,      optional: true   },
        hidden:               {type: MetadataTypes.BOOLEAN,          optional: true   },
        discussion:           {type: MetadataTypes.STRING,           optional: true   },
        warning:              {type: MetadataTypes.STRING,           optional: true   },
        disclaimer:           {type: MetadataTypes.STRING,           optional: true   },
        include_warning:      {type: MetadataTypes.FILE_PATH_ARRAY,  optional: true   },
        include_disclaimer:   {type: MetadataTypes.FILE_PATH_ARRAY,  optional: true   },
    }),
}

module.exports = Object.freeze(settings);
