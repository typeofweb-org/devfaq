import * as React from 'react';
import { withRouter, SingletonRouter } from 'next/router';
import { Link, LinkProps } from '../../routes';
import * as classNames from 'classnames';

type ActiveLinkOwnProps = {
  activeClassName?: string;
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

const ActiveLinkComponent: React.SFC<LinkProps & ActiveLinkOwnProps & ActiveLinkRouterProps> = ({
  children,
  route,
  router,
  activeClassName = '',
}) => {
  const shouldAddActiveClass = router.asPath === route;
  const child = React.Children.only(children);

  return (
    <Link route={route}>
      {conditionallyAddClassToChild(shouldAddActiveClass, activeClassName, child)}
    </Link>
  );
};

const ActiveLink = withRouter(ActiveLinkComponent);
export default ActiveLink;
