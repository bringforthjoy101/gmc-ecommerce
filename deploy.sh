#!/usr/bin/env bash
# deploy.sh — Build React, bundle into Express, push to GitHub/Azure
set -e
echo "── Step 1: Install client deps"
cd client && npm install

echo "── Step 2: Build React"
npm run build

echo "── Step 3: Copy build → server/public"
cd ..
rm -rf server/public
cp -r client/build server/public
echo "   ✅ server/public updated"

echo "── Step 4: Install server deps"
cd server && npm install && cd ..

echo "── Step 5: Commit & push"
git add -A
git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M')" || echo "Nothing to commit"
git push

echo "✅ Deploy complete"
