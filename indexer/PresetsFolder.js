'use strict';

const fs = require("fs");
const path = require("path");
const PresetsFile = require('./PresetsFile');

class PresetsFolder
{
    constructor(fullPath, presetsFileEncoding, presetsFileMetadata, errors)
    {
        this.subFolders = [];
        this.files = [];
        this.fullPath = fullPath;
        this.name = "";

        let list = fs.readdirSync(fullPath);

        list.forEach((fileName) => {
            let fullFileName = fullPath + '/' + fileName;
            let stat = fs.statSync(fullFileName);
            if (stat && stat.isDirectory()) {
                let subdir = new PresetsFolder(fullFileName, presetsFileEncoding, presetsFileMetadata, errors);
                subdir.name = fileName;
                this.subFolders.push(subdir);
            } else {
                let presetsFile = new PresetsFile(fullFileName, presetsFileEncoding, presetsFileMetadata, errors);
                this.files.push(presetsFile);
            }
        });
    }
}

module.exports = PresetsFolder;
