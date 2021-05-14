'use strict';

const fs = require("fs");
const path = require("path");
const PresetsFile = require('./PresetsFile');

class PresetsFolder
{
    constructor(fullPath, settings, presetFilesArray, errors)
    {
        this.subFolders = [];
        this.files = [];
        this.fullPath = fullPath;
        this.name = "";

        let list = fs.readdirSync(fullPath);

        list.forEach((fileName) => {
            const fullFileName = fullPath + '/' + fileName;
            const stat = fs.statSync(fullFileName);
            if (!fileName.startsWith(".")) {
                if (stat && stat.isDirectory()) {
                    let subdir = new PresetsFolder(fullFileName, settings, presetFilesArray, errors);
                    subdir.name = fileName;
                    this.subFolders.push(subdir);
                } else if (fileName.toLowerCase().endsWith(".txt")) {
                    let presetsFile = new PresetsFile(fullFileName, settings, errors);
                    presetFilesArray.push(presetsFile);
                    this.files.push(presetsFile);
                }
            }
        });
    }
}

module.exports = PresetsFolder;
