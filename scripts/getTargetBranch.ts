// tslint:disable: no-implicit-dependencies
import Fs from 'fs';
import Path from 'path';

import Octokit from '@octokit/rest';

export async function getTargetBranch() {
  const {
    CIRCLE_PROJECT_REPONAME,
    CIRCLE_PROJECT_USERNAME,
    GITHUB_ACCESS_TOKEN,
    CIRCLE_PULL_REQUEST,
  } = process.env;
  console.log({ CIRCLE_PROJECT_REPONAME, CIRCLE_PROJECT_USERNAME, CIRCLE_PULL_REQUEST });

  if (!CIRCLE_PROJECT_REPONAME) {
    throw new Error(`CIRCLE_PROJECT_REPONAME is missing!`);
  }
  if (!CIRCLE_PROJECT_USERNAME) {
    throw new Error(`CIRCLE_PROJECT_USERNAME is missing!`);
  }
  if (!GITHUB_ACCESS_TOKEN) {
    throw new Error(`GITHUB_ACCESS_TOKEN is missing!`);
  }
  if (!CIRCLE_PULL_REQUEST) {
    throw new Error(`CIRCLE_PULL_REQUEST is missing!`);
  }

  const options: Octokit.Octokit.Options = {
    auth: `token ${GITHUB_ACCESS_TOKEN}`,
  };
  const octokit = new Octokit.Octokit(options);

  const prNumber = Number(CIRCLE_PULL_REQUEST.split('/').pop());

  const pulls = await octokit.pulls.get({
    owner: CIRCLE_PROJECT_USERNAME,
    repo: CIRCLE_PROJECT_REPONAME,
    pull_number: prNumber,
  });

  return pulls.data.head.ref;
}

getTargetBranch()
  .then((name) => {
    return Fs.writeFileSync(Path.join(__dirname, '.headbranch'), name, 'utf8');
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
