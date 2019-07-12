#!/bin/bash
set -e

DIR=`dirname $0`


if [[ "$1" == "production" ]]; then
  SUBDOMAIN="app"
elif [[ "$1" == "staging" ]]; then
  SUBDOMAIN="staging"
else
  echo 'Incorrect environment. "production" or "staging" allowed.'
  exit 1
fi

ENVIRONMENT=$1

echo $ENVIRONMENT:`git rev-parse --abbrev-ref HEAD`:`git rev-parse HEAD` > .version
echo "🥁 VERSION: " `cat .version`

echo "👉 Building…"
NODE_ENV=$ENVIRONMENT npm run build
echo "👉 Cleaning"
ssh typeofweb@s18.mydevil.net SUBDOMAIN=$SUBDOMAIN 'bash -s' < $DIR/ssh-script-clean.sh
echo "👉 Uploading…"
rsync -avP -e ssh --exclude=node_modules --exclude=".git" --include="**/.*" ./ typeofweb@s18.mydevil.net:/home/sinpai/domains/$SUBDOMAIN.devfaq.pl/public_nodejs/
echo "👉 Installing…"
ssh typeofweb@s18.mydevil.net SUBDOMAIN=$SUBDOMAIN 'bash -s' < $DIR/ssh-script-deploy.sh
echo "👉 Done! 😎"
