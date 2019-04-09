export enum USER_ROLE {
  USER = 'user',
  ADMIN = 'admin',
}
export const userRoles: USER_ROLE[] = Object.values(USER_ROLE);

export enum QUESTION_CATEGORY {
  HTML = 'html',
  CSS = 'css',
  JS = 'js',
  ANGULAR = 'angular',
  REACT = 'react',
  GIT = 'git',
  OTHER = 'other',
}
export const questionCategories: QUESTION_CATEGORY[] = Object.values(QUESTION_CATEGORY);

export enum QUESTION_LEVEL {
  JUNIOR = 'junior',
  MID = 'mid',
  SENIOR = 'senior',
}
export const questionLevels: QUESTION_LEVEL[] = Object.values(QUESTION_LEVEL);

export enum QUESTION_STATUS {
  ACCEPTED = 'accepted',
  PENDING = 'pending',
}
export const questionStatuses: QUESTION_STATUS[] = Object.values(QUESTION_STATUS);
