#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd $(dirname "${BASH_SOURCE[0]}") && pwd)"
export PRESETS_DIR="${SCRIPT_DIR}/../presets"

node "${SCRIPT_DIR}/indexer/index.js"
