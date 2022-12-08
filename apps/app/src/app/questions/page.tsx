import { Container } from "../../components/Container";
import { QuestionsSidebar } from "../../components/QuestionsSidebar/QuestionsSidebar";

const QuestionsPage = () => {
	return (
		<Container className="flex">
			<QuestionsSidebar />
			<div className="h-[1200px] w-12 grow" />
		</Container>
	);
};

export default QuestionsPage;
