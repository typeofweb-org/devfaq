import React from 'react';
import { redirect } from '../../utils/redirect';
import { GetInitialPropsContext } from '../../utils/types';

const QuestionsPage = () => null;

QuestionsPage.getInitialProps = async (ctx: GetInitialPropsContext) => {
  return redirect('/questions/[technology]', { technology: 'js', page: '1' }, ctx);
};

export default QuestionsPage;
