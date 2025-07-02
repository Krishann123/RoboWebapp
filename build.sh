#!/usr/bin/env bash
# Exit on error
set -e

# 1. Build the International (Astro) frontend
echo "--- Building International App ---"
cd international
npm ci
# Set Node.js to use more memory for the build step
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
cd ..

# 2. Install dependencies for the ROBOLUTION (Express) backend
echo "--- Installing ROBOLUTION App Dependencies ---"
cd ROBOLUTION
npm ci
cd ..

echo "--- Build successful! ---" 