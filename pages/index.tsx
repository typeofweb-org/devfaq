import * as React from 'react';
import './index.scss';
import Layout from '../components/layout/Layout';
import { connect } from 'react-redux';
import { AppState } from '../redux/reducers/index';
import { ActionCreators } from '../redux/actions';

class Index extends React.Component<
  ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps
> {
  render() {
    return (
      <Layout title="Siema">
        <div>{this.props.foo}</div>
        <button onClick={() => this.props.fooDispatch('lol')}>Klik</button>
      </Layout>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    foo: state.foo,
  };
};

const mapDispatchToProps = { fooDispatch: ActionCreators.foo };

const IndexContainer = connect(mapStateToProps, mapDispatchToProps)(Index);

export default IndexContainer;
