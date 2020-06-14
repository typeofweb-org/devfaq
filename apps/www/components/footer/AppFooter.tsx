import classNames from 'classnames';
import React from 'react';

import env from '../../utils/env';
import { ActiveLink } from '../activeLink/ActiveLink';
import { Container } from '../container/Container';

import styles from './appFooter.module.scss';

export const AppFooter = () => {
  const version = env.VERSION;
  return (
    <div className={styles.footerContainer}>
      <Container as="footer">
        <small style={{ color: 'transparent', position: 'absolute', left: 0 }}>{version}</small>
        <nav className={styles.footerNavigation}>
          <ul className={styles.footerNavigationLinks}>
            <li className={classNames(styles.footerNavigationLinksItem, 'mobile-hide')}>
              <ActiveLink href="/about" activeClassName="">
                <a>Jak korzystać?</a>
              </ActiveLink>
            </li>
            <li className={styles.footerNavigationLinksItem}>
              <ActiveLink href="/regulations" activeClassName="">
                <a>Regulamin</a>
              </ActiveLink>
            </li>
            <li className={classNames(styles.footerNavigationLinksItem, 'mobile-hide')}>
              <ActiveLink href="/authors" activeClassName="">
                <a>Autorzy</a>
              </ActiveLink>
            </li>
            <li className={classNames(styles.footerNavigationLinksItem, 'mobile-hide')}>
              <a href="https://www.facebook.com/DevFAQ" target="_blank" rel="noopener noreferrer">
                Facebook
              </a>
            </li>
            <li className={styles.footerNavigationLinksItem}>
              <a href="https://typeofweb.com/" target="_blank" rel="noopener noreferrer">
                Type of Web
              </a>
            </li>
          </ul>
        </nav>
      </Container>
    </div>
  );
};
