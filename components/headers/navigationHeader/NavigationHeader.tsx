import * as React from 'react';
import * as classNames from 'classnames';
import AppLogo from '../../appLogo/AppLogo';
import './navigationHeader.scss';
import ActiveLink from '../../activeLink/ActiveLink';

type NavigationHeaderProps = {};
type NavigationHeaderState = {
  open: boolean;
};

export default class NavigationHeader extends React.PureComponent<NavigationHeaderProps, NavigationHeaderState> {
  state = { open: false };
  render() {
    const { open } = this.state;

    return (
      <div className="navigation-header">
        <header className={classNames('app-header--main', 'container', { open })}>
          <ActiveLink route="/questions">
            <a>
              <h1>
                <span className="visuallyhidden">Fefaq.pl</span>
                <AppLogo />
              </h1>
            </a>
          </ActiveLink>
          <nav className={classNames('main-nav', { open })}>
            <ul>
              <li>
                <ActiveLink route="/about" onClick={this.onAboutClick}>
                  <a>Jak korzystać?</a>
                </ActiveLink>
              </li>
              <li>
                <ActiveLink route="/authors" onClick={this.onAuthorsClick}>
                  <a>Autorzy</a>
                </ActiveLink>
              </li>
              <li>
                <a href="https://www.facebook.com/fefaqpl" target="_blank" onClick={() => this.reportEvent('Facebook')}>
                  Facebook
                </a>
              </li>
            </ul>
            <button
              className={classNames('menu-button', { open })}
              title={open ? 'Zamknij menu' : 'Otwórz menu'}
              onClick={this.toggleMenu}
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
  }

  toggleMenu = () => {
    this.setState((state) => ({
      open: !state.open,
    }));
  };

  closeMenu = () => {
    this.setState({ open: false });
  };

  onAboutClick = () => {
    this.closeMenu();
    this.reportEvent('Jak korzystać');
  };

  onAuthorsClick = () => {
    this.closeMenu();
    this.reportEvent('Autorzy');
  };

  reportEvent(action: string) {
    globalReportEvent(action, 'Menu');
  }
}
