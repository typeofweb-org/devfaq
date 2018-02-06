declare module "*.json" {
  const value: any;
  export default value;
}

declare module 'hapi-swagger' {
  import * as Hapi from 'hapi';

  const value: Hapi.PluginFunction<{}>;
  export = value;
}

declare module 'vision' {
  import * as Hapi from 'hapi';

  const inert: Hapi.PluginFunction<{}>;
  export = inert;
}

declare module 'hapi-raven' {
  import * as Hapi from 'hapi';

  const HapiRaven: Hapi.PluginFunction<{}>;
  export = HapiRaven;
}

declare module 'pdfmake' {
  const pdfmake: any;
  export = pdfmake;
}

interface ObjectConstructor {
  entries<T>(o: T): [keyof T, any][];
}

type Writable<T extends { [x: string]: any }, K extends string = keyof T> = {
  [P in K]: T[P];
}
