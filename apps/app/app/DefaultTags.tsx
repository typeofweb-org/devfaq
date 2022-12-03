type DefaultTagsProps = Readonly<{
	title?: string;
	description?: string;
}>;

export const DefaultTags = ({ title = "", description = "" }: DefaultTagsProps) => (
	<>
		<title>{`DevFAQ.pl • ${title}`}</title>
		<meta name="description" content={description} />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
		<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
	</>
);
