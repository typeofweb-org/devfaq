import * as React from 'react';
import './loginForm.scss';
import { withRouter, WithRouterProps } from 'next/router';
import { connect } from 'react-redux';
import { AppState } from '../../redux/reducers/index';
import { ActionCreators } from '../../redux/actions';
import { isString } from 'lodash';

type LoginFormReduxProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

class LoginFormComponent extends React.Component<LoginFormReduxProps & WithRouterProps> {
  componentDidUpdate() {
    const { auth, router } = this.props;
    if (auth.data && router) {
      if (router.query && isString(router.query.previousPath)) {
        // tslint:disable-next-line:no-floating-promises
        router.push(router.query.previousPath);
      } else {
        // tslint:disable-next-line:no-floating-promises
        router.push('/');
      }
    }
  }

  render() {
    return (
      <div className="login-container">
        <p>{this.props.auth.error && this.props.auth.error.message}</p>
        <button onClick={this.props.logInWithGitHub}>Zaloguj z GitHubem</button>
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
  logInWithGitHub: ActionCreators.logInWithGitHub,
};

const LoginForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter<LoginFormReduxProps>(LoginFormComponent));
export default LoginForm;
