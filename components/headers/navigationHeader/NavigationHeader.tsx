import * as React from 'react';
import * as classNames from 'classnames';
import AppLogo from '../../appLogo/AppLogo';
import './navigationHeader.scss';

type NavigationHeaderProps = {};
type NavigationHeaderState = {
  open: boolean;
};

const reportEvent = (_t: string) => {};

export default class NavigationHeader extends React.Component<
  NavigationHeaderProps,
  NavigationHeaderState
> {
  state = { open: false };
  render() {
    const { open } = this.state;

    return (
      <div className="navigation-header">
        <header className={classNames('app-header--main', 'container', { open })}>
          <a href="/questions">
            <h1>
              <span className="visuallyhidden">Fefaq.pl</span>
              <AppLogo />
            </h1>
          </a>
          <nav className={classNames('main-nav', { open })}>
            <ul>
              <li>
                <a href="/about" onClick={this.onAboutClick}>
                  Jak korzystać?
                </a>
              </li>
              <li>
                <a href="/authors" onClick={this.onAuthorsClick}>
                  Autorzy
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/fefaqpl"
                  target="_blank"
                  onClick={() => reportEvent('Facebook')}
                >
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
    reportEvent('Jak korzystać');
  };

  onAuthorsClick = () => {
    this.closeMenu();
    reportEvent('Autorzy');
  };
}
