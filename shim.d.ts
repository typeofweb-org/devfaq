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

declare module 'pdfmake' {
  const pdfmake: any;
  export = pdfmake;
}
