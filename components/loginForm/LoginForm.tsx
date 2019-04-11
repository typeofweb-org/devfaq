import * as React from 'react';
import './loginForm.scss';
import { withRouter, WithRouterProps } from 'next/router';
import { connect } from 'react-redux';
import { AppState } from '../../redux/reducers/index';
import { ActionCreators } from '../../redux/actions';
import { isString } from 'lodash';
import { getLoggedInUser } from '../../redux/selectors/selectors';
import AppLogo from '../appLogo/AppLogo';
import ActiveLink from '../activeLink/ActiveLink';

type LoginFormReduxProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

class LoginFormComponent extends React.Component<LoginFormReduxProps & WithRouterProps> {
  componentDidUpdate() {
    const { user, router } = this.props;
    if (user && router) {
      if (router.query && isString(router.query.previousPath)) {
        void router.push(router.query.previousPath);
      } else {
        void router.push('/');
      }
    }
  }

  render() {
    return (
      <div className="login-overlay">
        <div className="login-container">
          <AppLogo />
          {this.props.auth.error && <p>{this.props.auth.error.message}</p>}
          <p>Stwórz konto już dzisiaj i korzystaj z dodatkowych funkcji serwisu Fefaq!</p>
          <button onClick={this.props.logInWithGitHub} className="login-with-github">
            Zaloguj się przez GitHuba
          </button>
          <footer>
            <ActiveLink route="/">
              <a>Powrót do strony głównej</a>
            </ActiveLink>
          </footer>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    auth: state.auth,
    user: getLoggedInUser(state),
  };
};

const mapDispatchToProps = {
  logInWithGitHub: ActionCreators.logInWithGitHub,
};

const LoginForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter<LoginFormReduxProps>(LoginFormComponent));
export default LoginForm;
