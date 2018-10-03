import { TechnologyKey } from '../constants/technology-icon-items';
import env from '../utils/env';
import { LevelKey } from '../constants/level';
import { Question } from '../redux/reducers/questions';
import { AuthData, UserData } from '../redux/reducers/auth';
import { GetInitialPropsContext } from '../utils/types';
import { pickBy, isUndefined } from 'lodash';

const omitUndefined = <T extends object>(obj: T) => pickBy(obj, v => !isUndefined(v));

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

async function getJSON(res: Response) {
  const contentType = res.headers.get('Content-Type');
  const emptyCodes = [204, 205];

  if (!emptyCodes.includes(res.status) && contentType && contentType.includes('json')) {
    return res.json();
  } else {
    return Promise.resolve();
  }
}

async function makeRequest<T>(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
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
  if (body && method !== 'GET' && method !== 'DELETE') {
    options.body = JSON.stringify(body);
  }
  return fetch(`${env.API_URL}/${path}?${querystring}`, options).then(async res => {
    if (!res.ok) {
      throw await getJSON(res);
    }
    return getJSON(res);
  });
}

export interface CreateQuestionRequestBody {
  question: string;
  category: TechnologyKey;
  level: string;
}

export const Api = {
  async getQuestionsForCategoryAndLevelsAndStatus(
    category: TechnologyKey | undefined,
    levels: LevelKey[],
    status?: 'pending' | 'accepted',
    ctx?: GetInitialPropsContext
  ) {
    return makeRequest<Question[]>(
      'GET',
      'questions',
      omitUndefined({ category, level: levels, status }) as {},
      {},
      {},
      ctx
    );
  },

  async getQuestionsForCategoryAndLevels(
    category: TechnologyKey,
    levels: LevelKey[],
    ctx?: GetInitialPropsContext
  ) {
    return Api.getQuestionsForCategoryAndLevelsAndStatus(category, levels, undefined, ctx);
  },

  async createQuestion(question: CreateQuestionRequestBody, ctx?: GetInitialPropsContext) {
    return makeRequest<Question>('POST', 'questions', {}, question, {}, ctx);
  },

  async updateQuestion(
    questionId: Question['id'],
    question: CreateQuestionRequestBody & { status?: 'accepted' | 'pending' },
    ctx?: GetInitialPropsContext
  ) {
    return makeRequest<Question>('PATCH', `questions/${questionId}`, {}, question, {}, ctx);
  },

  async deleteQuestion(questionId: Question['id'], ctx?: GetInitialPropsContext) {
    return makeRequest<{}>('DELETE', `questions/${questionId}`, {}, {}, {}, ctx);
  },

  async logIn(email: string, password: string, ctx?: GetInitialPropsContext) {
    return makeRequest<AuthData>('POST', 'tokens', {}, { email, password }, {}, ctx);
  },

  async getLoggedInUser(ctx?: GetInitialPropsContext) {
    return makeRequest<UserData>('GET', 'tokens/me', {}, {}, {}, ctx);
  },
};
