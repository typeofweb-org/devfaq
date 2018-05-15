import { TechnologyKey } from '../constants/technology-icon-items';
import env from '../utils/env';

export const Api = {
  getQuestionsForCategory(category: TechnologyKey) {
    return fetch(`${env.API_URL}/questions?category=${category}`).then((res) => res.json());
  },
};
