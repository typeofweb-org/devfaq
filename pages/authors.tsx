import React from 'react';
import Layout from '../components/layout/Layout';
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
                  src="/images/tomasz_nastaly.jpg"
                  alt="Tomasz Nastały"
                  className="app-author__image"
                />
                <p className="app-author__name">Tomasz Nastały</p>
                <p>
                  JavaScript Developer, entuzjasta frameworka Angular. Prowadzi bloga{' '}
                  <a href="http://www.angular.love">angular.love</a>. Na co dzień lubi dzielić się
                  wiedzą poprzez prowadzenie zajęć w jednym z trójmieskich bootcampów i nagrywaniem
                  kursów z Angulara.
                </p>
              </div>
              <div className="app-author">
                <img
                  src="/images/michal_miszczyszyn.jpg"
                  alt="Michał Miszczyszyn"
                  className="app-author__image"
                />
                <p className="app-author__name">Michał Miszczyszyn</p>
                <p>
                  Michał jest programistą JavaScript z wieloma latami profesjonalnego doświadczenia.
                  Organizator meet.js Summit i meet.js Gdańsk. Bloger na{' '}
                  <a href="https://typeofweb.com">typeofweb.com</a>, a okazyjnie także prelegent.
                </p>
              </div>
            </div>
          </article>
          <article className="app-static-page">
            <h3>Specjalne podziękowania</h3>
            <ul>
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
