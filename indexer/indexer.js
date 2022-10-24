'use strict';

const fs = require("fs");
const path = require("path");
const PresetsFolder = require('./PresetsFolder');
const settings = require('./Settings');
const IndexContent = require('./IndexContent');
const crypto = require('crypto');
const errors = [];
process.exitCode = 100;

let writeIndexFile = true;

if (process.argv.length === 3) {
    if (process.argv[2] === "nosave") {
        writeIndexFile = false;
    }
}

let presetFilesArray = [];
let presetsFolder = new PresetsFolder(settings.presetsDir, settings, presetFilesArray, errors);
PresetsFolder.checkForIncludeLoops(presetFilesArray, errors);

//console.log(getUniqueValues(presetFilesArray, "firmwareVersion"));

if (0 === errors.length) {
    console.log("OK");

    if (writeIndexFile) {
        const indexContent = new IndexContent(presetFilesArray, settings);
        const jsonIndexContent = JSON.stringify(indexContent, null, 2);
        fs.writeFileSync("index.json", jsonIndexContent);
        console.log("index.json created");

        const sum = crypto.createHash('sha256');
        sum.update(jsonIndexContent);
        const indexHash = sum.digest('hex');
        fs.writeFileSync("index_hash.txt", indexHash);
        console.log("index_hash.txt created");
    }

    process.exitCode = 0;
} else {
    console.log("Failed with errors");
}
