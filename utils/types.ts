import { NextPageContext } from 'next';
import { SingletonRouter } from 'next/router';
import { Store } from 'redux';

import { AsyncAction } from '../redux/actions';
import { AppState } from '../redux/reducers/index';

export type AppStore = Store<AppState> & {
  dispatch<R>(asyncAction: AsyncAction<R>): R;
};

export type GetInitialPropsContext = NextPageContext;
export type GetInitialProps = <T>(ctx: GetInitialPropsContext) => Promise<T>;
// export type HasGetInitialProps<T extends React.Component> = React.Component & {
//   getInitialProps: GetInitialProps;
// };

export interface RouteDetails {
  pathname: SingletonRouter['pathname'];
  query?: SingletonRouter['query'];
  asPath?: SingletonRouter['asPath'];
  route: SingletonRouter['route'];
}

declare module 'next' {
  interface NextPageContext extends RouteDetails {
    store: AppStore;
  }
}
