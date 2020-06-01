#!/bin/bash
set -e

DIR=`dirname $0`


if [[ "$1" == "production" ]]; then
  SUBDOMAIN="app"
  BRANCH="master"
# elif [[ "$1" == "staging" ]]; then
#   SUBDOMAIN="staging"
else
  echo 'Incorrect environment. "production" allowed.'
  exit 1
fi

ENVIRONMENT=$1

echo $ENVIRONMENT:`git rev-parse --abbrev-ref HEAD`:`git rev-parse HEAD` > .version
echo "🥁 VERSION: " `cat .version`

echo SUBDOMAIN=$SUBDOMAIN
echo BRANCH=$BRANCH
echo ENVIRONMENT=$ENVIRONMENT
node -v
npm -v

echo "👉 Installing…"
npm ci
echo "👉 Building…"
NODE_ENV=production ENV=$ENVIRONMENT npm run build
echo "👉 Uploading…"
rsync -avP -e ssh --exclude=node_modules --exclude=".git" --include="**/.*" ./ typeofweb@s18.mydevil.net:/home/typeofweb/domains/$SUBDOMAIN.devfaq.pl/public_nodejs/
echo "👉 Installing…"
ssh typeofweb@s18.mydevil.net 'bash -s' < $DIR/ssh-script-deploy.sh $SUBDOMAIN
echo "👉 Done! 😎"
