import * as React from 'react';
import { withRouter, SingletonRouter } from 'next/router';
import { Link, LinkProps } from '../../routes';
import * as classNames from 'classnames';
import { addRouterEventListener, removeRouterEventListener } from '../../utils/routerEvents';

type ActiveLinkOwnProps = {
  activeClassName?: string;
  exact?: boolean;
};
type ActiveLinkRouterProps = {
  router: SingletonRouter;
};

const conditionallyAddClassToChild = (
  shouldAddActiveClass: boolean,
  activeClassName: string,
  child: React.ReactElement<any>
): React.ReactElement<any> => {
  if (!shouldAddActiveClass) {
    return child;
  }
  const modifiedChild = React.cloneElement(child, {
    ...child.props,
    className: classNames(child.props.className, { [activeClassName]: shouldAddActiveClass }),
  });
  return modifiedChild;
};

const initialState = {
  asPath: '' as SingletonRouter['asPath'],
  pathname: '' as SingletonRouter['pathname'],
  query: {} as SingletonRouter['query'],
  route: '' as SingletonRouter['route'],
};

type ActiveLinkComponentProps = LinkProps & ActiveLinkOwnProps & ActiveLinkRouterProps;
type ActiveLinkComponentState = typeof initialState;

class ActiveLinkComponent extends React.Component<
  ActiveLinkComponentProps,
  ActiveLinkComponentState
> {
  static getDerivedStateFromProps(
    nextProps: ActiveLinkComponentProps,
    _prevState: ActiveLinkComponentState
  ): Partial<ActiveLinkComponentState> {
    const { asPath, pathname, query, route } = nextProps.router;
    return { asPath, pathname, query, route };
  }

  state = initialState;

  componentDidMount() {
    addRouterEventListener('onRouteChangeComplete', this.onRouteChangeComplete);
  }

  componentWillUnmount() {
    removeRouterEventListener('onRouteChangeComplete', this.onRouteChangeComplete);
  }

  render() {
    const { children, route, activeClassName = '' } = this.props;
    const child = React.Children.only(children);

    return (
      <Link route={route}>
        {conditionallyAddClassToChild(this.isMatch(), activeClassName, child)}
      </Link>
    );
  }

  private onRouteChangeComplete = () => {
    const nextState = ActiveLinkComponent.getDerivedStateFromProps(this.props, this.state);
    this.setState(nextState as Required<ActiveLinkComponentState>);
  };

  private isMatch = (): boolean => {
    if (this.state.asPath === this.props.route) {
      return true;
    }
    if (this.state.asPath && !this.props.exact) {
      return this.state.asPath.startsWith(this.props.route);
    }
    return false;
  };
}

const ActiveLink = withRouter(ActiveLinkComponent);
export default ActiveLink;
