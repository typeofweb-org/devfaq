import { redirect } from '../utils/redirect';
import type { GetInitialPropsContext } from '../utils/types';

const Index = () => null;

Index.getInitialProps = async (ctx: GetInitialPropsContext) => {
  return redirect('/questions/[technology]', { technology: 'js', page: '1' }, ctx);
};

export default Index;
