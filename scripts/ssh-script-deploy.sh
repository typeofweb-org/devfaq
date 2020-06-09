#!/bin/bash
set -e
source ~/.bash_profile

ENV=$1

if [[ "$ENV" == "production" ]]; then
  WWW_SUBDOMAIN="app"
  API_SUBDOMAIN="api"
  BRANCH="master"
elif [[ "$ENV" == "staging" ]]; then
  WWW_SUBDOMAIN="staging"
  API_SUBDOMAIN="staging-api"
  BRANCH="develop"
else
  echo 'Incorrect environment. "production" or "staging" allowed.'
  exit 1
fi

node -v
yarn -v

cd ~/domains/devfaq.pl/devfaq/$ENV

echo "ENV:" $ENV
echo "BRANCH:" $BRANCH
echo "WWW_SUBDOMAIN" $WWW_SUBDOMAIN
echo "API_SUBDOMAIN" $API_SUBDOMAIN
echo "Current directory:" $(pwd)

echo "👉 Pulling from the server…"
git fetch origin --tags
git checkout $BRANCH

if git diff --quiet remotes/origin/$BRANCH; then
  echo "👉 Up to date; nothing to do!"
  exit
fi

git pull origin $BRANCH

echo $ENVIRONMENT:`git rev-parse --abbrev-ref HEAD`:`git rev-parse HEAD` > .version
echo "🥁 VERSION: " `.version`
cp .version apps/api/
cp .version apps/www/

echo "👉 Installing deps…"
yarn install --frozen-lockfile

echo "👉 Bulding…"
NODE_ENV=production ENV=$ENV yarn run build

echo "👉 Running API migrations…"
NODE_ENV=production ENV=$ENV yarn workspace api db:migrate:up

echo "👉 Restarting API server…"
devil www restart $API_SUBDOMAIN.devfaq.pl
curl -I https://$API_SUBDOMAIN.devfaq.pl

echo "👉 Restarting WWW server…"
devil www restart $WWW_SUBDOMAIN.devfaq.pl
curl -I https://$WWW_SUBDOMAIN.devfaq.pl

echo "👉 Done! 😱 👍"
