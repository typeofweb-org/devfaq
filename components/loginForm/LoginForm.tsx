import * as React from 'react';
import './loginForm.scss';
import { withRouter, WithRouterProps } from 'next/router';
import { connect } from 'react-redux';
import { AppState } from '../../redux/reducers/index';
import { ActionCreators } from '../../redux/actions';
import * as classNames from 'classnames';
import { isString } from 'lodash';

const defaultState = {
  email: '',
  password: '',
  valid: false,
};

type LoginFormState = typeof defaultState;
type LoginnFormReduxProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

class LoginFormComponent extends React.Component<
  LoginnFormReduxProps & WithRouterProps,
  LoginFormState
> {
  state: LoginFormState = defaultState;

  onSubmit = () => {
    this.props.logIn(this.state.email, this.state.password);
  };

  onEmailChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    const email = e.currentTarget.value;
    this.setState(state => ({
      email,
      valid: this.isValid(state),
    }));
  };

  onPasswordChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    const password = e.currentTarget.value;
    this.setState(state => ({
      password,
      valid: this.isValid(state),
    }));
  };

  isValid = (state: LoginFormState) => {
    return Boolean(state.email.trim() && state.password.trim());
  };

  componentDidUpdate() {
    const { auth, router } = this.props;
    if (auth.data) {
      if (router.query && isString(router.query.previousPath)) {
        // tslint:disable-next-line:no-floating-promises
        this.props.router.push(router.query.previousPath);
      } else {
        // tslint:disable-next-line:no-floating-promises
        this.props.router.push('/admin');
      }
    }
  }

  render() {
    return (
      <div className="login-container">
        <form className="form">
          <h2>FEFAQ</h2>
          <p>{this.props.auth.error && this.props.auth.error.message}</p>
          <input
            name="email"
            required
            onChange={this.onEmailChange}
            value={this.state.email}
            placeholder="Email"
            type="text"
          />
          <input
            name="password"
            required
            onChange={this.onPasswordChange}
            value={this.state.password}
            placeholder="Password"
            type="password"
          />
          <button
            className={classNames('round-button', 'branding-button-inverse', {
              loading: this.props.auth.isLoading,
            })}
            onClick={this.onSubmit}
            disabled={!this.state.valid || this.props.auth.isLoading}
          >
            Zaloguj
          </button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = {
  logIn: ActionCreators.logIn,
};

const LoginForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter<LoginnFormReduxProps>(LoginFormComponent));
export default LoginForm;
