#!/bin/bash
set -e

cd /home/sinpai/domains/$SUBDOMAIN.fefaq.pl/public_nodejs
npm i -f
echo "👉 Restarting…"
devil www restart $SUBDOMAIN.fefaq.pl
echo "👉 Fetching…"
curl -I https://$SUBDOMAIN.fefaq.pl/
