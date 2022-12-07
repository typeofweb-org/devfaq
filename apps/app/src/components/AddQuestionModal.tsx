import { ComponentProps } from "react";
import { BaseModal } from "./BaseModal";

export const AddQuestionModal = (props: ComponentProps<typeof BaseModal>) => (
	<BaseModal {...props}>ADD QUESTION</BaseModal>
);
