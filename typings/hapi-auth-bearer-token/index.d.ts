declare module 'hapi-auth-bearer-token' {
  import { Plugin } from 'hapi';

  namespace hapiAuthBearer {
    export interface Options {}
  }

  const hapiAuthBearer: Plugin<hapiAuthBearer.Options>;

  export = hapiAuthBearer;
}
