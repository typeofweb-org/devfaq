import React from 'react';
import styles from './loginForm.module.scss';
import { connect } from 'react-redux';
import { AppState } from '../../redux/reducers/index';
import { ActionCreators } from '../../redux/actions';
import { isString } from 'lodash';
import { getLoggedInUser, getPreviousPath } from '../../redux/selectors/selectors';
import AppLogo from '../appLogo/AppLogo';
import ActiveLink from '../activeLink/ActiveLink';
import { redirect, getHrefQueryFromPreviousPath } from '../../utils/redirect';

type LoginFormReduxProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

class LoginFormComponent extends React.Component<LoginFormReduxProps> {
  componentDidUpdate() {
    const { user, previousPath, isTransitioning } = this.props;
    if (user && !isTransitioning) {
      if (previousPath) {
        redirect(previousPath.href, previousPath.query);
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
    const route = previousPath || { href: '/', query: {} };
    return (
      <div className={styles.loginOverlay}>
        <div className={styles.loginContainer}>
          <AppLogo />
          {this.props.auth.error && <p>{this.props.auth.error.message}</p>}
          <p>Stwórz konto już dzisiaj i korzystaj z dodatkowych funkcji serwisu DevFAQ!</p>
          <button onClick={this.logInWithGithub} className={styles.logInWithGitHub}>
            Zaloguj się przez GitHuba
          </button>
          <footer>
            <ActiveLink
              href={route.href}
              query={route.query}
              onClick={() => this.reportEvent('Powrót do strony głównej')}
            >
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
    previousPath: getHrefQueryFromPreviousPath(getPreviousPath(state)),
    isTransitioning: state.routeDetails.isTransitioning,
  };
};

const mapDispatchToProps = {
  logInWithGitHub: ActionCreators.logInWithGitHub,
};

const LoginForm = connect(mapStateToProps, mapDispatchToProps)(LoginFormComponent);
export default LoginForm;
