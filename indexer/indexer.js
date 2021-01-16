'use strict';

const presetsDir = "presets";
const presetsFileEncoding = "utf-8";

const presetsFileMetadata = {
    title:             {value: "", optional: false  },
    firmwareVersion:   {value: "", optional: true },
    author:            {value: "", optional: true },
    description:       {value: [], optional: true },
}

const fs = require("fs");
const path = require("path");
const PresetsFolder = require('./PresetsFolder');
const errors = [];
process.exitCode = 100;


let presetsFolder = new PresetsFolder(presetsDir, presetsFileEncoding, presetsFileMetadata, errors);

if (0 === errors.length)
{
    fs.writeFile("index.json", JSON.stringify(presetsFolder, null, 4), function(err) {
        if (err) {
            console.error(`ERRPR: Presets index file was not created: ${err}`);
            throw err;
        } else {
            process.exitCode = 0;
            console.log("OK: Presets index file created.");
        }
    });
}
