import Head from 'next/head';
import * as React from 'react';
import NavigationHeader from '../headers/navigationHeader/NavigationHeader';
import './layout.scss';
import CtaHeader from '../headers/ctaHeader/CtaHeader';
import AppFooter from '../footer/AppFooter';
import AppSpinner from './AppSpinner';
import env from '../../utils/env';
import { withRouter, WithRouterProps } from 'next/router';

interface LayoutProps {
  title?: string;
  description?: string;
}

class Layout extends React.Component<LayoutProps & WithRouterProps> {
  static defaultProps = {
    title: 'Front-end Frequently Asked Questions',
    description:
      'Fefaq.pl — największa baza pytań z front-endu tworzona przez społeczność. Fefaq.pl jest serwisem internetowym służącym do udostępniania i wymiany pytań rekrutacyjnych na stanowiska front-end developerów.',
  };

  render() {
    const { title, description, children } = this.props;
    return (
      <React.Fragment>
        <Head>
          <title key="title">Fefaq.pl • {title}</title>
          <meta key="description" name="description" content={description} />
          <meta property="og:title" itemProp="title name" content={`Fefaq.pl • ${title}`} />
          <meta property="og:description" itemProp="description" content={description} />
          <meta
            property="og:url"
            itemProp="url"
            content={`${env.ABSOLUTE_URL}${this.props.router!.asPath}`}
          />
        </Head>
        <div className="app-root">
          <AppSpinner />
          <NavigationHeader />
          <CtaHeader />
          <div className="app-content">{children}</div>
          <AppFooter />
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter<LayoutProps>(Layout);
