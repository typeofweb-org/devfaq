import { configureScope, captureException, showReportDialog } from '@sentry/browser';
import React from 'react';

export class ErrorBoundary extends React.Component {
  state = { error: null };

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo & Record<string, any>) {
    this.setState({ error });
    configureScope((scope) => {
      Object.keys(errorInfo).forEach((key) => {
        scope.setExtra(key, errorInfo[key]);
      });
    });
    captureException(error);
  }

  onReportFeedbackClick = () => {
    showReportDialog();
  };

  render() {
    if (this.state.error) {
      return <button onClick={this.onReportFeedbackClick}>Report feedback</button>;
    } else {
      return this.props.children;
    }
  }
}
