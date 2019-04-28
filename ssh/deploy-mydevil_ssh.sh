#!/bin/bash

set -e

cd ~/domains/api.fefaq.pl/public_nodejs
echo "👉 Pulling from the server…"
git fetch origin

if git diff --quiet remotes/origin/master; then
  echo "👉 Up to date; nothing to do!"
  exit
fi

git pull origin master

echo "👉 Installing deps…"
npm i
echo "👉 Bulding…"
NODE_ENV=production ENV=production npm run build
echo `git rev-parse HEAD` > .version
echo "👉 Pruning…"
npm prune

echo "👉 Restarting the server…"
devil www restart api.fefaq.pl
curl -I api.fefaq.pl

echo "👉 Done! 😱 👍"

# function kill_ssh_agent {
#   kill -9 $SSH_AGENT_PID 2> /dev/null; SSH_AGENT_PID=""
# }

# echo "Trying to kill existing connections…"
# kill_ssh_agent

# eval $(ssh-agent -s) && ssh-add ~/.ssh/github_rsa

# kill_ssh_agent


