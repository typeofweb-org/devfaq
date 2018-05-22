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

async function makeRequest<T>(method: 'GET' | 'POST', path: string, query: QsObject = {}, body = {}): Promise<T> {
  const querystring = getQueryStringFromObject(query);
  const options: RequestInit = { method };
  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }
  return fetch(`${env.API_URL}/${path}?${querystring}`, options).then(async (res) => {
    if (!res.ok) {
      throw await res.json();
    }
    return res.json();
  });
}

export type CreateQuestionRequestBody = {
  question: string;
  category: TechnologyKey;
  level: string;
};

export const Api = {
  async getQuestionsForCategoryAndLevels(category: TechnologyKey, levels: LevelKey[]) {
    return makeRequest<Question[]>('GET', 'questions', { category, level: levels });
  },

  async createQuestion(question: CreateQuestionRequestBody) {
    return makeRequest<Question>('POST', 'questions', {}, question);
  },
};
