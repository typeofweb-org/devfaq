import React from 'react';
import classNames from 'classnames';
import { AppState } from '../../redux/reducers/index';
import { connect } from 'react-redux';
import { RouteDetails } from '../../utils/types';
import Link, { LinkProps } from 'next/link';
import { hrefQueryToAsPath } from '../../utils/redirect';
import invariant from 'invariant';

interface ActiveLinkOwnProps {
  activeClassName: string;
  exact?: boolean;
  disabledWhenActive?: boolean;
  onClick?: React.MouseEventHandler<any>;
  children: React.ReactElement<any>;
  query?: Record<string, string[] | string | undefined>;
}

type ActiveLinkComponentProps = Omit<LinkProps, 'as'> & ActiveLinkOwnProps;

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
      activeClassName,
      disabledWhenActive,
      query,
      as,
      children,

      href,
      replace,
      scroll,
      shallow,
      passHref,
      prefetch,
    } = this.props;

    invariant(activeClassName != null, 'activeClassName is required!');

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
    href,
    query,
    as,
    exact,
  }: {
    href: ActiveLinkComponentProps['href'];
    query: ActiveLinkComponentProps['query'];
    as: string;
    exact?: boolean;
  }
): boolean => {
  const isExactMatch = as === routeDetails.asPath;

  if (isExactMatch || exact) {
    return isExactMatch;
  }

  const asNoQuery = hrefQueryToAsPath(href, query, true);
  if (asNoQuery.as === routeDetails.asPath) {
    return true;
  }

  if (routeDetails.asPath && routeDetails.asPath.startsWith(asNoQuery.as)) {
    return true;
  }

  return false;
};

const mapStateToProps = (state: AppState, ownProps: ActiveLinkComponentProps) => {
  const { as, href } = hrefQueryToAsPath(ownProps.href, ownProps.query);

  const isMatch = checkForMatch(state.routeDetails.current, {
    as,
    href: ownProps.href,
    query: ownProps.query,
    exact: ownProps.exact,
  });

  return {
    isMatch,
    as,
    href,
  };
};

const ActiveLink = connect(mapStateToProps)(ActiveLinkComponent);
export default ActiveLink;
