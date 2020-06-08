#!/bin/bash
set -e
source ~/.bash_profile

SUBDOMAIN=$1

cd ~/domains/$SUBDOMAIN.devfaq.pl/public_nodejs

node -v
yarn -v

echo "👉 Installing deps…"
yarn install --frozen-lockfile
echo "👉 Restarting…"
devil www restart $SUBDOMAIN.devfaq.pl
echo "👉 Fetching…"
curl -I https://$SUBDOMAIN.devfaq.pl/
