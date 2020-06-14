import { useRouter } from 'next/router';
import React from 'react';
import { connect } from 'react-redux';

import { AppState } from '../../../../redux/reducers';
import { getLoggedInUser } from '../../../../redux/selectors/selectors';
import { getPreviousPathFromHrefQuery } from '../../../../utils/redirect';
import { ActiveLink } from '../../../activeLink/ActiveLink';
import UserAvatar from '../../../userAvatar/UserAvatar';
import navigationHeaderStyles from '../navigationHeader.module.scss';

type LoginStatusLinkProps = ReturnType<typeof mapStateToProps>;

const LoginStatusLinkComponent: React.FC<LoginStatusLinkProps & { onLoginClick?: () => any }> = ({
  user,
  onLoginClick,
  route,
}) => {
  if (user) {
    return <UserAvatar user={user} />;
  }

  const previousPath = getPreviousPathFromHrefQuery(route.pathname, route.query);

  return (
    <ActiveLink
      href="/login"
      query={{ previousPath }}
      activeClassName={navigationHeaderStyles.active}
    >
      <a onClick={onLoginClick}>Zaloguj</a>
    </ActiveLink>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    route: state.routeDetails.current,
    user: getLoggedInUser(state),
  };
};

const LoginStatusLink = connect(mapStateToProps)(LoginStatusLinkComponent);
export default LoginStatusLink;
