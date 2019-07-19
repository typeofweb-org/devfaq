import React from 'react';

type AsyncComponentProps<T> = {
  componentProps: T;
  componentProvider(): Promise<React.ComponentType<T>>;
};

type AsyncComponentState<T> = {
  Component: React.ComponentType<T> | null;
  isLoading: boolean;
};

export class AsyncComponent<T extends object> extends React.Component<
  AsyncComponentProps<T>,
  AsyncComponentState<T>
> {
  state: AsyncComponentState<T> = { Component: null, isLoading: false };

  componentDidMount() {
    if (!this.state.Component && !this.state.isLoading) {
      this.setState({ isLoading: true }, this.loadComponent);
    }
  }

  loadComponent = () => {
    return this.props.componentProvider().then(Component => {
      this.setState({ Component, isLoading: false });
    });
  };

  render() {
    const { Component } = this.state;
    if (Component) {
      return <Component {...this.props.componentProps} />;
    }
    return null;
  }
}
