import { connect } from 'react-redux';
import { Question } from '../../../../redux/reducers/questions';
import { AppState } from '../../../../redux/reducers';
import { getLoggedInUser } from '../../../../redux/selectors/selectors';
import React from 'react';
import { ActionCreators } from '../../../../redux/actions';
import classnames from 'classnames';
import { redirect } from '../../../../utils/redirect';

type QuestionVotingOwnProps = {
  question: Question;
};

type QuestionVotingProps = QuestionVotingOwnProps &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;

const QuestionVotingComponent: React.FC<QuestionVotingProps> = ({
  route,
  question,
  isLoggedIn,
  upvoteQuestion,
  downvoteQuestion,
}) => {
  const { votesCount, currentUserVotedOn } = question;

  const reportEvent = React.useCallback((action: string) => {
    globalReportEvent(action, 'Głosowanie');
  }, []);

  const onVote = React.useCallback(() => {
    if (!isLoggedIn) {
      reportEvent('logowanie');
      redirect('/login', { previousPath: route.asPath || '' });
    } else if (currentUserVotedOn) {
      reportEvent('downvote');
      void downvoteQuestion(question.id);
    } else {
      reportEvent('upvote');
      void upvoteQuestion(question.id);
    }
  }, [isLoggedIn, currentUserVotedOn, route, question]);

  return (
    <footer
      className={classnames([
        'app-questions--question--voting',
        {
          'app-questions--question--voting_voted': currentUserVotedOn,
        },
      ])}
    >
      <button className="vote-button" type="button" onClick={onVote}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          width="15"
          height="13"
          fill="currentColor"
        >
          <polygon points="7.5,0 15,13 0,13" />
        </svg>

        {votesCount}
      </button>
    </footer>
  );
};

const mapStateToProps = (state: AppState, _ownProps: QuestionVotingOwnProps) => {
  return {
    route: state.routeDetails.current,
    isLoggedIn: Boolean(getLoggedInUser(state)),
  };
};

const mapDispatchToProps = {
  upvoteQuestion: ActionCreators.upvoteQuestion,
  downvoteQuestion: ActionCreators.downvoteQuestion,
};

const QuestionVoting = connect(
  mapStateToProps,
  mapDispatchToProps
)(QuestionVotingComponent);

export default QuestionVoting;
