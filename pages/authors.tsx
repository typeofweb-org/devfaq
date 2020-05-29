import React from 'react';
import Layout from '../components/layout/Layout';
import './index.scss';
import './staticPage.scss';

export default () => {
  return (
    <Layout title="Autorzy">
      <div className="container">
        <React.Fragment>
          <article className="app-static-page">
            <h2>Autorzy</h2>
            <div className="app-authors">
              <div className="app-author">
                <img
                  src="/images/michal_miszczyszyn.jpg"
                  alt="Michał Miszczyszyn"
                  className="app-author__image"
                />
                <p className="app-author__name">Michał Miszczyszyn</p>
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
          <article className="app-static-page">
            <h3>Specjalne podziękowania</h3>
            <ul>
              <li>
                <a href="http://www.angular.love" target="_blank" rel="noopener">
                  <strong>Tomasz Nastały</strong>
                </a>{' '}
                - za pierwszy frontend aplikacji
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/ewelina-sygut-a8687883/"
                  target="_blank"
                  rel="noopener"
                >
                  <strong>Ewelina Sygut</strong>
                </a>{' '}
                i{' '}
                <a
                  href="https://www.linkedin.com/in/paweł-pawłowski-89917114/"
                  target="_blank"
                  rel="noopener"
                >
                  <strong>Paweł Pawłowski</strong>
                </a>{' '}
                - za projekt graficzny ❤️
              </li>
              <li>
                <a href="https://www.linkedin.com/in/cytrowski" target="_blank" rel="noopener">
                  <strong>Bartosz Cytrowski</strong>
                </a>{' '}
                - za ogromną liczbę świetnych pytań z React
              </li>
            </ul>
          </article>
        </React.Fragment>
      </div>
    </Layout>
  );
};
