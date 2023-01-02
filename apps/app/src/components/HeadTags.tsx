type HeadTagsProps = Readonly<{
	title?: string;
	description?: string;
}>;

export const HeadTags = ({
	title = "",
	description = "DevFAQ.pl — największa baza pytań z programowania tworzona przez społeczność. DevFAQ.pl jest serwisem internetowym służącym do udostępniania i wymiany pytań rekrutacyjnych na stanowiska developerów.",
}: HeadTagsProps) => {
	const formattedTitle = title.trim() ? `${title} • DevFAQ.pl` : `DevFAQ.pl`;
	return (
		<>
			<title>{formattedTitle}</title>
			<meta name="description" content={description} />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<meta property="og:type" content="website" />
			<meta
				property="og:image"
				itemProp="logo image"
				content="https://app.devfaq.pl/img/devfaq-cover-facebook.png"
			/>
			<meta property="og:site_name" content="DevFAQ.pl" />
			<meta property="fb:app_id" content="2005583769700691" />
			<meta property="og:locale" content="pl_PL" />
			<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
			<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
			<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
			<link rel="manifest" href="/manifest.json" />
			<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#673ab7" />
			<meta name="msapplication-TileColor" content="#673ab7" />
			<meta name="msapplication-TileImage" content="/mstile-144x144.png" />
			<meta name="theme-color" content="#673ab7" />
			<meta name="apple-mobile-web-app-capable" content="yes" />
			<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
			<meta name="format-detection" content="telephone=no" />
			<meta name="apple-mobile-web-app-title" content="DevFAQ.pl" />

			<meta property="og:title" itemProp="title name" content={formattedTitle} />
			<meta property="og:description" itemProp="description" content={description} />
		</>
	);
};
