import React from 'react';
import Layout from '../components/layout/Layout';
import './index.scss';
import './staticPages/staticPage.scss';
import { AppRegulations } from './staticPages';

export default class StaticPage extends React.PureComponent {
  render() {
    return (
      <Layout title="Regulations">
        <div className="container">
          <AppRegulations />
        </div>
      </Layout>
    );
  }
}
