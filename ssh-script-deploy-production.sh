#!/bin/bash
set -e

cd /home/sinpai/domains/app.fefaq.pl/public_nodejs
npm i -f
echo "👉 Restarting…"
devil www restart app.fefaq.pl
echo "👉 Fetching…"
curl -I app.fefaq.pl
