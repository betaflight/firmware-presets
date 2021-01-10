'use strict';

const presetsDir = "presets";
const presetsFileEncoding = "utf-8";

const fs = require("fs");
const path = require("path");
const PresetsFolder = require('./PresetsFolder');

let presetsFolder = new PresetsFolder(presetsDir, presetsFileEncoding);

fs.writeFile("index.json", JSON.stringify(presetsFolder, null, 4), function(err) {
    if (err) {
        console.log(`ERRPR: Presets index file was not created: ${err}`);
        throw err;
    } else {
        console.log("OK: Presets index file created.");
    }
});
