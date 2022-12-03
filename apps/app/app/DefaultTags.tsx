type DefaultTagsProps = Readonly<{
	title?: string;
	description?: string;
}>;

export const DefaultTags = ({ title = "", description = "" }: DefaultTagsProps) => (
	<>
		<title key="title">{`DevFAQ.pl • ${title}`}</title>
		<meta key="description" name="description" content={description} />
	</>
);
