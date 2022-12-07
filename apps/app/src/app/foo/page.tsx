import { QuestionItem } from "../../components/QuestionItem/QuestionItem";

export default function FooPage() {
	return (
		<div className="flex flex-col gap-y-10 p-10">
			<QuestionItem
				title="Co się stanie gdy EventEmitter wyemituje event 'error', a nic na niego nie
				nasłuchuje?"
				level="junior"
				creationDate={new Date("2023-01-01")}
				votes={1}
				isVoted={false}
			/>
			<QuestionItem
				title="Co się stanie gdy EventEmitter wyemituje event 'error', a nic na niego nie
				nasłuchuje?"
				level="mid"
				creationDate={new Date("2023-01-01")}
				votes={2}
				isVoted={true}
			/>
			<QuestionItem
				title="Co się stanie gdy EventEmitter wyemituje event 'error', a nic na niego nie
				nasłuchuje?"
				level="senior"
				creationDate={new Date("2023-01-01")}
				votes={3}
				isVoted={true}
			/>
		</div>
	);
}
