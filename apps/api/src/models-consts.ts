export const userRoles = ['user', 'admin'] as const;
export type UserRoleUnion = typeof userRoles[number];

export const questionCategories = [
  'html',
  'css',
  'js',
  'angular',
  'react',
  'git',
  'other',
] as const;
export type QuestionCategoryUnion = typeof questionCategories[number];

export const questionLevels = ['junior', 'mid', 'senior'] as const;
export type QuestionLevelUnion = typeof questionLevels[number];

export const questionStatuses = ['accepted', 'pending'] as const;
export type QuestionStatusUnion = typeof questionStatuses[number];
