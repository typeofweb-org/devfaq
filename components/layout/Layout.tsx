import Head from 'next/head';
import * as React from 'react';
import NavigationHeader from '../headers/navigationHeader/NavigationHeader';
import './layout.scss';
import CtaHeader from '../headers/ctaHeader/CtaHeader';
import AppFooter from '../footer/AppFooter';
import AppSpinner from './AppSpinner';

type LayoutProps = {
  title?: string;
  description?: string;
};

export default class Layout extends React.Component<LayoutProps> {
  static defaultProps = {
    title: 'Fefaq.pl - Front-end Frequently Asked Questions',
    description:
      'Fefaq.pl - największa baza pytań z front-endu tworzona przez społeczność. Fefaq.pl jest serwisem internetowym służącym do udostępniania i wymiany pytań rekrutacyjnych na stanowiska front-end developerów.',
  };

  render() {
    const { title, description, children } = this.props;
    return (
      <React.Fragment>
        <Head>
          <title key="title">{title}</title>
          <meta key="description" name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
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
