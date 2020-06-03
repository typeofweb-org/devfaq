import classNames from 'classnames';
import React, { useState } from 'react';

import ActiveLink from '../../activeLink/ActiveLink';
import AppLogo from '../../appLogo/AppLogo';

import LoginStatusLink from './loginStatusLink/LoginStatusLink';
import styles from './navigationHeader.module.scss';

export const NavigationHeader = () => {
  const [open, toggle] = useState(false);

  const toggleMenu = () => {
    toggle(!open);
  };

  const closeMenu = () => {
    toggle(false);
  };

  const onAboutClick = () => {
    closeMenu();
    reportEvent('Jak korzystać');
  };

  const onAuthorsClick = () => {
    closeMenu();
    reportEvent('Autorzy');
  };

  const onLoginClick = () => {
    closeMenu();
    reportEvent('Zaloguj');
  };

  const reportEvent = (action: string) => {
    globalReportEvent(action, 'Menu');
  };

  return (
    <div className={classNames('app-navigation-header', styles.navigationHeader)}>
      <header className={classNames(styles.appHeaderMain, 'container', { open })}>
        <ActiveLink href="/questions" activeClassName={styles.active}>
          <a>
            <h1>
              <span className="visuallyhidden">DevFAQ.pl</span>
              <AppLogo />
            </h1>
          </a>
        </ActiveLink>
        <nav className={classNames('main-nav', styles.mainNav, { [styles.open]: open })}>
          <ul>
            <li>
              <ActiveLink href="/about" activeClassName={styles.active}>
                <a onClick={onAboutClick}>Jak korzystać?</a>
              </ActiveLink>
            </li>
            <li>
              <ActiveLink href="/authors" activeClassName={styles.active}>
                <a onClick={onAuthorsClick}>Autorzy</a>
              </ActiveLink>
            </li>
            <li>
              <a
                href="https://www.facebook.com/DevFAQ"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => reportEvent('Facebook')}
              >
                Facebook
              </a>
            </li>
            <li>
              <LoginStatusLink onLoginClick={onLoginClick} />
            </li>
          </ul>
          <button
            className={classNames('menu-button', styles.menuButton, { open })}
            title={open ? 'Zamknij menu' : 'Otwórz menu'}
            onClick={toggleMenu}
          >
            <span />
            <span />
            <span />
            <span />
          </button>
        </nav>
      </header>
    </div>
  );
};
