'use strict';

class IndexContent

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
