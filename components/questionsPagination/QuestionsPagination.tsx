import * as React from 'react';
import ActiveLink from '../activeLink/ActiveLink';
import { connect } from 'react-redux';
import { AppState } from '../../redux/reducers';
import { getTechnology } from '../../redux/selectors/selectors';
import { PAGE_SIZE } from '../../services/Api';
import './questionsPagination.scss';

type QuestionsPaginationProps = ReturnType<typeof mapStateToProps>;

const QuestionsPaginationComponent: React.FC<QuestionsPaginationProps> = ({
  technology,
  total,
}) => {
  if (!total) {
    return null;
  }

  const pages = Math.ceil(total / PAGE_SIZE);

  return (
    <footer className="questions-pagination">
      <ul>
        {Array.from({ length: pages }).map((_, i) => {
          return (
            <li key={i}>
              <ActiveLink exact={true} route={`/questions/${technology}?page=${i + 1}`}>
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
  };
};

const QuestionsPagination = QuestionsPaginationComponent;
export default connect(mapStateToProps)(QuestionsPagination);
