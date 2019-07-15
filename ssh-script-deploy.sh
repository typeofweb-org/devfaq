#!/bin/bash
set -e

cd /home/typeofweb/domains/$SUBDOMAIN.devfaq.pl/public_nodejs
mv out public
npm i -f
echo "👉 Restarting…"
devil www restart $SUBDOMAIN.devfaq.pl
echo "👉 Fetching…"
curl -I https://$SUBDOMAIN.devfaq.pl/
