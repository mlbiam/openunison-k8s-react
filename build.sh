#!/bin/bash

cp configs/config-dist.json html/scale/src/config/config.json
cd html/scale
pwd
npm install
npm run build
cd ../../
pwd

rm -rf build
mkdir -p build/scale
mv html/scale/build/* build/scale/