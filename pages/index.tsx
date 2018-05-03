import * as React from 'react';
import '../styles/index.scss';
import Layout from '../components/layout/Layout';

export default class Index extends React.Component {
  render() {
    return (
      <Layout title="Siema">
        <div>Hello, world 2!</div>
      </Layout>
    );
  }
}
