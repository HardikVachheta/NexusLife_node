#!/usr/bin/env bash
# exit on error
set -o errexit

echo "--- Installing dependencies ---"
npm install

echo "--- Installing Puppeteer browser ---"
npx puppeteer browsers install chrome