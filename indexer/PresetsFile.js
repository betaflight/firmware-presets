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
        this.options = [];
        this._currentOption = undefined;

        const binaryFileContent = fs.readFileSync(this.fullPath);
        let sum = crypto.createHash('sha256');
        sum.update(binaryFileContent);
        this.hash = sum.digest('hex');

        this._processLines(binaryFileContent, settings.presetsFileEncoding);
        this._checkProperties();

        delete this._presetsFileMetadata;
        delete this._errors;
        delete this._settings;
        delete this._currentOption;
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

        if (undefined !== this._currentOption) {
            this._addError(`line ${this._currentLine}, missing ${this._settings.OptionsDirectives.END_OPTION_DIRECTIVE} for ${this._currentOption.name}`);
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
            if (line.startsWith(this._settings.MetapropertyDirective)) {
                this._processMetapropertyLine(line);
            }

            this._currentLine++;
        }

        delete this._currentLine;
    }

    _processMetapropertyLine(line)
    {
        line = line.slice(this._settings.MetapropertyDirective.length).trim(); // (#$ Title: foo) -> (Title: foo)
        const lowCaseLine = line.toLowerCase();
        let isProperty = false;
        let isPropertyMissingSemicolon = false;
        let isOptionDirective = false;

        for (const [property, value] of Object.entries(this._presetsFileMetadata)) {
            const lineBeginning = `${property.toLowerCase()}:`; // "TITLE:"
            const wrongLineBeginning = `${property.toLowerCase()}`; // "TITLE"

            if (lowCaseLine.startsWith(lineBeginning)) {
                line = line.slice(lineBeginning.length).trim(); // (Title: foo) -> (foo)
                this._processProperty(property, line);
                isProperty = true;
            } else if (lowCaseLine.startsWith(wrongLineBeginning)) {
                isPropertyMissingSemicolon = true;
            }
        }

        if (!isProperty && lowCaseLine.startsWith(this._settings.OptionsDirectives.OPTION_DIRECTIVE)) {
            this._processOptionDirective(line);
            isOptionDirective = true;
        }

        if (!isProperty && !isOptionDirective) {
            if (isPropertyMissingSemicolon) {
                this._addError(`line ${this._currentLine}, property missing ":"`);
            } else {
                this._addError(`line ${this._currentLine}, unknown preset directive: '${line}'`);
            }
        }
    }

    _processOptionDirective(line)
    {
        const lowCaseLine = line.toLowerCase();

        if (lowCaseLine.startsWith(this._settings.OptionsDirectives.BEGIN_OPTION_DIRECTIVE)) {
            const Option = this._getOption(line);
            const lowCaseOptionName = Option.name.toLowerCase();

            if ("" === Option.name) {
                this._addError(`line ${this._currentLine}, empty Option name`);
            } else if (undefined !== this._currentOption) {
                this._addError(`line ${this._currentLine}, nested #options are not allowed`);
            } else {
                this._currentOption = Option;
            }

        } else if (lowCaseLine.startsWith(this._settings.OptionsDirectives.END_OPTION_DIRECTIVE)) {
            if (undefined === this._currentOption) {
                this._addError(`line ${this._currentLine}, end Option directive found but no Option to close`);
            } else {
                const lowCaseOptionName = this._currentOption.name.toLowerCase();

                const indexOfOption = this.options.findIndex(item => lowCaseOptionName === item.name.toLowerCase());

                if (-1 === indexOfOption) {
                    this.options.push(this._currentOption);
                }

                this._currentOption = undefined;
            }

        }
    }

    _escapeRegex(string) {
        return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    _getOption(line)
    {
        const directiveRemoved = line.slice(this._settings.OptionsDirectives.BEGIN_OPTION_DIRECTIVE.length).trim();
        const directiveRemovedLowCase = directiveRemoved.toLowerCase();
        const OptionChecked = this._isOptionChecked(directiveRemovedLowCase);

        const regExpRemoveChecked = new RegExp(this._escapeRegex(this._settings.OptionsDirectives.OPTION_CHECKED), 'gi');
        const regExpRemoveUnchecked = new RegExp(this._escapeRegex(this._settings.OptionsDirectives.OPTION_UNCHECKED), 'gi');
        let optionName = directiveRemoved.replace(regExpRemoveChecked, "");
        optionName = optionName.replace(regExpRemoveUnchecked, "").trim();
        if (0 == optionName.length || optionName[0] != ":") {
                this._addError(`line ${this._currentLine}, OPTION BEGIN directive should be followed by ":". Example: #$ OPTION BEGIN (UNCHECKED): My Option Name`);
        }

        let Option = {
            name: optionName.slice(1).trim(),
            checked: OptionChecked
        }

        return Option;
    }

    _isOptionChecked(lowCaseLine)
    {
        let OptionChecked = false;
        let OptionUnchecked = false;

        if (lowCaseLine.includes(this._settings.OptionsDirectives.OPTION_CHECKED)) {
            OptionChecked = true;
        }
        if (lowCaseLine.includes(this._settings.OptionsDirectives.OPTION_UNCHECKED)) {
            OptionUnchecked = true;
        }

        if (OptionChecked && OptionUnchecked) {
            this._addError(`line ${this._currentLine}, Option can't be checked and unchecked at the same time`);
        } else if (!OptionChecked && !OptionUnchecked) {
            this._addError(`line ${this._currentLine}, Every option must specify whether it is ${this._settings.OptionsDirectives.OPTION_CHECKED.toUpperCase()} or ${this._settings.OptionsDirectives.OPTION_UNCHECKED.toUpperCase()}`);
        } else {
            OptionChecked = OptionChecked;
        }

        return OptionChecked;
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
            case this._settings.MetadataTypes.PRESET_STATUS:
                this._processPresetStatusProperty(property, line);
                break;
            default:
                this._addError(`line ${this._currentLine}, unknown property type '${this._presetsFileMetadata[property].type}' for the property '${property}'`);
        }
    }

    _processPresetStatusProperty(property, line)
    {
        this._checkPropertyDublicated(property);

        if (this._settings.PresetStatusEnum.includes(line)) {
            this[property] = line;
        } else {
            this._addError(`line ${this._currentLine}, unknown ${property} values: '${line}'; available values: ${this._settings.PresetStatusEnum}`);
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

        if (fs.existsSync(line)) {
             // still could be a folder, so have to filter out folders
            const stat = fs.statSync(line);
            if (!stat || stat.isDirectory()) {
                this._addError(`line ${this._currentLine}, a folder is specified instead of a file: '${line}'`);
            } else {
                this[property].push(line);
            }
        } else {
            this._addError(`line ${this._currentLine}, can't find file '${line}'`);
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
