declare module 'hapi-swagger' {
  import { Plugin } from 'hapi';

  namespace hapiSwagger {
    export interface Options {
      info: {
        title: string;
        version: any;
      };
      jsonEditor: boolean;
      auth: boolean;
    }
  }

  const hapiSwagger: Plugin<hapiSwagger.Options>;

  export = hapiSwagger;
}
