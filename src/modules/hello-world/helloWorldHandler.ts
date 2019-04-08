import Hapi from 'hapi';

export const helloWorldHandler: Hapi.Lifecycle.Method = (_request, _h) => {
  return 'Hello, world!';
};
