export interface TechnologyIconItem {
  label: string;
  icon: string;
  name: TechnologyKey;
}

export enum Technology {
  html = 'HTML',
  css = 'CSS',
  js = 'JavaScript',
  angular = 'Angular',
  react = 'React',
  git = 'GIT',
  other = 'Inne',
}

export type TechnologyKey = keyof typeof Technology;

export const technologyIconItems: TechnologyIconItem[] = [
  { name: 'html', label: 'HTML5', icon: 'devicon-html5-plain' },
  { name: 'css', label: 'CSS3', icon: 'devicon-css3-plain' },
  { name: 'js', label: 'JS', icon: 'devicon-javascript-plain' },
  { name: 'angular', label: 'Angular', icon: 'devicon-angularjs-plain' },
  { name: 'react', label: 'React', icon: 'devicon-react-original' },
  { name: 'git', label: 'Git', icon: 'devicon-git-plain' },
  { name: 'other', label: 'Inne', icon: 'devicon-devicon-plain' },
];

type OrderBy = 'acceptedAt' | 'level' | 'votesCount';
type Order = 'asc' | 'desc';
export type SortBy = [OrderBy, Order];
