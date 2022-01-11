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

    static checkForIncludeLoops(presetFilesArray, errors)
    {
        const filesDb = PresetsFolder._createFilesDictionary(presetFilesArray);
        const fileNameErrors = {};

        presetFilesArray.forEach((file) => {
            const parents = [];
            PresetsFolder._checkFileForIncludeLoops(file, filesDb, parents, fileNameErrors);
        });

        for (const fileNameError in fileNameErrors) {
            const errorText = `File ${fileNameError}, takes part in the #$ INCLUDE loop'`;
            errors.push(errorText);
            console.error(errorText);
        }
    }

    static _checkFileForIncludeLoops(file, filesDb, parents, fileNameErrors)
    {
        if (parents.includes(file.fullPath)) {
            fileNameErrors[file.fullPath] = true;
        } else {
            parents.push(file.fullPath);
            if (file.hasOwnProperty("include")) {
                file.include.forEach((includedFileName) => {
                    const clonedParents = [...parents];
                    PresetsFolder._checkFileForIncludeLoops(filesDb[includedFileName], filesDb, clonedParents, fileNameErrors);
                });
            }
        }
    }

    static _createFilesDictionary(presetFilesArray)
    {
        let result = {};

        presetFilesArray.forEach((file) => {
            result[file.fullPath] = file;
        });

        return result;
    }
}

module.exports = PresetsFolder;
