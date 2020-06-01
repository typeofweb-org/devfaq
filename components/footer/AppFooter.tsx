import styles from './appFooter.module.scss';
import ActiveLink from '../activeLink/ActiveLink';
import env from '../../utils/env';
import classNames from 'classnames';

const AppFooter = () => {
  const version = env.VERSION;
  return (
    <div className={styles.footerContainer}>
      <footer className="app-footer container">
        <small style={{ color: 'transparent', position: 'absolute', left: 0 }}>{version}</small>
        <nav className={styles.footerNavigation}>
          <ul className={styles.footerNavigationLinks}>
            <li className={classNames(styles.footerNavigationLinksItem, 'mobile-hide')}>
              <ActiveLink href="/about">
                <a>Jak korzystać?</a>
              </ActiveLink>
            </li>
            <li className={styles.footerNavigationLinksItem}>
              <ActiveLink href="/regulations">
                <a>Regulamin</a>
              </ActiveLink>
            </li>
            <li className={classNames(styles.footerNavigationLinksItem, 'mobile-hide')}>
              <ActiveLink href="/authors">
                <a>Autorzy</a>
              </ActiveLink>
            </li>
            <li className={classNames(styles.footerNavigationLinksItem, 'mobile-hide')}>
              <a href="https://www.facebook.com/DevFAQ" target="_blank">
                Facebook
              </a>
            </li>
            <li className={styles.footerNavigationLinksItem}>
              <a href="https://typeofweb.com/" target="_blank">
                Type of Web
              </a>
            </li>
          </ul>
        </nav>
      </footer>
    </div>
  );
};

export default AppFooter;
