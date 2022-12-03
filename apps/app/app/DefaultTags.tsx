type DefaultTagsProps = Readonly<{
	title?: string;
	description?: string;
}>;

export const DefaultTags = ({ title = "", description = "" }: DefaultTagsProps) => (
	<>
		<title>{`DevFAQ.pl • ${title}`}</title>
		<meta name="description" content={description} />
	</>
);
