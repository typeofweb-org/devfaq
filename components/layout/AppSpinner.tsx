import * as React from 'react';
import { addRouterEventListener, removeRouterEventListener } from '../../utils/routerEvents';
import './appSpinner.scss';

const initialState = {
  isLoading: false,
};

export default class AppSpinner extends React.Component<{}, typeof initialState> {
  state = initialState;

  componentDidMount() {
    addRouterEventListener('onRouteChangeStart', this.onRouteChangeStart);
    addRouterEventListener('onRouteChangeComplete', this.onRouteChangeComplete);
    addRouterEventListener('onRouteChangeError', this.onRouteChangeError);
  }

  componentWillUnmount() {
    removeRouterEventListener('onRouteChangeStart', this.onRouteChangeStart);
    removeRouterEventListener('onRouteChangeComplete', this.onRouteChangeComplete);
    removeRouterEventListener('onRouteChangeError', this.onRouteChangeError);
  }

  render() {
    return this.state.isLoading && <div className="spinner" />;
  }

  onRouteChangeStart = () => this.setState({ isLoading: true });
  onRouteChangeComplete = () => this.setState({ isLoading: false });
  onRouteChangeError = () => this.setState({ isLoading: false });
}
