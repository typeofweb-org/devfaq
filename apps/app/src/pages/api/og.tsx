import { NextRequest } from "next/server";
import { ImageResponse } from "@vercel/og";
import { ReactNode } from "react";
import type { ImageResponseOptions } from "@vercel/og";
import { twMerge } from "tailwind-merge";
import Logo from "../../../public/devfaq-logo.svg";
import { TechnologyIcon } from "../../components/TechnologyIcon";
import { validateTechnology } from "../../lib/technologies";
import type { Technology } from "../../lib/technologies";
import { getQuestionById } from "../../services/questions.service";
import { Level, parseQueryLevels } from "../../lib/level";

export const config = {
	runtime: "experimental-edge",
};

const technologies: Technology[] = ["js", "html", "css", "react", "angular", "git"];

const Wrapper = ({ children }: { readonly children: ReactNode }) => (
	<div tw="h-full w-full bg-[#6737b8] flex items-center justify-center">
		<Logo tw="w-[1280px] h-[265px]" />
		{children}
	</div>
);

const QuestionLevel = ({ level, tw }: { level: Level; tw?: string }) => (
	<span
		tw={twMerge(
			"text-6xl w-72 h-24 rounded-full capitalize flex items-center justify-center text-white",
			level === "junior" && "bg-[#439fff]",
			level === "mid" && "bg-[#26be2a]",
			level === "senior" && "bg-[#fbba00]",
			tw,
		)}
	>
		{level}
	</span>
);

export default async function handler(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const options: ImageResponseOptions = { width: 2400, height: 1350 };

		const technology = searchParams.get("technology");
		const questionId = Number.parseInt(searchParams.get("questionId") || "");

		if (technology && validateTechnology(technology)) {
			const levels = parseQueryLevels(searchParams.get("levels"));

			return new ImageResponse(
				(
					<Wrapper>
						<div tw="flex flex-col items-center ml-32">
							<TechnologyIcon technology={technology} tw="w-56 h-56 mb-12" />
							{levels &&
								levels.map((level) => <QuestionLevel key={level} level={level} tw="mb-4" />)}
						</div>
					</Wrapper>
				),
				options,
			);
		}

		if (!Number.isNaN(questionId)) {
			try {
				const {
					data: {
						data: { question, _categoryId, _levelId },
					},
				} = await getQuestionById({ id: questionId });

				return new ImageResponse(
					(
						<Wrapper>
							<div tw="flex flex-col items-center ml-14">
								<h1 tw="text-6xl text-white text-center font-bold max-w-[850px] mb-14">
									{question}
								</h1>
								<TechnologyIcon technology={_categoryId} tw="w-48 h-48 mb-14" />
								<QuestionLevel level={_levelId} />
							</div>
						</Wrapper>
					),
					options,
				);
			} catch (_err) {}
		}

		return new ImageResponse(
			(
				<Wrapper>
					<div tw="flex flex-wrap max-w-[960px] ml-12">
						{technologies.map((technology) => (
							<TechnologyIcon key={technology} technology={technology} isOG tw="w-56 h-56 m-12" />
						))}
					</div>
				</Wrapper>
			),
			options,
		);
	} catch (err) {
		return new Response("Failed to generate the image", {
			status: 500,
		});
	}
}
