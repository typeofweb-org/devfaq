#!/bin/bash
set -e

cd /home/sinpai/domains/$SUBDOMAIN.devfaq.pl/public_nodejs
npm i -f
echo "👉 Restarting…"
devil www restart $SUBDOMAIN.devfaq.pl
echo "👉 Fetching…"
curl -I https://$SUBDOMAIN.devfaq.pl/
