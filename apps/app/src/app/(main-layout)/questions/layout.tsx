import { ReactNode } from "react";
import { Container } from "../../../components/Container";
import { MobileActionButtons } from "../../../components/MobileActionButtons/MobileActionButtons";
import { QuestionsSidebar } from "../../../components/QuestionsSidebar/QuestionsSidebar";

const QuestionsPageLayout = ({ children }: { readonly children: ReactNode }) => (
	<>
		<Container className="flex">
			<QuestionsSidebar />
			<main
				className="w-full min-w-0 flex-1 grow scroll-mt-14 py-4 pl-0 sm:py-8 sm:pl-9"
				id="main-content"
			>
				{children}
			</main>
		</Container>
		<MobileActionButtons />
	</>
);

export default QuestionsPageLayout;
