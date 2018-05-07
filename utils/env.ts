// @ts-ignore
const env: ProcessENV = 'undefined' !== typeof window ? (window['__ENV__'] as object) : process.env;

const defaultEnv: ProcessENV = {
  API_URL: 'https://api.localhost',
  VERSION: 'dev',
};

// set default env
for (const key of Object.keys(defaultEnv) as (keyof ProcessENV)[]) {
  if (env[key] == null) {
    env[key] = defaultEnv[key];
  }
}

export default env;

export type ProcessENV = { [K in keyof ReturnType<typeof getEnvObjForDocument>]: string };

const getEnvObjForDocument = () => {
  const { API_URL, VERSION } = process.env;
  return { API_URL, VERSION };
};

export const unsafe_getEnvScriptForDocument = () => {
  const env = getEnvObjForDocument();
  return { __html: '__ENV__ = ' + require('htmlescape')(env) };
};
