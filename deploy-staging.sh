#!/bin/bash
set -e

DIR=`dirname $0`


echo "👉 Building…"
NODE_ENV=staging npm run build
echo "👉 Cleaning"
ssh sinpai@s18.mydevil.net 'bash -s' < $DIR/ssh-script-clean-staging.sh
echo "👉 Uploading…"
rsync -avP -e ssh --exclude=node_modules --exclude=".git" --include="**/.*" ./ sinpai@s18.mydevil.net:/home/sinpai/domains/staging.fefaq.pl/public_nodejs/
echo "👉 Installing…"
ssh sinpai@s18.mydevil.net 'bash -s' < $DIR/ssh-script-deploy-staging.sh
echo "👉 Done! 😎"
