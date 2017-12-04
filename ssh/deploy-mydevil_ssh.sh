#!/bin/bash

function kill_ssh_agent {
  kill -9 $SSH_AGENT_PID 2> /dev/null; SSH_AGENT_PID=""
}

echo "Trying to kill existing connections…"
kill_ssh_agent

cd ~/domains/sinpai.usermd.net/public_nodejs

eval $(ssh-agent -s) && ssh-add ~/.ssh/github_rsa

echo "Pulling from the server…"
git fetch origin

if git diff --quiet remotes/origin/master; then
  kill_ssh_agent
  echo "Up to date; nothing to do!"
  exit
fi

git pull origin master

echo "Installing deps…"
npm i
npm prune

echo "Restarting the server…"
devil www restart sinpai.usermd.net
curl -I sinpai.usermd.net

kill_ssh_agent

echo "Done! 😱 👍"
