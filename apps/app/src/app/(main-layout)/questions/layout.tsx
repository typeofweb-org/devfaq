import { ReactNode } from "react";
import { Container } from "../../../components/Container";
import { MobileActionButtons } from "../../../components/MobileActionButtons/MobileActionButtons";
import { QuestionsSidebar } from "../../../components/QuestionsSidebar/QuestionsSidebar";

const QuestionsPageLayout = ({ children }: { readonly children: ReactNode }) => (
	<>
		<Container className="flex">
			<QuestionsSidebar />
			<main className="w-full grow py-4 pl-0 sm:py-8 sm:pl-11">{children}</main>
		</Container>
		<MobileActionButtons />
	</>
);

export default QuestionsPageLayout;
