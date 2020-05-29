#!/bin/bash
set -e

$SUBDOMAIN=$1

cd /home/typeofweb/domains/$SUBDOMAIN.devfaq.pl/public_nodejs

node -v
npm -v

npm ci

echo "👉 Restarting…"
devil www restart $SUBDOMAIN.devfaq.pl
echo "👉 Fetching…"
curl -I https://$SUBDOMAIN.devfaq.pl/
