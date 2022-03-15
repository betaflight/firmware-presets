'use strict';

class IndexContent
{
    constructor(presetFilesArray, settings)
    {
        this.majorVersion = 1;
        this.minorVersion = 0;
        this.settings = settings;
        this.uniqueValues = {};
        this.presets = presetFilesArray;

        this.uniqueValues.firmware_version = this._getUniqueValues(presetFilesArray, "firmware_version");
        this.uniqueValues.category = this._getUniqueValues(presetFilesArray, "category");
        this.uniqueValues.author = this._getUniqueValues(presetFilesArray, "author");
        this.uniqueValues.keywords = this._getUniqueValues(presetFilesArray, "keywords");
    }

    _getUniqueValues(presetFilesArray, property)
    {
        let result = new Set();
        let resultLowerCase = new Set();

        function addValue(value) {
            const valueLowCase = value.toLowerCase();
            if (!resultLowerCase.has(valueLowCase)) {
                result.add(value);
                resultLowerCase.add(valueLowCase);
            }
        }

        for (let preset of presetFilesArray) {
            if (property in preset) {
                if (Array.isArray(preset[property])) {
                    for (let value of preset[property]) {
                        addValue(value);
                    }
                } else {
                   addValue(preset[property]);
                }
            }
        }

        result = [...result];
        result.sort((a, b) => a.localeCompare(b, undefined, {sensitivity: 'base'}));
        return result;
    }

}

module.exports = IndexContent;