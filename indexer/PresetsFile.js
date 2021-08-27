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
        this.regions = [];
        this._currentRegion = undefined;

        const binaryFileContent = fs.readFileSync(this.fullPath);
        let sum = crypto.createHash('sha256');
        sum.update(binaryFileContent);
        this.hash = sum.digest('hex');

        this._processLines(binaryFileContent, settings.presetsFileEncoding);
        this._checkProperties();

        delete this._presetsFileMetadata;
        delete this._errors;
        delete this._settings;
        delete this._currentRegion;
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

        if (undefined !== this._currentRegion) {
            this._addError(`line ${this._currentLine}, missing ${this._settings.RegionDirectives.END_REGION_DIRECTIVE} for ${this._currentRegion.name}`);
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
        let isProperty = false;

        for (const [property, value] of Object.entries(this._presetsFileMetadata)) {
            const lineBeginning = `${property.toLowerCase()}:`; // "Title:"

            if (lowCaseLine.startsWith(lineBeginning)) {
                line = line.slice(lineBeginning.length).trim(); // (Title: foo) -> (foo)
                this._processProperty(property, line);
                isProperty = true;
            }
        }

        if (!isProperty && lowCaseLine.startsWith(this._settings.RegionDirectives.REGION_DIRECTIVE)) {
            this._processRegionDirective(line);
        }
    }

    _processRegionDirective(line)
    {
        const lowCaseLine = line.toLowerCase();

        if (lowCaseLine.startsWith(this._settings.RegionDirectives.BEGIN_REGION_DIRECTIVE)) {
            const region = this._getRegion(line);
            const lowCaseRegionName = region.name.toLowerCase();

            if ("" === region.name) {
                this._addError(`line ${this._currentLine}, empty region name`);
            } else if (undefined !== this._currentRegion) {
                this._addError(`line ${this._currentLine}, nested regions are not allowed`);
            } else {
                this._currentRegion = region;
            }

        } else if (lowCaseLine.startsWith(this._settings.RegionDirectives.END_REGION_DIRECTIVE)) {
            if (undefined === this._currentRegion) {
                this._addError(`line ${this._currentLine}, end region directive found but no region to close`);
            } else {
                const lowCaseRegionName = this._currentRegion.name.toLowerCase();

                const indexOfRegion = this.regions.findIndex(item => lowCaseRegionName === item.name.toLowerCase());

                if (-1 === indexOfRegion) {
                    this.regions.push(this._currentRegion);
                }

                this._currentRegion = undefined;
            }

        }
    }

    _escapeRegex(string) {
        return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    _getRegion(line)
    {
        const directiveRemoved = line.slice(this._settings.RegionDirectives.BEGIN_REGION_DIRECTIVE.length).trim();
        const directiveRemovedLowCase = directiveRemoved.toLowerCase();
        const regionChecked = this._isRegionChecked(directiveRemovedLowCase);

        const regExpRemoveChecked = new RegExp(this._escapeRegex(this._settings.RegionDirectives.REGION_CHECKED), 'gi');
        const regExpRemoveUnchecked = new RegExp(this._escapeRegex(this._settings.RegionDirectives.REGION_UNCHECKED), 'gi');
        let regionName = directiveRemoved.replace(regExpRemoveChecked, "");
        regionName = regionName.replace(regExpRemoveUnchecked, "").trim();

        let region = {
            name: regionName,
            checked: regionChecked
        }

        return region;
    }

    _isRegionChecked(lowCaseLine)
    {
        let regionChecked = false;
        let regionUnchecked = false;

        if (lowCaseLine.includes(this._settings.RegionDirectives.REGION_CHECKED)) {
            regionChecked = true;
        }
        if (lowCaseLine.includes(this._settings.RegionDirectives.REGION_UNCHECKED)) {
            regionUnchecked = true;
        }

        if (regionChecked && regionUnchecked) {
            this._addError(`line ${this._currentLine}, region can't be checked and unchecked at the same time`);
        } else {
            regionChecked = regionChecked || !regionUnchecked;
        }

        return regionChecked;
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
