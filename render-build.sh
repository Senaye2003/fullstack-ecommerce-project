#!/usr/bin/env bash
# Render build script — runs at the repo root on every deploy.
# 1. Build the Vite frontend
# 2. Drop the built output into ecommerce-backend/dist/ where server.js
#    serves it from (the Express catch-all returns dist/index.html).
# 3. Install backend deps (patch-package runs via postinstall).

set -euxo pipefail

# Frontend build
pushd ecommerce-project
  npm install
  npm run build
popd

# Move the build artifact to where Express expects it
rm -rf ecommerce-backend/dist
cp -r ecommerce-project/dist ecommerce-backend/dist

# Backend deps
pushd ecommerce-backend
  npm install
popd
