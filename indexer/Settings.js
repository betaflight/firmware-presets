'use strict';

const MetadataTypes = {
        STRING:             "STRING",
        STRING_ARRAY:       "STRING_ARRAY", // strings from multiple comment lines
        PRESET_CATEGORY:    "PRESET_CATEGORY", // TUNE/RATES/OSD etc
        FILE_PATH:          "FILE_PATH", // path/to/file.ext and check if file exists
        BOOLEAN:            "BOOLEAN", // true/false
        WORDS_ARRAY:        "WORDS_ARRAY", // "word1, word2, word3"
}

const PresetCategories = {
    TUNE:           "TUNE",
    RATES:          "RATES",
    OSD:            "OSD",
    VTX:            "VTX",
    LEDS:           "LEDS",
    MODES:          "MODES",
    BNF:            "BNF",
    RC_SMOOTHING:   "RC_SMOOTHING",
    MIXED:          "MIXED",
}

const settings = {
    PresetCategories: Object.freeze(PresetCategories),

    MetadataTypes: Object.freeze(MetadataTypes),

    presetsDir: "presets",
    presetsFileEncoding: "utf-8",

    presetsFileMetadata: Object.freeze({
        title:             {type: MetadataTypes.STRING,           optional: false  },
        firmwareVersion:   {type: MetadataTypes.STRING_ARRAY,     optional: false  },
        category:          {type: MetadataTypes.PRESET_CATEGORY,  optional: false  },
        official:          {type: MetadataTypes.BOOLEAN,          optional: false  },
        author:            {type: MetadataTypes.STRING,           optional: true   },
        description:       {type: MetadataTypes.STRING_ARRAY,     optional: true   },
        defaults:          {type: MetadataTypes.FILE_PATH,        optional: true   },
        keywords:          {type: MetadataTypes.WORDS_ARRAY,      optional: true   },
    }),
}

module.exports = Object.freeze(settings);
