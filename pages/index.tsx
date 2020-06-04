import type { NextComponentType } from 'next';

import { redirect } from '../utils/redirect';

const IndexPage: NextComponentType = () => null;

IndexPage.getInitialProps = async (ctx) => {
  return redirect('/questions/[technology]', { technology: 'js', page: '1' }, ctx);
};

export default IndexPage;
