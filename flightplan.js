const plan = require('flightplan');
const pkg = require('./package.json');

plan.target('staging', {
  host: 's18.mydevil.net',
  username: 'sinpai',
  agent: process.env.SSH_AUTH_SOCK,
});

plan.remote(remote => {
  remote.log('Pulling from the server…');

  remote.with('cd ~/domains/sinpai.usermd.net/public_nodejs', () => {
    remote.with('eval "$(ssh-agent -s)" && ssh-add ~/.ssh/github_rsa', () => {
      remote.exec('git pull origin master');
    });

    remote.log('Installing deps…');
    remote.exec('npm i');
    remote.exec('npm prune');

    remote.log('Restarting the server…');
    remote.exec('devil www restart sinpai.usermd.net');
    remote.exec('curl -I sinpai.usermd.net');
  });

  remote.log('Done! 😱 👍');
});
