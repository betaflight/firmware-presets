'use strict';

const fs = require("fs");
const path = require("path");
const PresetsFolder = require('./PresetsFolder');
const settings = require('./Settings');
const IndexContent = require('./IndexContent');
const crypto = require('crypto');
const errors = [];
process.exitCode = 100;

let presetFilesArray = [];
let presetsFolder = new PresetsFolder(settings.presetsDir, settings, presetFilesArray, errors);

//console.log(getUniqueValues(presetFilesArray, "firmwareVersion"));

if (0 === errors.length)
{
    const indexContent = new IndexContent(presetFilesArray, settings);
    const jsonIndexContent = JSON.stringify(indexContent, null, 2);
    fs.writeFileSync("index.json", jsonIndexContent);
    console.log("OK: index.json created");

    const sum = crypto.createHash('sha256');
    sum.update(jsonIndexContent);
    const indexHash = sum.digest('hex');
    fs.writeFileSync("index_hash.txt", indexHash);
    console.log("OK: index_hash.txt created");

    process.exitCode = 0;
}
