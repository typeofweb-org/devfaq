import React from 'react';
import Layout from '../components/layout/Layout';
import './index.scss';
import './staticPages/staticPage.scss';
import { AboutPage } from './staticPages';

export default class StaticPage extends React.PureComponent {
  render() {
    return (
      <Layout title="Jak korzystać? FAQ">
        <div className="container">
          <AboutPage />
        </div>
      </Layout>
    );
  }
}
