#!/bin/bash
source ~/.bash_profile
set -e

cd /home/sinpai/domains/$SUBDOMAIN.fefaq.pl/public_nodejs
echo "👉 Cleaning"
rm -rf .next
rm -rf public
