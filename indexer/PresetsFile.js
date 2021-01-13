const readline = require('readline');
const fs = require("fs");
const crypto = require('crypto');

class PresetsFile
{
    constructor(fullPath, presetsFileEncoding)
    {
        this.fullPath = fullPath;
        this.title = "";
        this.version = "";
        this.description = [];
        this.hash = "";

        this._remainingHeaders = ["title", "version"];

        const binaryFileContent = fs.readFileSync(this.fullPath);
        let sum = crypto.createHash('sha512');
        sum.update(binaryFileContent);
        this.hash = sum.digest('hex');

        const fileContent = binaryFileContent.toString(presetsFileEncoding);
        const lines = fileContent.split('\n');

        for (let line of lines) {
            line = line.trim();
            if (line.startsWith("#")) {
                this._processHeaderLine(line);
            } else {
                break;
            }
        }

        delete this._remainingHeaders;
    }

    _processHeaderLine(line)
    {
        line = line.slice(1).trim();

        if (this._remainingHeaders.length > 0) {
            this[this._remainingHeaders[0]] = line;
            this._remainingHeaders = this._remainingHeaders.slice(1);
        } else {
            this.description.push(line);
        }
    }
}

module.exports = PresetsFile;
