#!/bin/bash

# Cloudways Deployment Script
echo "Starting deployment..."

# Install dependencies
echo "Installing dependencies..."
npm ci --production=false

# Build the project
echo "Building project..."
npm run build

# Create deployment directory if it doesn't exist
mkdir -p public_html

# Copy built files to public_html (Cloudways web root)
echo "Copying files to web root..."
cp -r dist/* public_html/

# Clean up
echo "Cleaning up..."
rm -rf node_modules

echo "Deployment complete!"