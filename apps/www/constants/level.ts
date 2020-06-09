export enum Level {
  junior = 'Junior',
  mid = 'Mid',
  senior = 'Senior',
}

export const levelsWithLabels = (Object.keys(Level) as LevelKey[]).map((value) => ({
  value,
  label: Level[value],
}));

export type LevelWithLabel = typeof levelsWithLabels[0];

export type LevelKey = keyof typeof Level;
