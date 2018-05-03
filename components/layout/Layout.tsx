import Head from 'next/head';
import * as React from 'react';
import NavigationHeader from '../headers/navigationHeader/NavigationHeader';
import './layout.scss';

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
          <NavigationHeader />
          {children}
        </div>
      </React.Fragment>
    );
  }
}
