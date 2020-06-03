import { redirect } from '../../utils/redirect';
import type { GetInitialPropsContext } from '../../utils/types';

const QuestionsPage = () => null;

QuestionsPage.getInitialProps = (ctx: GetInitialPropsContext) => {
  return redirect('/questions/[technology]', { technology: 'js', page: '1' }, ctx.res);
};

export default QuestionsPage;
