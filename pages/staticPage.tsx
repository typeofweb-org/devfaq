import * as React from 'react';
import Layout from '../components/layout/Layout';
import './index.scss';
import './staticPage.scss';
import { AboutPage, AuthorsPage } from './staticPages';

const pathToContent: Record<string, React.ComponentType> = {
  '/about': AboutPage,
  '/authors': AuthorsPage,
};

export default class Index extends React.Component<{ asPath: string }> {
  static async getInitialProps(ctx: { asPath: string }) {
    return {
      asPath: ctx.asPath,
    };
  }

  render() {
    const Content = pathToContent[this.props.asPath];
    return (
      <Layout title="Static page">
        <div className="container">
          <Content />
        </div>
      </Layout>
    );
  }
}
