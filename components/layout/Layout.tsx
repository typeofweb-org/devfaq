import Head from 'next/head';
import React from 'react';
import NavigationHeader from '../headers/navigationHeader/NavigationHeader';
import styles from './layout.module.scss';
import CtaHeader from '../headers/ctaHeader/CtaHeader';
import AppFooter from '../footer/AppFooter';
import AppSpinner from './AppSpinner';
import env from '../../utils/env';
import { withRouter, NextRouter } from 'next/router';

interface LayoutProps {
  title?: string;
  description?: string;
  router: NextRouter;
}

class Layout extends React.Component<LayoutProps> {
  static defaultProps = {
    title: 'Front-end Frequently Asked Questions',
    description:
      'DevFAQ.pl — największa baza pytań z front-endu tworzona przez społeczność. DevFAQ.pl jest serwisem internetowym służącym do udostępniania i wymiany pytań rekrutacyjnych na stanowiska front-end developerów.',
  };

  render() {
    const { title, description, children } = this.props;
    return (
      <React.Fragment>
        <Head>
          <title key="title">DevFAQ.pl • {title}</title>
          <meta key="description" name="description" content={description} />
          <meta property="og:title" itemProp="title name" content={`DevFAQ.pl • ${title}`} />
          <meta property="og:description" itemProp="description" content={description} />
          <meta
            property="og:url"
            itemProp="url"
            content={`${env.ABSOLUTE_URL}${this.props.router!.asPath}`}
          />
        </Head>
        <div className={styles.appRoot}>
          <AppSpinner />
          <NavigationHeader />
          <CtaHeader />
          <div className={styles.appContent}>{children}</div>
          <AppFooter />
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter<LayoutProps>(Layout);
