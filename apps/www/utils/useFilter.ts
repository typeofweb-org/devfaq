import { object, literals, array, tuple, number, string } from 'myzod';
import { ObjectType, ObjectShape, Infer } from 'myzod/libs/types';
import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';

import { Level } from '../constants/level';
import { Technology, SortBy } from '../constants/technology-icon-items';

import { hrefQueryToAsPath } from './redirect';
import { keys } from './utils';

export const useFilter = <T extends ObjectShape>(schema: ObjectType<T>) => {
  type Schema = Infer<typeof schema>;

  const router = useRouter();
  const query = router.query;

  // legacy
  if (typeof query.sortBy === 'string' && query.sortBy.includes('*')) {
    query.sortBy = query.sortBy.replace('*', ',');
  }

  const parsedQuery = schema.parse(query, {
    allowUnknown: true,
  });

  const selected = useMemo(() => {
    return Object.fromEntries(Object.entries(parsedQuery).filter(([_key, val]) => val != null));
  }, [parsedQuery]) as Schema;

  const updateFilter = useCallback(
    (values: Partial<Schema>, shallow = true) => {
      const newQuery = Object.fromEntries(
        Object.entries({
          ...router.query,
          ...values,
        }).filter(([_key, val]) =>
          val == null || (Array.isArray(val) && val.length === 0) ? false : true
        )
      );
      const result = hrefQueryToAsPath(router.route, newQuery);
      router.push(result.href, result.as, {
        shallow,
      });
    },
    [router]
  );

  return { selected, updateFilter };
};

const queryStringToArray = (str: string) => (str ? str.split(/[,*]/) : []);
const selectedLevelsItemsSchema = array(literals('junior', 'senior', 'mid'));
const sortByItemsSchema = tuple([
  literals('acceptedAt', 'level', 'votesCount'),
  literals('asc', 'desc'),
]);

export const useQuestionsFilter = () => {
  const result = useFilter(
    object({
      page: number().coerce().default(1),
      technology: literals(...keys(Technology)),
      selectedLevels: array(literals(...keys(Level)), {
        default: [],
        coerce: (selectedLevels) =>
          selectedLevelsItemsSchema.parse(queryStringToArray(selectedLevels)),
      }).optional(),
      sortBy: array(string(), {
        default: [],
        coerce: (sortBy) => sortByItemsSchema.parse(queryStringToArray(sortBy)),
      }).optional(),
    })
  );

  // some additional type-safety
  type UseFilterResult = Omit<typeof result, 'selected'> & {
    selected: Omit<typeof result.selected, 'selectedLevels' | 'sortBy'> & {
      selectedLevels?: Infer<typeof selectedLevelsItemsSchema>;
      sortBy?: Infer<typeof sortByItemsSchema>;
    };
  };

  return result as UseFilterResult;
};
