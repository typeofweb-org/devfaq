import type { NextComponentType } from 'next';
import React from 'react';

import { Container } from '../components/container/Container';
import Layout from '../components/layout/Layout';

import styles from './staticPage.module.scss';

const AuthorsPage: NextComponentType = () => {
  return (
    <Layout title="Autorzy">
      <Container>
        <>
          <article className={styles.appStaticPage}>
            <h2>Autorzy</h2>
            <div className={styles.appAuthors}>
              <div className={styles.appAuthor}>
                <img
                  src="/images/michal_miszczyszyn.jpg"
                  alt="Michał Miszczyszyn"
                  className={styles.appAuthorImage}
                />
                <p className={styles.appAuthorName}>Michał Miszczyszyn</p>
                <p>
                  Zmotywowany full-stack, który nie boi się żadnej technologii. Doświadczony
                  programista i leader zespołów. Przedsiębiorca, aktywista, bloger na{' '}
                  <a href="https://typeofweb.com">typeofweb.com</a>, prelegent i nauczyciel.
                </p>
                <p>
                  Współpraca:{' '}
                  <a href="https://typeofweb.com/wspolpraca/">
                    Współpraca z Michałem Miszczyszynem
                  </a>
                </p>
                <p>
                  LinkedIn:{' '}
                  <a href="https://www.linkedin.com/in/mmiszczyszyn/">
                    Michał Miszczyszyn na LinkedIn
                  </a>
                </p>
              </div>
            </div>
          </article>
          <article className={styles.appStaticPage}>
            <h3>Specjalne podziękowania</h3>
            <ul>
              <li>
                <a href="http://www.angular.love" target="_blank" rel="noreferrer noopener">
                  <strong>Tomasz Nastały</strong>
                </a>{' '}
                - za pierwszy frontend aplikacji
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/ewelina-sygut-a8687883/"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <strong>Ewelina Sygut</strong>
                </a>{' '}
                i{' '}
                <a
                  href="https://www.linkedin.com/in/paweł-pawłowski-89917114/"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <strong>Paweł Pawłowski</strong>
                </a>{' '}
                - za projekt graficzny ❤️
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/cytrowski"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <strong>Bartosz Cytrowski</strong>
                </a>{' '}
                - za ogromną liczbę świetnych pytań z React
              </li>
            </ul>
          </article>
        </>
      </Container>
    </Layout>
  );
};
export default AuthorsPage;
