'use strict';

const readline = require('readline');
const fs = require("fs");
const crypto = require('crypto');

class PresetsFile
{
    constructor(fullPath, settings, errors)
    {
        this.fullPath = fullPath;
        this.hash = "";
        this._presetsFileMetadata = settings.presetsFileMetadata;
        this._errors = errors;
        this._settings = settings;

        const binaryFileContent = fs.readFileSync(this.fullPath);
        let sum = crypto.createHash('sha256');
        sum.update(binaryFileContent);
        this.hash = sum.digest('hex');

        this._processLines(binaryFileContent, settings.presetsFileEncoding);
        this._checkProperties();

        delete this._presetsFileMetadata;
        delete this._errors;
        delete this._settings;
    }

    _checkProperties()
    {
        for (const [property, value] of Object.entries(this._presetsFileMetadata)) {
            if (!value.optional) {
                if (this._isEmptyProperty(this[property]))
                {
                    this._addError(`missing or empty property '${property}'`);
                }
            }
        }
    }

    _isEmptyProperty(property)
    {
        return (property === undefined || property.length === 0);
    }

    _processLines(binaryFileContent, presetsFileEncoding)
    {
        const fileContent = binaryFileContent.toString(presetsFileEncoding);
        const lines = fileContent.split('\n');

        this._currentLine = 1;

        for (let line of lines) {
            line = line.trim();
            if (line.startsWith("#")) {
                this._processCommentLine(line);
            }

            this._currentLine++;
        }

        delete this._currentLine;
    }

    _processCommentLine(line)
    {
        line = line.slice(1).trim(); // (# Title: foo) -> (Title: foo)
        const lowCaseLine = line.toLowerCase();

        for (const [property, value] of Object.entries(this._presetsFileMetadata)) {
            const lineBeginning = `${property.toLowerCase()}:`; // "Title:"

            if (lowCaseLine.startsWith(lineBeginning)) {
                line = line.slice(lineBeginning.length).trim(); // (Title: foo) -> (foo)
                this._processProperty(property, line);
            }
        }
    }

    _processProperty(property, line)
    {
        switch(this._presetsFileMetadata[property].type) {
            case this._settings.MetadataTypes.STRING_ARRAY:
                this._processArrayProperty(property, line);
                break;
            case this._settings.MetadataTypes.STRING:
                this._processStringProperty(property, line);
                break;
            case this._settings.MetadataTypes.PRESET_CATEGORY:
                this._processPresetCategoryProperty(property, line);
                break;
            case this._settings.MetadataTypes.FILE_PATH:
                this._processFilePathProperty(property, line);
                break;
            case this._settings.MetadataTypes.FILE_PATH_ARRAY:
                this._processFilePathArrayProperty(property, line);
                break;
            case this._settings.MetadataTypes.BOOLEAN:
                this._processBooleanProperty(property, line);
                break;
            case this._settings.MetadataTypes.WORDS_ARRAY:
                this._processWordsArrayProperty(property, line);
                break;
            default:
                this._addError(`line ${this._currentLine}, unknown property type '${this._presetsFileMetadata[property].type}' for the property '${property}'`);
        }
    }

    _processWordsArrayProperty(property, line)
    {
        this._checkPropertyDublicated(property);

        let words = line.split(",");
        words = words.map(word => word.trim());
        words = words.filter(word => word);
        this[property] = words;
    }


    _processBooleanProperty(property, line)
    {
        this._checkPropertyDublicated(property);

        const trueValues = ["true", "yes"];
        const falseValues = ["false", "no"];

        const lineLowCase = line.toLowerCase();

        let result = false;

        if (trueValues.includes(lineLowCase)) {
            result = true;
        } else if (falseValues.includes(lineLowCase)) {
            result = false;
        } else {
            this._addError(`line ${this._currentLine}, boolean property '${property}'' has a wrong value: '${line}'`);
        }

        this[property] = result;
    }

    _checkPropertyDublicated(property)
    {
        if (undefined !== this[property]) {
            this._addError(`line ${this._currentLine}, duplicated property '${property}'`);
        }
    }

    _processFilePathProperty(property, line)
    {
        this._checkPropertyDublicated(property);
        const stat = fs.statSync(line);
        if (!stat || stat.isDirectory()) {
            this._addError(`line ${this._currentLine}, can't find file '${line}'`);
        } else {
            this[property] = line;
        }
    }

    _processFilePathArrayProperty(property, line)
    {
        if (!this[property]) {
            this[property] = [];
        }

        const stat = fs.statSync(line);
        if (!stat || stat.isDirectory()) {
            this._addError(`line ${this._currentLine}, can't find file '${line}'`);
        } else {
            this[property].push(line);
        }
    }

    _processPresetCategoryProperty(property, line)
    {
        this._checkPropertyDublicated(property);
        line = line.toLowerCase();
        let presetTypeValid = false;

        for (const [key, value] of Object.entries(this._settings.PresetCategories)) {
            if (key.toLowerCase() === line) {
                presetTypeValid = true;
                this[property] = key;
            }
        }

        if (!presetTypeValid) {
            this._addError(`line ${this._currentLine}, unknown preset category: '${line}'`);
        }
    }

    _processArrayProperty(property, line)
    {
        if (!this[property]) {
            this[property] = [];
        }

        this[property].push(line);
    }

    _processStringProperty(property, line)
    {
        this._checkPropertyDublicated(property);
        this[property] = line;
    }

    _addError(error)
    {
        const fullError = `${this.fullPath}: ${error}`;
        this._errors.push(fullError);
        console.error(fullError);
    }
}

module.exports = PresetsFile;
