import * as React from 'react';
import Layout from '../components/layout/Layout';
import './index.scss';
import './staticPages/staticPage.scss';
import { AboutPage, AuthorsPage, AppRegulations } from './staticPages';
import { GetInitialPropsContext } from '../utils/types';

type StaticPageContent = { component: React.ComponentType; title: string };
const pathToContent: Record<string, StaticPageContent> = {
  '/about': { component: AboutPage, title: 'Jak korzystać? FAQ' },
  '/authors': { component: AuthorsPage, title: 'Autorzy' },
  '/regulations': { component: AppRegulations, title: 'Regulations' },
};

export default class StaticPage extends React.PureComponent<{ asPath: string }> {
  static async getInitialProps(ctx: GetInitialPropsContext) {
    return {
      asPath: ctx.asPath || '',
    };
  }

  render() {
    const canonical = this.props.asPath.replace(/\/+$/, '');
    const content = pathToContent[canonical];
    const Component = content.component;
    return (
      <Layout>
        <div className="container">
          <Component />
        </div>
      </Layout>
    );
  }
}
