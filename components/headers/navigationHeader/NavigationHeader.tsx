import * as React from 'react';
import * as classNames from 'classnames';
import AppLogo from '../../appLogo/AppLogo';
import './navigationHeader.scss';
import ActiveLink from '../../activeLink/ActiveLink';
import { connect } from 'react-redux';
import { AppState } from '../../../redux/reducers/index';
import LoginStatusLink from './loginStatusLink/LoginStatusLink';

type NavigationHeaderProps = ReturnType<typeof mapStateToProps>;
interface NavigationHeaderState {
  open: boolean;
}

class NavigationHeaderComponent extends React.PureComponent<
  NavigationHeaderProps,
  NavigationHeaderState
> {
  state = { open: false };
  render() {
    const { open } = this.state;

    // const authData = this.props.authData;
    // const userId = authData && authData.user.id;

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
                <ActiveLink route="/about">
                  <a onClick={this.onAboutClick}>Jak korzystać?</a>
                </ActiveLink>
              </li>
              <li>
                <ActiveLink route="/authors">
                  <a onClick={this.onAuthorsClick}>Autorzy</a>
                </ActiveLink>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/fefaqpl"
                  target="_blank"
                  onClick={() => this.reportEvent('Facebook')}
                >
                  Facebook
                </a>
              </li>
              <li>
                <LoginStatusLink onLoginClick={this.onLoginClick} />
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
    this.setState(state => ({
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

  onLoginClick = () => {
    this.closeMenu();
    this.reportEvent('Zaloguj');
  };

  reportEvent(action: string) {
    globalReportEvent(action, 'Menu');
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    authData: state.auth.data,
  };
};

const NavigationHeader = connect(mapStateToProps)(NavigationHeaderComponent);
export default NavigationHeader;
