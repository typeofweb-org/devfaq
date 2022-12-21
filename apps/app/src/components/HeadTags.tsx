type HeadTagsProps = Readonly<{
	title?: string;
	description?: string;
}>;

export const HeadTags = ({
	title = "",
	description = "DevFAQ.pl — największa baza pytań z programowania tworzona przez społeczność. DevFAQ.pl jest serwisem internetowym służącym do udostępniania i wymiany pytań rekrutacyjnych na stanowiska developerów.",
}: HeadTagsProps) => (
	<>
		<title>{title.trim() ? `${title} • DevFAQ.pl` : `DevFAQ.pl`}</title>
		<meta name="description" content={description} />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
		<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
	</>
);
