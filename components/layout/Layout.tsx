import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { memo } from 'react';

import env from '../../utils/env';
import { AppFooter } from '../footer/AppFooter';
import { CtaHeader } from '../headers/ctaHeader/CtaHeader';
import { NavigationHeader } from '../headers/navigationHeader/NavigationHeader';

import { AppSpinner } from './AppSpinner';
import styles from './layout.module.scss';

interface LayoutProps {
  title?: string;
  description?: string;
}
const Layout: React.FC<LayoutProps> = memo(
  ({
    title = 'Front-end Frequently Asked Questions',
    description = 'DevFAQ.pl — największa baza pytań z front-endu tworzona przez społeczność. DevFAQ.pl jest serwisem internetowym służącym do udostępniania i wymiany pytań rekrutacyjnych na stanowiska front-end developerów.',
    children,
  }) => {
    const router = useRouter();
    return (
      <>
        <Head>
          <title key="title">DevFAQ.pl • {title}</title>
          <meta key="description" name="description" content={description} />
          <meta property="og:title" itemProp="title name" content={`DevFAQ.pl • ${title}`} />
          <meta property="og:description" itemProp="description" content={description} />
          <meta property="og:url" itemProp="url" content={`${env.ABSOLUTE_URL}${router.asPath}`} />
        </Head>
        <div className={styles.appRoot}>
          <AppSpinner />
          <NavigationHeader />
          <CtaHeader />
          <div className={styles.appContent}>{children}</div>
          <AppFooter />
        </div>
      </>
    );
  }
);

export default Layout;
