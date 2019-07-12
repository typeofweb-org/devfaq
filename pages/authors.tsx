import React from 'react';
import Layout from '../components/layout/Layout';
import './index.scss';
import './staticPages/staticPage.scss';
import { AuthorsPage } from './staticPages';

export default class StaticPage extends React.PureComponent {
  render() {
    return (
      <Layout title="Autorzy">
        <div className="container">
          <AuthorsPage />
        </div>
      </Layout>
    );
  }
}
