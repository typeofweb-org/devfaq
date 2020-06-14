import { renderHook, act } from '@testing-library/react-hooks';
import { createMemoryHistory } from 'history';
import { last } from 'lodash';
import React from 'react';
import { Router } from 'react-router-dom';
import * as Yup from 'yup';

import { useFilter } from './useFilter';

describe('useFilter', () => {
  it('should return parsed query object', () => {
    const exampleSchema = Yup.object({
      user: Yup.number(),
      page: Yup.number().nullable(),
    }).required();

    const history = createMemoryHistory({
      initialEntries: ['/'],
    });
    const wrapper: React.FC = ({ children }) => <Router history={history}>{children}</Router>;
    const { result } = renderHook(() => useFilter(exampleSchema), { wrapper });
    expect(result.current.selected).toEqual({});
  });

  it('should parse query string', () => {
    const exampleSchema = Yup.object({
      user: Yup.number(),
      page: Yup.number().nullable(),
    }).required();

    const history = createMemoryHistory({
      initialEntries: ['/?user=123&page=11'],
    });
    const wrapper: React.FC = ({ children }) => <Router history={history}>{children}</Router>;
    const { result } = renderHook(() => useFilter(exampleSchema), { wrapper });
    expect(result.current.selected).toEqual({
      user: 123,
      page: 11,
    });
  });

  it('allow to change the query', () => {
    const exampleSchema = Yup.object({
      user: Yup.number(),
      page: Yup.number().nullable(),
    }).required();

    const history = createMemoryHistory({
      initialEntries: ['/?user=123&page=11'],
    });
    const wrapper: React.FC = ({ children }) => <Router history={history}>{children}</Router>;
    const { result } = renderHook(() => useFilter(exampleSchema), { wrapper });
    act(() => {
      result.current.updateFilter({
        page: 20,
        user: undefined,
      });
    });
    expect(result.current.selected).toEqual({
      page: 20,
    });
  });

  it('allow to change the query', () => {
    const exampleSchema = Yup.object({
      user: Yup.number(),
      page: Yup.number().nullable(),
    }).required();

    const history = createMemoryHistory({
      initialEntries: ['/?user=123&page=11'],
    });
    const wrapper: React.FC = ({ children }) => <Router history={history}>{children}</Router>;
    const { result } = renderHook(() => useFilter(exampleSchema), { wrapper });
    act(() => {
      result.current.updateFilter({
        page: 20,
        user: undefined,
      });
    });
    expect(result.current.selected).toEqual({
      page: 20,
    });
    expect(last(history.entries)).toHaveProperty('search', '?page=20');
  });

  it('validate query params', () => {
    const exampleSchema = Yup.object({
      user: Yup.number(),
      page: Yup.number().nullable(),
    }).required();

    const history = createMemoryHistory({
      initialEntries: ['/?user=123&page=11'],
    });
    const wrapper: React.FC = ({ children }) => <Router history={history}>{children}</Router>;
    const { result } = renderHook(() => useFilter(exampleSchema), { wrapper });
    expect(() =>
      result.current.updateFilter({
        page: 'aaaa' as any, // invalid!
      }),
    ).toThrowError('page must be a `number` type');
  });
});
