import * as React from 'react';
import './index.scss';
import Layout from '../components/layout/Layout';
import QuestionsListLayout from '../components/questions/questionsListLayout/QuestionsListLayout';
import { redirect } from '../utils/redirect';
import { GetInitialPropsContext } from '../utils/types';
import QuestionsSidebar from '../components/questions/questionsSidebar/QuestionsSidebar';
import MobileActionButtons from '../components/questions/mobileActionButtons/MobileActionButtons';
import AllQuestions from '../components/questions/allQuestions/AllQuestions';
import { ActionCreators } from '../redux/actions';
import { connect } from 'react-redux';
import { AppState } from '../redux/reducers/index';
import { getTechnology } from '../redux/selectors/selectors';
import { Technology, SortBy } from '../constants/technology-icon-items';
import { isString } from 'lodash';
import { Dispatch } from 'redux';

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;
class QuestionsPageComponent extends React.Component<Props> {
  static async getInitialProps(ctx: GetInitialPropsContext) {
    if (!ctx.query || !ctx.query.technology) {
      return redirect(ctx, '/questions/js?page=1');
    }

    const page = Number(ctx.query.page);

    if (!page) {
      return redirect(ctx, `/questions/${ctx.query.technology}?page=1`);
    }

    const sortBy: SortBy = isString(ctx.query.sortBy)
      ? (ctx.query.sortBy.split('*') as SortBy)
      : ['acceptedAt', 'desc'];

    await ctx.store.dispatch(ActionCreators.fetchQuestions(page, sortBy, ctx));
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.selectedLevels.length === prevProps.selectedLevels.length) {
      return;
    }

    this.props.reFetchQuestions();
  }

  render() {
    const { technology } = this.props;
    const label = technology ? Technology[technology] : '';

    return (
      <Layout title={`Pytania ${label}`}>
        <QuestionsListLayout>
          <div className="questions-container">
            <QuestionsSidebar />
            <AllQuestions />
          </div>
          <MobileActionButtons justDownload={false} />
        </QuestionsListLayout>
      </Layout>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    technology: getTechnology(state),
    selectedLevels: state.selectedLevels,
  };
};

const mapDispatchToProps = (
  dispatch: Dispatch<any>,
  ownProps: ReturnType<typeof mapStateToProps>
) => {
  return {
    reFetchQuestions: () => {
      console.log({ ownProps });
      const page = 1;
      const sortBy = undefined;
      dispatch(ActionCreators.fetchQuestions(page, sortBy));
    },
  };
};

const QuestionsPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(QuestionsPageComponent);
export default QuestionsPage;
