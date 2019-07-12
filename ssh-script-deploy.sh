#!/bin/bash
source ~/.bash_profile
set -e

cd ~/domains/api.devfaq.pl/public_nodejs
echo "👉 Pulling from the server…"
git fetch origin

if git diff --quiet remotes/origin/master; then
  echo "👉 Up to date; nothing to do!"
  exit
fi

git pull origin master

echo "👉 Installing deps…"
npm i --dev
echo "👉 Bulding…"
NODE_ENV=production ENV=production npm run build
echo "👉 Running migrations…"
NODE_ENV=production ENV=production npm run prepare-db
echo `git rev-parse HEAD` > .version
echo "👉 Pruning…"
npm prune

echo "👉 Restarting the server…"
devil www restart api.devfaq.pl
curl -I https://api.devfaq.pl

echo "👉 Done! 😱 👍"
