import { SingletonRouter } from 'next/router';
import { Http2ServerRequest, Http2ServerResponse } from 'http2';
import { Store } from 'redux';
import { AppState } from '../redux/reducers/index';

type CommonContext = {
  pathname: SingletonRouter['pathname'];
  query: SingletonRouter['query'];
  asPath: SingletonRouter['asPath'];
  store: Store<AppState>;
};

type ServerContext = CommonContext & {
  isServer: true;
  res: Http2ServerResponse;
  req: Http2ServerRequest;
  err: Error;
};

type BrowserContext = CommonContext & {
  isServer: false;
};

export type GetInitialPropsContext = ServerContext | BrowserContext;
export type GetInitialProps = <T>(ctx: GetInitialPropsContext) => Promise<T>;
// export type HasGetInitialProps<T extends React.Component> = React.Component & {
//   getInitialProps: GetInitialProps;
// };
