#!/usr/bin/env bash

set -e

basepath="${PWD}"
artifacts="${basepath}/public/firmware-presets"

echo "Artifacts: ${artifacts}"
echo "Branch:    ${GITHUB_REF}"
echo "Build:     ${GITHUB_RUN_NUMBER}"

node --version
node indexer/check.js

if [ "${1}" == "deploy" ]; then

  if [ -d ${artifacts} ]; then
    rm -R ${artifacts}
  fi

  mkdir -p ${artifacts}
  mkdir -p ${artifacts}/presets
  mkdir -p ${artifacts}/misc

  echo "Running indexer"
  node indexer/indexer.js

  echo "Copying files to staging location: ${artifacts}"
  cp ./index.json $artifacts
  cp ./index_hash.txt $artifacts 
  cp -r ./presets/* $artifacts/presets
  if [ -d ./misc ]; then
    cp -r ./misc/* $artifacts/misc
  fi
fi
