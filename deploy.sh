#!/bin/bash

# Exit on error, unset var, or failed pipe
set -euo pipefail

# Cloudways Deployment Script
echo "Starting deployment..."

# Install dependencies
echo "Installing dependencies..."
npm ci --production=false

# Build the project with explicit base path for root deployment
echo "Building project..."
npm run build -- --base=/

# Verify build output exists
if [ ! -d "dist" ]; then
  echo "❌ Build failed: dist directory not found" >&2
  exit 1
fi

# Verify index.html exists
if [ ! -f "dist/index.html" ]; then
  echo "❌ Build verification failed: index.html not found" >&2
  exit 1
fi

# Log built assets for debugging
echo "Built assets:"
ls -lah dist/

# Ensure web root exists and is clean
mkdir -p public_html
echo "Cleaning web root..."
rm -rf public_html/*

# Copy built files to public_html (Cloudways web root)
echo "Copying files to web root..."
cp -r dist/* public_html/

# Ensure Apache rules are present for SPA routing and headers
if [ -f ".htaccess" ]; then
  cp .htaccess public_html/
fi

# Clean up
echo "Cleaning up..."
rm -rf node_modules

echo "Deployment complete!"