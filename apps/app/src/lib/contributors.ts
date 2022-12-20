import Contributors from "../all-contributorsrc.json";

export type Contributor = typeof Contributors.contributors[number];
export const getAllContributors = () => Contributors.contributors;
