#!/usr/bin/env bash
set -e

SCRIPT_DIR=$(cd $(dirname "${BASH_SOURCE[0]}") && pwd)
export OUTPUT_DIR="${SCRIPT_DIR}/../output"
export PRESETS_DIR="${SCRIPT_DIR}/../presets"

# this is where all final outputs will be saved/copied to
mkdir -p "${OUTPUT_DIR}"

# this will generate the index files directly into $OUTPUT_DIR
node "${SCRIPT_DIR}/../indexer/index.js" build

# copy the presets and misc directories
cp -r "${SCRIPT_DIR}/../presets" "${OUTPUT_DIR}/presets"
if [ -d "${SCRIPT_DIR}/../misc" ]; then
  cp -r "${SCRIPT_DIR}/../misc" "${OUTPUT_DIR}/misc"
fi
