const readline = require('readline');
const fs = require("fs");
const crypto = require('crypto');

class PresetsFile
{
    constructor(fullPath, presetsFileEncoding, presetsFileMetadata, errors)
    {
        this.fullPath = fullPath;
        this.hash = "";
        this._presetsFileMetadata = presetsFileMetadata;
        this._errors = errors;

        const binaryFileContent = fs.readFileSync(this.fullPath);
        let sum = crypto.createHash('sha512');
        sum.update(binaryFileContent);
        this.hash = sum.digest('hex');

        this._processLines(binaryFileContent, presetsFileEncoding);
        this._checkProperties();

        delete this._presetsFileMetadata;
        delete this._errors;
    }

    _checkProperties()
    {
        for (const [property, value] of Object.entries(this._presetsFileMetadata)) {
            if (!value.optional) {
                if (this._isEmptyProperty(this[property]))
                {
                    this._addError(`missing or empty ${property}`);
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
        if (Array.isArray(this._presetsFileMetadata[property].value)) {
            this._processArrayProperty(property, line);
        } else {
            this._processNonArrayProperty(property, line);
        }
    }

    _processArrayProperty(property, line)
    {
        if (!this[property]) {
            this[property] = [];
        }

        this[property].push(line);
    }

    _processNonArrayProperty(property, line)
    {
        if (undefined === this[property]) {
            this[property] = line;
        } else {
            this._addError(`line ${this._currentLine}, duplicated property ${property}`);
        }
    }

    _addError(error)
    {
        const fullError = `${this.fullPath}: ${error}`;
        this._errors.push(fullError);
        console.error(fullError);
    }
}

module.exports = PresetsFile;
