import { StaticPageContainer } from "../../../components/StaticPageContainer";

export default function AboutPage() {
	return (
		<StaticPageContainer>
			<article className="prose dark:prose-invert">
				<h1>Jak korzystać? FAQ</h1>
				<h2>Co to jest DevFAQ.pl?</h2>
				<p>
					DevFAQ.pl jest serwisem internetowym służącym do udostępniania i wymiany pytań
					rekrutacyjnych na stanowiska developerów oraz inne pokrewne. Został stworzony przez
					programistów dla programistów, a jego celem jest wymiana wiedzy oraz możliwość
					przygotowania się do rozmów rekrutacyjnych.
				</p>

				<h2>Jak można dodać pytanie?</h2>
				<p>
					Każdy użytkownik DevFAQ może dodać treść pytania, przydzielić mu kategorię oraz poziom
					trudności. Następnie po kliknięciu „Dodaj” pytanie trafia do moderacji. Po zaakceptowaniu
					przez administratorów, pojawi się na stronie. Może to zająć kilka dni!
				</p>

				<h2>Jakie są ogólne zasady korzystania z serwisu?</h2>
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

				<h2>Czy mogę formatować jakoś treść dodawanych pytań?</h2>
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
					Czy funkcja `sayHello` zwraca **string**?{"\n"}
					```javascript
					{`
function sayHello() {
  return 'Hello World';
}
`}
					```
				</pre>

				<p>
					Więcej informacji na temat Markdown oraz kompletną dokumentację znajdziesz na stronie{" "}
					<a href="http://commonmark.org/" target="_blank" rel="noopener noreferrer">
						CommonMark
					</a>
					.
				</p>
			</article>
		</StaticPageContainer>
	);
}
