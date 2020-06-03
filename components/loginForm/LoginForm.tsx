import React, { useEffect } from 'react';
import styles from './loginForm.module.scss';
import { connect } from 'react-redux';
import { AppState } from '../../redux/reducers/index';
import { ActionCreators } from '../../redux/actions';
import { getLoggedInUser, getPreviousPath } from '../../redux/selectors/selectors';
import AppLogo from '../appLogo/AppLogo';
import ActiveLink from '../activeLink/ActiveLink';
import { redirect, getHrefQueryFromPreviousPath } from '../../utils/redirect';

type LoginFormReduxProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const LoginFormComponent: React.FC<LoginFormReduxProps> = React.memo(
  ({ user, isTransitioning, previousPath, auth, logInWithGitHub }) => {
    const reportEvent = (action: string) => {
      globalReportEvent(action, 'Logowanie');
    };

    const logInWithGithub = () => {
      reportEvent('Zaloguj się przez GitHuba');
      logInWithGitHub();
    };

    useEffect(() => {
      if (user && !isTransitioning) {
        if (previousPath) {
          redirect(previousPath.href, previousPath.query);
        } else {
          redirect('/');
        }
      }
    }, [user, isTransitioning, previousPath, redirect]);

    const route = previousPath || { href: '/', query: {} };
    return (
      <div className={styles.loginOverlay}>
        <div className={styles.loginContainer}>
          <AppLogo />
          {auth.error && <p>{auth.error.message}</p>}
          <p>Stwórz konto już dzisiaj i korzystaj z dodatkowych funkcji serwisu DevFAQ!</p>
          <button onClick={logInWithGithub} className={styles.loginWithGithub}>
            Zaloguj się przez GitHuba
          </button>
          <footer>
            <ActiveLink
              href={route.href}
              query={route.query}
              onClick={() => reportEvent('Powrót do strony głównej')}
              activeClassName=""
            >
              <a>Powrót do strony głównej</a>
            </ActiveLink>
          </footer>
        </div>
      </div>
    );
  }
);

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
