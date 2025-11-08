#!/bin/bash
set -euo pipefail

echo "[Cloudways] Post-deploy: installing deps and building"

if ! command -v npm >/dev/null 2>&1; then
  echo "❌ Error: npm is not available on this server. Please enable Node.js for this application."
  exit 1
fi

export NODE_ENV=production

echo "Installing dependencies..."
npm ci --prefer-offline --no-audit

echo "Building Vite app..."
# Force root base for production
npm run build -- --base=/

# Verify build output exists
if [ ! -d "dist" ] || [ ! -f "dist/index.html" ]; then
  echo "❌ Build failed: dist/index.html not found"
  exit 1
fi

echo "Publishing to web root..."
mkdir -p public_html
rm -rf public_html/*
cp -r dist/* public_html/

# Ensure Apache rules are present for SPA routing and headers
if [ -f ".htaccess" ]; then
  cp .htaccess public_html/
fi

# Create deploy metadata to verify freshness in browser
GIT_COMMIT=$(git rev-parse --short HEAD 2>/dev/null || echo "no-git")
BUILD_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
{
  echo "commit: $GIT_COMMIT"
  echo "built_at: $BUILD_TIME"
  echo "node: $(node -v)"
  echo "npm: $(npm -v)"
} > public_html/deploy-info.txt

cat > public_html/version.json <<EOF
{
  "commit": "$GIT_COMMIT",
  "builtAt": "$BUILD_TIME"
}
EOF

# Set safe permissions
find public_html -type d -exec chmod 755 {} \;
find public_html -type f -exec chmod 644 {} \;

# Log built assets for debugging
echo "Deployed files:"
ls -lah public_html/ | sed -n '1,200p'

echo "✅ Cloudways post-deploy hook completed."