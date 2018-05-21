declare module 'react-simplemde-editor' {
  export interface SimpleMDEProps {
    id?: string;
    label?: string;
    onChange?(): any;
    value?: string;
    options?: SimpleMDE.Options;
    extraKeys?: object;
  }

  declare const SimpleMDE: React.ComponentClass<SimpleMDEProps>;
  SimpleMDE.SimpleMDEProps = SimpleMDEProps;

  export = SimpleMDE;
}
