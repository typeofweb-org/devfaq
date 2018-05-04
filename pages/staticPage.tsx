import * as React from 'react';
import Layout from '../components/layout/Layout';
import './index.scss';
import './staticPage.scss';
import { AboutPage, AuthorsPage } from './staticPages';

type StaticPageContent = { component: React.ComponentType; title: string };
const pathToContent: Record<string, StaticPageContent> = {
  '/about': { component: AboutPage, title: 'Jak korzystać? FAQ' },
  '/authors': { component: AuthorsPage, title: 'Autorzy' },
};

export default class Index extends React.Component<{ asPath: string }> {
  static async getInitialProps(ctx: { asPath: string }) {
    return {
      asPath: ctx.asPath,
    };
  }

  render() {
    const content = pathToContent[this.props.asPath];
    const Component = content.component;
    return (
      <Layout title={content.title}>
        <div className="container">
          <Component />
        </div>
      </Layout>
    );
  }
}
