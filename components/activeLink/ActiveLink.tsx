import React from 'react';
import classNames from 'classnames';
import { AppState } from '../../redux/reducers/index';
import { connect } from 'react-redux';
import { RouteDetails } from '../../utils/types';
import Link, { LinkProps } from 'next/link';

interface ActiveLinkOwnProps {
  activeClassName?: string;
  exact?: boolean;
  disabledWhenActive?: boolean;
  onClick?: React.MouseEventHandler<any>;
  children: React.ReactElement<any>;
}

type ActiveLinkComponentProps = LinkProps & ActiveLinkOwnProps;

class ActiveLinkComponent extends React.Component<
  ActiveLinkComponentProps & ReturnType<typeof mapStateToProps>
> {
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
      isMatch,
      activeClassName = 'active',
      disabledWhenActive,
      children,

      href,
      as,
      replace,
      scroll,
      shallow,
      passHref,
      prefetch,
    } = this.props;
    const child = React.Children.only(children);
    const newChild = this.conditionallyAddClassToChild(isMatch, activeClassName, child);

    // if (isMatch && this.props.disabledWhenActive) {
    //   return <div aria-disabled="true">{newChild}</div>;
    // }

    return (
      <Link
        href={href}
        as={as}
        replace={replace}
        scroll={scroll}
        shallow={shallow}
        passHref={passHref}
        prefetch={prefetch}
      >
        {newChild}
      </Link>
    );
  }
}

const checkForMatch = (
  routeDetails: RouteDetails,
  {
    // route,
    exact,
  }: // params,
  {
    // route: LinkProps['route'];
    // params?: LinkProps['params'];
    exact?: boolean;
  }
): boolean => {
  // if (routeDetails.asPath === route) {
  //   return true;
  // }

  // const foundUrls = routes.findAndGetUrls(route, params);
  // const isExactMatch = foundUrls.urls.as === routeDetails.asPath;

  // if (isExactMatch || exact) {
  //   return isExactMatch;
  // }

  // if (foundUrls.urls.as && routeDetails.asPath) {
  //   const [foundPathname] = foundUrls.urls.as.split('?');
  //   const [routePathname] = routeDetails.asPath.split('?');
  //   return routePathname.startsWith(foundPathname);
  // }

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
