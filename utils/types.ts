import { SingletonRouter } from 'next/router';
import { Http2ServerRequest, Http2ServerResponse } from 'http2';
import { Store } from 'redux';
import { AppState } from '../redux/reducers/index';
import { AsyncAction } from '../redux/actions';

export type AppStore = Store<AppState> & {
  dispatch<R>(asyncAction: AsyncAction<R>): R;
};

type CommonContext = RouteDetails & {
  store: AppStore;
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

export type RouteDetails = {
  pathname: SingletonRouter['pathname'];
  query?: SingletonRouter['query'];
  asPath?: SingletonRouter['asPath'];
  route: SingletonRouter['route'];
};
