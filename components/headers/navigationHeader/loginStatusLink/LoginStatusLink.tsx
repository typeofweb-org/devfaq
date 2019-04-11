import * as React from 'react';
import { connect } from 'react-redux';
import { getLoggedInUser } from '../../../../redux/selectors/selectors';
import { AppState } from '../../../../redux/reducers';
import ActiveLink from '../../../activeLink/ActiveLink';

type LoginStatusLinkProps = ReturnType<typeof mapStateToProps>;

const LoginStatusLinkComponent: React.FC<LoginStatusLinkProps & { onLoginClick?: () => any }> = ({
  user,
  onLoginClick,
}) => {
  if (user) {
    return null;
  }

  return (
    <ActiveLink route="/login">
      <a onClick={onLoginClick}>Zaloguj</a>
    </ActiveLink>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    user: getLoggedInUser(state),
  };
};

const LoginStatusLink = connect(mapStateToProps)(LoginStatusLinkComponent);
export default LoginStatusLink;
