import classNames from 'classnames';
import invariant from 'invariant';
import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import React, { memo, useMemo } from 'react';

import { hrefQueryToAsPath } from '../../utils/redirect';
import { RouteDetails } from '../../utils/types';

interface ActiveLinkOwnProps {
  activeClassName: string;
  exact?: boolean;
  disabledWhenActive?: boolean;
  onClick?: React.MouseEventHandler<any>;
  children: React.ReactElement<any>;
  query?: Record<string, string[] | string | undefined>;
}

type ActiveLinkProps = Omit<LinkProps, 'as'> & ActiveLinkOwnProps;

export const ActiveLink = memo<ActiveLinkProps>(
  ({
    activeClassName,
    exact,
    disabledWhenActive,
    onClick,
    children,
    query,
    href: originalHref,
    ...otherProps
  }) => {
    const { as, href } = hrefQueryToAsPath(originalHref, query);
    const router = useRouter();

    const isMatch = useMemo(() => {
      return checkForMatch(router, {
        as,
        href: originalHref,
        query,
        exact,
      });
    }, [as, exact, originalHref, query, router]);

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

    invariant(activeClassName != null, 'activeClassName is required!');

    const child = React.Children.only(children);
    const newChild = conditionallyAddClassToChild(isMatch, activeClassName, child);

    // if (isMatch && this.props.disabledWhenActive) {
    //   return <div aria-disabled="true">{newChild}</div>;
    // }

    return (
      <Link {...otherProps} href={href} as={as}>
        {newChild}
      </Link>
    );
  }
);

const checkForMatch = (
  routeDetails: RouteDetails,
  {
    href,
    query,
    as,
    exact,
  }: {
    href: ActiveLinkProps['href'];
    query: ActiveLinkProps['query'];
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
