import { CtaHeader } from "../../components/CtaHeader/CtaHeader";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer";
import { AppModals } from "../../components/AppModals";
import { SkipToTheContent } from "../../components/SkipToTheContent";

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<AppModals />
			<SkipToTheContent />
			<Header />
			<CtaHeader />
			{children}
			<Footer />
		</>
	);
}
