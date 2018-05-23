import * as React from 'react';
import Layout from '../components/layout/Layout';
import './index.scss';
import './staticPages/staticPage.scss';
import { AboutPage, AuthorsPage, AppRegulations } from './staticPages';

type StaticPageContent = { component: React.ComponentType; title: string };
const pathToContent: Record<string, StaticPageContent> = {
  '/about': { component: AboutPage, title: 'Jak korzystać? FAQ' },
  '/authors': { component: AuthorsPage, title: 'Autorzy' },
  '/regulations': { component: AppRegulations, title: 'Regulations' },
};

export default class StaticPage extends React.PureComponent<{ asPath: string }> {
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
