// tslint:disable: no-implicit-dependencies
import Octokit from '@octokit/rest';
import Fs from 'fs';
import Path from 'path';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function run() {
  const {
    CIRCLE_PROJECT_REPONAME,
    CIRCLE_SHA1,
    CIRCLE_PROJECT_USERNAME,
    GITHUB_ACCESS_TOKEN,
  } = process.env;
  console.log({ CIRCLE_PROJECT_REPONAME, CIRCLE_SHA1, CIRCLE_PROJECT_USERNAME });

  if (!CIRCLE_PROJECT_REPONAME) {
    throw new Error(`CIRCLE_PROJECT_REPONAME is missing!`);
  }
  if (!CIRCLE_SHA1) {
    throw new Error(`CIRCLE_SHA1 is missing!`);
  }
  if (!CIRCLE_PROJECT_USERNAME) {
    throw new Error(`CIRCLE_PROJECT_USERNAME is missing!`);
  }

  if (!GITHUB_ACCESS_TOKEN) {
    throw new Error(`GITHUB_ACCESS_TOKEN is missing!`);
  }

  const options: Octokit.Octokit.Options = {
    auth: `token ${GITHUB_ACCESS_TOKEN}`,
  };
  const octokit = new Octokit.Octokit(options);

  const deploymentsForThisPR = await octokit.repos.listDeployments({
    owner: CIRCLE_PROJECT_USERNAME,
    repo: CIRCLE_PROJECT_REPONAME,
    sha: CIRCLE_SHA1,
  });
  const deployment = deploymentsForThisPR.data?.[0];
  console.log({ deployment });

  for (let i = 0; ; ++i) {
    try {
      const statuses = await octokit.repos.listDeploymentStatuses({
        owner: CIRCLE_PROJECT_USERNAME,
        repo: CIRCLE_PROJECT_REPONAME,
        deployment_id: deployment.id,
      });
      const status = statuses.data?.[0];
      console.log({ status });

      if (!status) {
        throw Error('No statuses found!');
      } else if (status.state !== 'success') {
        throw new Error(`Deployment not ready yet!`);
      }
      return status.target_url;
    } catch (err) {
      if (i < 3) {
        console.warn(err);
        await wait(30000); // 30s
        continue;
      } else {
        throw err;
      }
    }
  }
}

run()
  .then((url) => {
    return Fs.writeFileSync(Path.join(__dirname, '../.deployment-url'), url, 'utf8');
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
