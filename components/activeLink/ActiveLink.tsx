import * as React from 'react';
import { withRouter, SingletonRouter } from 'next/router';
import { Link, LinkProps } from '../../routes';
import * as classNames from 'classnames';
import { addRouterEventListener, removeRouterEventListener } from '../../utils/routerEvents';
import { isEqual } from 'lodash';

type ActiveLinkOwnProps = {
  activeClassName?: string;
  exact?: boolean;
  disabledWhenActive?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
};

type ActiveLinkRouterProps = {
  router: SingletonRouter;
};

const defaultProps: Partial<ActiveLinkComponentProps> = {
  activeClassName: 'active',
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

class ActiveLinkComponent extends React.Component<ActiveLinkComponentProps, ActiveLinkComponentState> {
  static defaultProps = defaultProps;

  static getDerivedStateFromProps(
    nextProps: ActiveLinkComponentProps,
    _prevState: ActiveLinkComponentState
  ): Partial<ActiveLinkComponentState> {
    const { asPath, pathname, query, route } = nextProps.router;
    return { asPath, pathname, query, route };
  }

  state = initialState;

  shouldComponentUpdate(
    nextProps: Readonly<ActiveLinkComponentProps>,
    nextState: Readonly<ActiveLinkComponentState>
  ): boolean {
    return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState);
  }

  componentDidMount() {
    addRouterEventListener('onRouteChangeComplete', this.onRouteChangeComplete);
  }

  componentWillUnmount() {
    removeRouterEventListener('onRouteChangeComplete', this.onRouteChangeComplete);
  }

  render() {
    const {
      children,
      route,
      activeClassName = '',
      prefetch,
      shallow,
      scroll,
      replace,
      href,
      as,
      passHref,
    } = this.props;
    const child = React.Children.only(children);
    const isMatch = this.isMatch();
    const newChild = conditionallyAddClassToChild(isMatch, activeClassName, child);

    if (isMatch && this.props.disabledWhenActive) {
      return <div aria-disabled="true">{newChild}</div>;
    }

    return (
      <span onClick={this.props.onClick}>
        <Link
          prefetch={prefetch}
          route={route}
          shallow={shallow}
          scroll={scroll}
          replace={replace}
          href={href}
          as={as}
          passHref={passHref}
        >
          {newChild}
        </Link>
      </span>
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
