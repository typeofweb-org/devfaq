import './appFooter.scss';
import ActiveLink from '../activeLink/ActiveLink';
import env from '../../utils/env';

const AppFooter = () => {
  const version = env.VERSION;
  return (
    <div className="footer-container">
      <footer className="app-footer container">
        <small style={{ color: 'transparent', position: 'absolute', left: 0 }}>{version}</small>
        <nav className="footer-navigation">
          <ul className="footer-navigation--links">
            <li className="footer-navigation--links--item mobile-hide">
              <ActiveLink route="/about">
                <a>Jak korzystać?</a>
              </ActiveLink>
            </li>
            <li className="footer-navigation--links--item">
              <ActiveLink route="/regulations">
                <a>Regulamin</a>
              </ActiveLink>
            </li>
            <li className="footer-navigation--links--item mobile-hide">
              <ActiveLink route="/authors">
                <a>Autorzy</a>
              </ActiveLink>
            </li>
            <li className="footer-navigation--links--item mobile-hide">
              <a href="https://www.facebook.com/fefaqpl" target="_blank">
                Facebook
              </a>
            </li>
            <li className="footer-navigation--links--item">
              <a href="http://angular.love" target="_blank">
                Angular.love
              </a>
            </li>
            <li className="footer-navigation--links--item">
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
