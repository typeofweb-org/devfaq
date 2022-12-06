import { QuestionItem } from "../../components/QuestionItem/QuestionItem";

export default function FooPage() {
	return (
		<div className="flex flex-col gap-y-10 p-10">
			<QuestionItem
				title="Co się stanie gdy EventEmitter wyemituje event 'error', a nic na niego nie
				nasłuchuje?"
				level="junior"
			/>
			<QuestionItem
				title="Co się stanie gdy EventEmitter wyemituje event 'error', a nic na niego nie
				nasłuchuje?"
				level="mid"
			/>
			<QuestionItem
				title="Co się stanie gdy EventEmitter wyemituje event 'error', a nic na niego nie
				nasłuchuje?"
				level="senior"
			/>
		</div>
	);
}
