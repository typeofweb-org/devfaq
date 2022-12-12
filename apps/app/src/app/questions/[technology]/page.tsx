import { redirect } from "next/navigation";

export default function TechnologyPage({ params }: { params: { technology: string } }) {
	return redirect(`/questions/${params.technology}/1`);
}
