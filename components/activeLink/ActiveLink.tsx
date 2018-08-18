import * as React from 'react';
import { Link, LinkProps } from '../../server/routes';
import * as classNames from 'classnames';
import { AppState } from '../../redux/reducers/index';
import { connect } from 'react-redux';
import { RouteDetails } from 'utils/types';

type ActiveLinkOwnProps = {
  activeClassName?: string;
  exact?: boolean;
  disabledWhenActive?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
};

type ActiveLinkComponentProps = LinkProps & ActiveLinkOwnProps;

class ActiveLinkComponent extends React.Component<ActiveLinkComponentProps & ReturnType<typeof mapStateToProps>> {
  conditionallyAddClassToChild = (
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

  render() {
    const {
      children,
      route,
      activeClassName = 'active',
      prefetch,
      shallow,
      scroll,
      replace,
      href,
      as,
      passHref,
      isMatch,
    } = this.props;
    const child = React.Children.only(children);
    const newChild = this.conditionallyAddClassToChild(isMatch, activeClassName, child);

    // if (isMatch && this.props.disabledWhenActive) {
    //   return <div aria-disabled="true">{newChild}</div>;
    // }

    return (
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
    );
  }
}

const checkForMatch = (
  routeDetails: RouteDetails,
  {
    route,
    exact,
  }: {
    route: LinkProps['route'];
    exact?: boolean;
  }
): boolean => {
  if (routeDetails.asPath === route) {
    return true;
  }
  if (routeDetails.asPath && !exact) {
    return routeDetails.asPath.startsWith(route);
  }
  return false;
};

const mapStateToProps = (state: AppState, ownProps: ActiveLinkComponentProps) => {
  const isMatch = checkForMatch(state.routeDetails.current, ownProps);
  return {
    isMatch,
  };
};

const ActiveLink = connect(mapStateToProps)(ActiveLinkComponent);
export default ActiveLink;
