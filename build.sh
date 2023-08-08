#!/bin/bash

cp configs/config-dist.json html/scale/src/config/config.json
cd html/scale
pwd
npm install
npm run build
cd ../../
pwd


cp configs/config-dist.json html/token/src/config/config.json
cd html/token
pwd
npm install
npm run build
cd ../../
pwd


rm -rf build
mkdir -p build/scale
mv html/scale/build/* build/scale/
mkdir -p build/token
mv html/token/build/* build/token/


