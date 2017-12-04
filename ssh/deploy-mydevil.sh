#!/bin/bash
DIR=`dirname $0`
ssh sinpai@s18.mydevil.net 'bash -s' < $DIR/deploy-mydevil_ssh.sh
