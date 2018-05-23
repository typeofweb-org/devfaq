import { SingletonRouter } from 'next/router';
import { Store } from 'redux';
import { AppState } from '../redux/reducers/index';
import { AsyncAction } from '../redux/actions';

import * as express from 'express';

export type AppStore = Store<AppState> & {
  dispatch<R>(asyncAction: AsyncAction<R>): R;
};

type CommonContext = RouteDetails & {
  store: AppStore;
};

type ServerContext = CommonContext & {
  isServer: true;
  res: express.Response;
  req: express.Request;
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
