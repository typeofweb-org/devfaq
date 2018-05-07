// @ts-ignore
const env: ProcessENV = 'undefined' !== typeof window ? (window['__ENV__'] as object) : process.env;
export default env;

export type ProcessENV = ReturnType<typeof getEnvObjForDocument>;

const getEnvObjForDocument = () => {
  const { API_URL = 'https://api.localhost', VERSION = 'dev' } = process.env;
  const env = { API_URL, VERSION };
  return env;
};

export const unsafe_getEnvScriptForDocument = () => {
  const env = getEnvObjForDocument();
  return { __html: '__ENV__ = ' + require('htmlescape')(env) };
};
