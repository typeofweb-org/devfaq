import { TechnologyKey } from '../constants/technology-icon-items';
const API_URL = 'http://api.fefaq.pl';

export const Api = {
  getQuestionsForCategory(category: TechnologyKey) {
    return fetch(`${API_URL}/questions?category=${category}`).then((res) => res.json());
  },
};
