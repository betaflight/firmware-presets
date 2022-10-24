#!/usr/bin/env bash

set -e

basepath="${PWD}"
artifacts="${basepath}/public"

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

  echo "Deploying to AWS S3: ${AWS_REGION}/${AWS_BUCKET}"
  aws configure set preview.cloudfront true
  aws s3 sync ${artifacts} s3://${AWS_BUCKET}/firmware-presets --delete --region "${AWS_REGION}" --cache-control max-age=345600
  aws cloudfront create-invalidation --distribution-id ${AWS_DISTRIBUTION_ID} --path "/firmware-presets/*"
fi
