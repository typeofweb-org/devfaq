import React from 'react';
import './loginForm.scss';
import { connect } from 'react-redux';
import { AppState } from '../../redux/reducers/index';
import { ActionCreators } from '../../redux/actions';
import { isString } from 'lodash';
import { getLoggedInUser, getPreviousPath } from '../../redux/selectors/selectors';
import AppLogo from '../appLogo/AppLogo';
import ActiveLink from '../activeLink/ActiveLink';
import { redirect } from '../../utils/redirect';

type LoginFormReduxProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

class LoginFormComponent extends React.Component<LoginFormReduxProps> {
  componentDidUpdate() {
    const { user, previousPath, isTransitioning } = this.props;
    console.log({ user, previousPath, isTransitioning });
    if (user && !isTransitioning) {
      if (isString(previousPath)) {
        redirect(previousPath);
      } else {
        redirect('/');
      }
    }
  }

  reportEvent = (action: string) => {
    globalReportEvent(action, 'Logowanie');
  };

  logInWithGithub = () => {
    this.reportEvent('Zaloguj się przez GitHuba');
    this.props.logInWithGitHub();
  };

  render() {
    const { previousPath } = this.props;
    const route = isString(previousPath) ? previousPath : '/';
    return (
      <div className="login-overlay">
        <div className="login-container">
          <AppLogo />
          {this.props.auth.error && <p>{this.props.auth.error.message}</p>}
          <p>Stwórz konto już dzisiaj i korzystaj z dodatkowych funkcji serwisu DevFAQ!</p>
          <button onClick={this.logInWithGithub} className="login-with-github">
            Zaloguj się przez GitHuba
          </button>
          <footer>
            <ActiveLink href={route} onClick={() => this.reportEvent('Powrót do strony głównej')}>
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
    previousPath: getPreviousPath(state),
    isTransitioning: state.routeDetails.isTransitioning,
  };
};

const mapDispatchToProps = {
  logInWithGitHub: ActionCreators.logInWithGitHub,
};

const LoginForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginFormComponent);
export default LoginForm;
