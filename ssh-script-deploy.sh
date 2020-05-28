#!/bin/bash
set -e
source ~/.bash_profile

if [[ "$1" == "production" ]]; then
  SUBDOMAIN="app"
  BRANCH="master"
# elif [[ "$1" == "staging" ]]; then
#   SUBDOMAIN="staging"
#   BRANCH="develop"
else
  echo 'Incorrect environment. "production" allowed.'
  exit 1
fi

node -v
npm -v

cd ~/domains/$SUBDOMAIN.devfaq.pl/public_nodejs
echo "👉 Pulling from the server…"
git fetch origin --tags

git checkout $BRANCH

if git diff --quiet remotes/origin/$BRANCH; then
  echo "👉 Up to date; nothing to do!"
  exit
fi

git pull origin $BRANCH

echo $1:`git rev-parse --abbrev-ref HEAD`:`git rev-parse HEAD` > .version
echo "🥁 VERSION: " `cat .version`

echo "👉 Installing deps…"
npm ci
echo "👉 Building…"
NODE_ENV=production ENV=$1 npm run build

echo "👉 Restarting the server…"
devil www restart $SUBDOMAIN.devfaq.pl
curl -I https://$SUBDOMAIN.devfaq.pl

echo "👉 Done! 😱 👍"
