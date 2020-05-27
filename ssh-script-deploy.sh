#!/bin/bash
set -e
source ~/.bash_profile

if [[ "$1" == "production" ]]; then
  SUBDOMAIN="api"
  BRANCH="master"
elif [[ "$1" == "staging" ]]; then
  SUBDOMAIN="staging-api"
  BRANCH="develop"
else
  echo 'Incorrect environment. "production" or "staging" allowed.'
  exit 1
fi

node -v
npm -v

cd ~/domains/$SUBDOMAIN.devfaq.pl/public_nodejs
echo "👉 Pulling from the server…"
git fetch origin --tags

if git diff --quiet remotes/origin/$BRANCH; then
  echo "👉 Up to date; nothing to do!"
  exit
fi

git pull origin $BRANCH

echo "👉 Installing deps…"
npm ci
echo "👉 Bulding…"
NODE_ENV=production ENV=$1 npm run build
echo "👉 Running migrations…"
NODE_ENV=production ENV=$1 npm run prepare-db
echo `git rev-parse HEAD` > .version

echo "👉 Restarting the server…"
devil www restart $SUBDOMAIN.devfaq.pl
curl -I https://$SUBDOMAIN.devfaq.pl

echo "👉 Done! 😱 👍"
