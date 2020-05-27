// @ts-ignore
const env: ProcessENV = 'undefined' !== typeof window ? (window.__ENV__ as object) : process.env;

const defaultEnv: ProcessENV = {
  API_URL: 'https://api.localhost',
  VERSION: 'dev',
  GA_TRACKING_ID: '',
  ABSOLUTE_URL: process.env.VERCEL_URL || '',
  SENTRY_DSN: '',
  NODE_ENV: 'development',
  ENV: '',
};

// set default env
for (const key of Object.keys(defaultEnv) as Array<keyof ProcessENV>) {
  if (env[key] == null) {
    env[key] = defaultEnv[key];
  }
}

export default env;

export type ProcessENV = { [K in keyof ReturnType<typeof getEnvObjForDocument>]: string };

const getEnvObjForDocument = () => {
  const { API_URL, VERSION, GA_TRACKING_ID, ABSOLUTE_URL, SENTRY_DSN, NODE_ENV, ENV } = process.env;
  return { API_URL, VERSION, GA_TRACKING_ID, ABSOLUTE_URL, SENTRY_DSN, NODE_ENV, ENV };
};

// tslint:disable-next-line:variable-name
export const unsafe_getEnvScriptForDocument = () => {
  const env = getEnvObjForDocument();
  return { __html: '__ENV__ = ' + require('htmlescape')(env) };
};
