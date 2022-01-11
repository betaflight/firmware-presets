'use strict';

const child = require('child_process').fork('indexer/indexer.js', ["nosave"]);
child.on('exit', (code) => {
    process.exitCode = code;
});
