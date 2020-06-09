import { pickBy, isUndefined } from 'lodash';

import { LevelKey } from '../constants/level';
import { TechnologyKey, SortBy } from '../constants/technology-icon-items';
import type { AuthData, SessionData, UserData } from '../redux/reducers/auth';
import type { Question } from '../redux/reducers/questions';
import env from '../utils/env';
import type { GetInitialPropsContext } from '../utils/types';

const omitUndefined = <T extends object>(obj: T) => pickBy(obj, (v) => !isUndefined(v));

type QsValues = string | number;
type QsObject = Record<string, QsValues | QsValues[]>;

function shouldSkipVal(val: any): boolean {
  return val == null || val.length === 0;
}

function getQueryStringFromObject(query: QsObject): string {
  const enc = encodeURIComponent;
  return Object.entries(query)
    .filter(([key, val]) => !shouldSkipVal(key) && !shouldSkipVal(val))
    .map(([key, val]) => {
      if (Array.isArray(val)) {
        return val.map((item) => `${enc(key)}=${enc(String(item))}`).join('&');
      } else {
        return `${enc(key)}=${enc(String(val))}`;
      }
    })
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

export type ApiResponse<T> = {
  data: T;
  meta?: {
    total: number;
  };
};

async function makeRequest<T>(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  path: string,
  query: QsObject = {},
  body: object,
  otherOptions: RequestInit,
  ctx?: GetInitialPropsContext
): Promise<ApiResponse<T>> {
  const querystring = getQueryStringFromObject(query);
  const options: RequestInit = {
    ...otherOptions,
    method,
    headers: {},
    credentials: 'include',
  };

  // proxy cookie from the request to the API
  if (ctx && ctx.req && ctx.req.headers && ctx.req.headers.cookie) {
    options.headers = {
      ...options.headers,
      cookie: String(ctx.req.headers.cookie),
    };
  }
  if (body && method !== 'GET' && method !== 'DELETE') {
    options.body = JSON.stringify(body);
  }
  return fetch(`${env.API_URL}/${path}?${querystring}`, options).then(async (res) => {
    if (!res.ok) {
      throw await getJSON(res);
    }
    return getJSON(res);
  });
}

async function openAndWaitForClose(url: string) {
  let intervalTimerId: number;
  let timeoutTimerId: number;

  const cancel = () => {
    window.clearTimeout(timeoutTimerId);
    window.clearInterval(intervalTimerId);
  };

  const propsToQuery = (props: Record<string, string | number>) => {
    return Object.entries(props)
      .map(([key, val]) => `${key}=${val}`)
      .join(', ');
  };

  return new Promise<any>((resolve, reject) => {
    const width = 925;
    const height = 680;
    const top = (window.top.outerHeight / 2 + window.top.screenY - height / 2) * 0.5;
    const left = window.top.outerWidth / 2 + window.top.screenX - width / 2;

    const popupHandle = window.open(
      url,
      'GitHubLogin',
      propsToQuery({
        toolbar: 'no',
        location: 'no',
        directories: 'no',
        status: 'no',
        menubar: 'no',
        scrollbars: 'no',
        resizable: 'no',
        copyhistory: 'no',
        width,
        height,
        top,
        left,
      })
    );
    if (!popupHandle) {
      return reject(new Error('Window not created!'));
    }

    intervalTimerId = window.setInterval(() => {
      if (popupHandle.closed) {
        cancel();
        return resolve();
      }
    }, 100);

    timeoutTimerId = window.setTimeout(() => {
      cancel();
      return reject(new Error('Timeout'));
    }, 60000);
  });
}

export interface CreateQuestionRequestBody {
  question: string;
  category: TechnologyKey;
  level: string;
}

export const PAGE_SIZE = 25;

export const Api = {
  async getQuestionsForCategoryAndLevelsAndStatus(
    page: number | null,
    sortBy: SortBy | undefined,
    category: TechnologyKey | undefined,
    level: LevelKey[],
    status?: 'pending' | 'accepted',
    abortController?: AbortController,
    ctx?: GetInitialPropsContext
  ) {
    const limit = PAGE_SIZE;
    const offset = PAGE_SIZE * ((page || 1) - 1);

    return makeRequest<Question[]>(
      'GET',
      'questions',
      omitUndefined({
        category,
        level,
        status,
        ...(page !== null && { limit, offset }),
        ...(sortBy && { orderBy: sortBy[0], order: sortBy[1] }),
      }) as {},
      {},
      { ...(abortController && { signal: abortController.signal }) },
      ctx
    );
  },

  async getQuestionsForCategoryAndLevels(
    page: number,
    sortBy: SortBy | undefined,
    category: TechnologyKey,
    levels: LevelKey[],
    abortController?: AbortController,
    ctx?: GetInitialPropsContext
  ) {
    const status = 'accepted';
    return Api.getQuestionsForCategoryAndLevelsAndStatus(
      page,
      sortBy,
      category,
      levels,
      status,
      abortController,
      ctx
    );
  },

  async getOneQuestion(id: Question['id'], ctx?: GetInitialPropsContext) {
    return makeRequest<Question>('GET', `questions/${id}`, {}, {}, {}, ctx);
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
    return makeRequest<SessionData>('GET', 'oauth/me', {}, {}, {}, ctx);
  },

  async upvoteQuestion(
    { questionId, userId }: { questionId: Question['id']; userId: UserData['id'] },
    ctx?: GetInitialPropsContext
  ) {
    return makeRequest<{}>(
      'POST',
      'question-votes',
      {
        _questionId: questionId,
        _userId: userId,
      },
      {},
      {},
      ctx
    );
  },

  async downvoteQuestion(
    { questionId, userId }: { questionId: Question['id']; userId: UserData['id'] },
    ctx?: GetInitialPropsContext
  ) {
    return makeRequest<{}>(
      'DELETE',
      'question-votes',
      {
        _questionId: questionId,
        _userId: userId,
      },
      {},
      {},
      ctx
    );
  },

  async logInWithGitHub() {
    const url = `${env.API_URL}/oauth/github`;
    return openAndWaitForClose(url);
  },
};
