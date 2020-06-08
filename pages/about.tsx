import type { NextComponentType } from 'next';
import React from 'react';

import { Container } from '../components/container/Container';
import Layout from '../components/layout/Layout';

import styles from './staticPage.module.scss';

const AboutPage: NextComponentType = () => {
  return (
    <Layout title="Jak korzystać? FAQ">
      <Container>
        <article className={styles.appStaticPage}>
          <h2>Jak korzystać? FAQ</h2>
          <h3>Co to jest DevFAQ.pl?</h3>
          <p>
            DevFAQ.pl jest serwisem internetowym służącym do udostępniania i wymiany pytań
            rekrutacyjnych na stanowiska front-end developerów oraz inne pokrewne. Został stworzony
            przez programistów dla programistów, a jego celem jest wymiana wiedzy oraz możliwość
            przygotowania się do rozmów rekrutacyjnych.
          </p>

          <h3>Jak można dodać pytanie?</h3>
          <p>
            Każdy użytkownik DevFAQ może dodać treść pytania, przydzielić mu kategorię oraz poziom
            trudności. Następnie po kliknięciu „Dodaj” pytanie trafia do moderacji. Po
            zaakceptowaniu przez administratorów, pojawi się na stronie. Może to zająć kilka dni!
          </p>

          <h3>Jakie są ogólne zasady korzystania z serwisu?</h3>
          <ul>
            <li>W treści nie podawaj nazwy firmy, w której padło pytanie.</li>
            <li>
              Przed dodaniem pytania, upewnij się czy treść jest wolna od błędów ortograficznych,
              zaoszczędzisz pracy moderacji.
            </li>
            <li>Pytanie niezwiązane z technologiami (np. miękkie) umieść w kategorii INNE</li>
            <li>
              Jeśli dodajesz kod do pytania, zadbaj o poprawne formatowanie (spacje, wcięcia itp.).
            </li>
            <li>
              Wszystkie pytania są moderowane. Moderatorzy dbają również o to, aby pytania się nie
              powtarzały.
            </li>
          </ul>

          <h3>Czy mogę formatować jakoś treść dodawanych pytań?</h3>
          <p>Tak! Możesz skorzystać z powszechnie znanego Markdown:</p>
          <ul>
            <li>``` Code block ```</li>
            <li>`Inline code`</li>
            <li>*Italic*</li>
            <li>**Bold**</li>
            <li>[Link](http://a.com)</li>
            <li>* List</li>
          </ul>

          <h4>Przykład użycia</h4>
          <p>Przykładowe pytanie napisane w Markdown może wyglądać tak:</p>

          <pre>
            Czy funkcja `sayHello` zwraca **string**?{'\n'}
            ```javascript
            {`
        function sayHello() {
          return 'Hello World';
        }
        `}
            {/* prettier-ignore */ '```'}
          </pre>

          <p>
            Więcej informacji na temat Markdown oraz kompletną dokumentację znajdziesz na stronie{' '}
            <a href="http://commonmark.org/" target="_blank" rel="noopener noreferrer">
              CommonMark
            </a>
            .
          </p>
        </article>
      </Container>
    </Layout>
  );
};

export default AboutPage;
