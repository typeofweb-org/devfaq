declare module 'hapi-auth-bearer-token' {
  import { Plugin } from 'typesafe-hapi';

  namespace hapiAuthBearer {
    export interface Options {}
  }

  const hapiAuthBearer: Plugin<hapiAuthBearer.Options>;

  export = hapiAuthBearer;
}
