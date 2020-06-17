import * as Sentry from '@sentry/browser';
import React from 'react';

export class ErrorBoundary extends React.Component {
  state: { error: Error | null } = {
    error: null,
  };

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo & Record<string, any>) {
    if (!this.state.error) {
      this.setState({ error });
    }
    Sentry.configureScope((scope) => {
      Object.keys(errorInfo).forEach((key) => {
        scope.setExtra(key, errorInfo[key]);
      });
      Sentry.captureException(error);
    });
  }

  onReportFeedbackClick = () => {
    Sentry.showReportDialog();
  };

  render() {
    if (this.state.error) {
      return (
        <>
          <h1 style={{ textAlign: 'center' }}>Something went wrong…</h1>
          <button
            style={{ alignSelf: 'center' }}
            className="round-button"
            onClick={this.onReportFeedbackClick}
          >
            Report feedback
          </button>
        </>
      );
    } else {
      return this.props.children;
    }
  }
}
