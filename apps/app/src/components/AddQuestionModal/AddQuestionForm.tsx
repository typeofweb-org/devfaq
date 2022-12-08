"use client";

import { FormEvent, ReactNode } from "react";

export const AddQuestionForm = ({ children }: { readonly children: ReactNode }) => {
	const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		console.log("submit");
	};

	return <form onSubmit={handleFormSubmit}>{children}</form>;
};
