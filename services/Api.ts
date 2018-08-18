import { TechnologyKey } from '../constants/technology-icon-items';
import env from '../utils/env';
import { LevelKey } from '../constants/level';
import { Question } from '../redux/reducers/questions';
import { AuthData, UserData } from '../redux/reducers/auth';
import { GetInitialPropsContext } from '../utils/types';

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

async function makeRequest<T>(
  method: 'GET' | 'POST',
  path: string,
  query: QsObject = {},
  body: object,
  otherOptions: RequestInit,
  ctx?: GetInitialPropsContext
): Promise<T> {
  const querystring = getQueryStringFromObject(query);
  const options: RequestInit = {
    ...otherOptions,
    method,
    headers: {},
    credentials: 'include',
  };

  // proxy cookie from the request to the API
  if (ctx && ctx.isServer && ctx.req.headers && ctx.req.headers.cookie) {
    options.headers = {
      ...options.headers,
      cookie: String(ctx.req.headers.cookie),
    };
  }
  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }
  return fetch(`${env.API_URL}/${path}?${querystring}`, options).then(async res => {
    if (!res.ok) {
      throw await res.json();
    }
    return res.json();
  });
}

export interface CreateQuestionRequestBody {
  question: string;
  category: TechnologyKey;
  level: string;
}

export const Api = {
  async getQuestionsForCategoryAndLevels(
    category: TechnologyKey,
    levels: LevelKey[],
    ctx?: GetInitialPropsContext
  ) {
    return makeRequest<Question[]>('GET', 'questions', { category, level: levels }, {}, {}, ctx);
  },

  async createQuestion(question: CreateQuestionRequestBody, ctx?: GetInitialPropsContext) {
    return makeRequest<Question>('POST', 'questions', {}, question, {}, ctx);
  },

  async logIn(email: string, password: string, ctx?: GetInitialPropsContext) {
    return makeRequest<AuthData>('POST', 'tokens', {}, { email, password }, {}, ctx);
  },

  async getLoggedInUser(ctx?: GetInitialPropsContext) {
    return makeRequest<UserData>('GET', 'tokens/me', {}, {}, {}, ctx);
  },
};
