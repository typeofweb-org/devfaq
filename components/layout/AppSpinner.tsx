import React from 'react';
import './appSpinner.scss';
import { connect } from 'react-redux';
import { AppState } from '../../redux/reducers';

const SUSPENSE_TIME = 150;

class AppSpinnerComponent extends React.Component<
  ReturnType<typeof mapStateToProps>,
  { show: boolean }
> {
  state = { show: false };

  private timerId?: number;

  startTimer() {
    if (this.props.isLoading) {
      if (!this.timerId && !this.state.show) {
        this.timerId = window.setTimeout(() => {
          this.setState({ show: true });
        }, SUSPENSE_TIME);
      }
    } else {
      this.stopTimer();
      if (this.state.show) {
        this.setState({ show: false });
      }
    }
  }

  stopTimer() {
    window.clearTimeout(this.timerId);
    this.timerId = undefined;
  }

  componentDidMount() {
    this.startTimer();
  }

  componentDidUpdate() {
    this.startTimer();
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  render() {
    return this.state.show && <div className="spinner" />;
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    isLoading: state.routeDetails.isTransitioning,
  };
};

const AppSpinner = connect(mapStateToProps)(AppSpinnerComponent);
export default AppSpinner;
