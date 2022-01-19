"use strict";

const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const PresetsFolder = require("./PresetsFolder");
const Settings = require("./Settings");
const IndexContent = require("./IndexContent");

// where all output files will be saved to
const rootDir = path.resolve(__dirname, "..");
const outputDir = process.env.OUTPUT_DIR;

// application state
const errors = [];
const presetFilesArray = [];

function analyzePresets() {
	new PresetsFolder(rootDir, "presets", Settings, presetFilesArray, errors);
	PresetsFolder.checkForIncludeLoops(presetFilesArray, errors);
}

function runChecks() {
	// run checks
	console.log("checking for errors...");

	if (errors.length > 0) {
		console.error("failed with errors");
		return false;
	}

	console.log("checks passed");
	return true;
}

function generateOutput() {
	const indexOutput = JSON.stringify(
		new IndexContent(presetFilesArray, Settings),
		null,
		2
	);

	// generate hash of generated JSON output
	const sum = crypto.createHash("sha256");
	sum.update(indexOutput);
	const indexHash = sum.digest("hex");

	// write files to output dir
	fs.writeFileSync(path.join(outputDir, "index.json"), indexOutput);
	fs.writeFileSync(path.join(outputDir, "index_hash.txt"), indexHash);

	console.log("index files written");
}

function main() {
	const args = process.argv.splice(2, 2);

	analyzePresets();

	const result = runChecks();
	// exit if any errors were detected
	if (!result) process.exit(100);

	// generate output if dryrun flag is not set
	if (args.includes("build")) {
		generateOutput();
	}
}

main();
