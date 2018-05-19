import * as React from 'react';
import './appSpinner.scss';
import { connect } from 'react-redux';
import { AppState } from '../../redux/reducers';

class AppSpinnerComponent extends React.Component<ReturnType<typeof mapStateToProps>> {
  render() {
    return this.props.isLoading && <div className="spinner" />;
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    isLoading: state.routeDetails.isTransitioning,
  };
};

const AppSpinner = connect(mapStateToProps)(AppSpinnerComponent);
export default AppSpinner;
