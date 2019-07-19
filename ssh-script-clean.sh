#!/bin/bash
source ~/.bash_profile
set -e

cd /home/typeofweb/domains/$SUBDOMAIN.devfaq.pl/public_nodejs
echo "👉 Cleaning"
rm -rf .next
rm -rf public
rm -rf out
