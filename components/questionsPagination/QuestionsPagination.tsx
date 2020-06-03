import React from 'react';
import { connect } from 'react-redux';

import { AppState } from '../../redux/reducers';
import { getTechnology } from '../../redux/selectors/selectors';
import { PAGE_SIZE } from '../../services/Api';
import ActiveLink from '../activeLink/ActiveLink';

import styles from './questionsPagination.module.scss';

type QuestionsPaginationProps = ReturnType<typeof mapStateToProps>;

const QuestionsPaginationComponent: React.FC<QuestionsPaginationProps> = ({ total, route }) => {
  if (!total) {
    return null;
  }

  const pages = Math.ceil(total / PAGE_SIZE);

  return (
    <footer className={styles.questionsPagination}>
      <ul>
        {Array.from({ length: pages }).map((_, i) => {
          const query: QuestionsPaginationProps['route']['query'] = {
            ...route.query,
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
};

const mapStateToProps = (state: AppState) => {
  const technology = getTechnology(state);
  const questions = state.questions;

  return {
    technology,
    total: questions.data && questions.data.meta && questions.data.meta.total,
    route: state.routeDetails.current,
  };
};

const QuestionsPagination = QuestionsPaginationComponent;
export default connect(mapStateToProps)(QuestionsPagination);
