#!/bin/bash
set -e

DIR=`dirname $0`
ssh typeofweb@s18.mydevil.net 'bash -s' < $DIR/ssh-script-deploy.sh
