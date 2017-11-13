import * as Hapi from 'hapi';

declare module 'hapi' {
  export interface RouteHandlerParam<T> {
    (request: T, reply: ReplyNoContinue): void;
  }
}
