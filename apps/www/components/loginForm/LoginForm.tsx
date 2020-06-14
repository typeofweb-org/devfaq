import React, { useEffect, useCallback, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { ActionCreators } from '../../redux/actions';
import { getLoggedInUser, getPreviousPath } from '../../redux/selectors/selectors';
import { redirect, getHrefQueryFromPreviousPath } from '../../utils/redirect';
import { ActiveLink } from '../activeLink/ActiveLink';
import AppLogo from '../appLogo/AppLogo';

import styles from './loginForm.module.scss';

const defaultPath = { href: '/', query: {} } as const;

export const LoginForm = memo(() => {
  const auth = useSelector((state) => state.auth);
  const user = useSelector((state) => getLoggedInUser(state));
  const previousPath = useSelector((state) => getHrefQueryFromPreviousPath(getPreviousPath(state)));
  const isTransitioning = useSelector((state) => state.routeDetails.isTransitioning);
  const dispatch = useDispatch();

  const reportEvent = useCallback((action: string) => {
    globalReportEvent(action, 'Logowanie');
  }, []);

  const logInWithGithub = useCallback(() => {
    reportEvent('Zaloguj się przez GitHuba');
    dispatch(ActionCreators.logInWithGitHub());
  }, [dispatch, reportEvent]);

  useEffect(() => {
    if (user && !isTransitioning) {
      if (previousPath) {
        redirect(previousPath.href, previousPath.query);
      } else {
        redirect('/');
      }
    }
  }, [user, isTransitioning, previousPath]);

  const route = previousPath || defaultPath;
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
});
