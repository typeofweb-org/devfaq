// @ts-ignore
const env: ProcessENV = 'undefined' !== typeof window ? (window.__ENV__ as object) : process.env;

const defaultEnv: ProcessENV = {
  API_URL: 'https://api.localhost',
  VERSION: 'dev',
  GA_TRACKING_ID: '',
  ABSOLUTE_URL: '',
  SENTRY_DSN: '',
  NODE_ENV: 'development',
  ENV: 'development',
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
  return {
    API_URL: process.env.API_URL,
    VERSION: process.env.VERSION,
    GA_TRACKING_ID: process.env.GA_TRACKING_ID,
    ABSOLUTE_URL: process.env.ABSOLUTE_URL,
    SENTRY_DSN: process.env.SENTRY_DSN,
    NODE_ENV: process.env.NODE_ENV,
    ENV: process.env.ENV,
  };
};

// tslint:disable-next-line:variable-name
export const unsafe_getEnvScriptForDocument = () => {
  const env = getEnvObjForDocument();
  return { __html: '__ENV__ = ' + require('htmlescape')(env) };
};
