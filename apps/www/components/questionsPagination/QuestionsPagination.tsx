import React, { memo } from 'react';
import { useSelector } from 'react-redux';

import { PAGE_SIZE } from '../../services/Api';
import { useQuestionsFilter } from '../../utils/useFilter';
import { ActiveLink } from '../activeLink/ActiveLink';

import styles from './questionsPagination.module.scss';

const QuestionsPagination = memo(() => {
  const filter = useQuestionsFilter();
  const total = useSelector((state) => state.questions?.data?.meta?.total);

  if (!total || total <= PAGE_SIZE) {
    return null;
  }

  const pages = Math.ceil(total / PAGE_SIZE);

  return (
    <footer className={styles.questionsPagination}>
      <ul>
        {Array.from({ length: pages }).map((_, i) => {
          const query = {
            ...filter.selected,
            page: String(i + 1),
          };

          return (
            <li key={i}>
              <ActiveLink
                exact={true}
                href="/questions/[technology]"
                query={query}
                activeClassName={styles.active}
              >
                <a>{i + 1}</a>
              </ActiveLink>
            </li>
          );
        })}
      </ul>
    </footer>
  );
});

export default QuestionsPagination;
