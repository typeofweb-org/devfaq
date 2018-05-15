import { TechnologyKey } from '../constants/technology-icon-items';
import env from '../utils/env';
import { LevelKey } from '../constants/level';
import { Question } from '../redux/reducers/questions';

type QsValues = string | number;
type QsObject = Record<string, QsValues | QsValues[]>;

function shouldSkipVal(val: any): boolean {
  return val == null || val.length === 0;
}

function getQueryStringFromObject(query: QsObject): string {
  const enc = encodeURIComponent;
  return Object.entries(query)
    .filter(([key, val]) => !shouldSkipVal(key) && !shouldSkipVal(val))
    .map(([key, val]) => `${enc(key)}=${enc(String(val))}`)
    .join('&');
}

async function makeRequest<T>(path: string, query: QsObject = {}): Promise<T> {
  const querystring = getQueryStringFromObject(query);
  return fetch(`${env.API_URL}/${path}?${querystring}`).then(async (res) => {
    if (!res.ok) {
      throw await res.json();
    }
    return res.json();
  });
}

export const Api = {
  async getQuestionsForCategoryAndLevels(category: TechnologyKey, levels: LevelKey[]) {
    return makeRequest<Question[]>('questions', { category, level: levels });
  },
};
