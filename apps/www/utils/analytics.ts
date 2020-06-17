import env from './env';

export const GA_TRACKING_ID = env.GA_TRACKING_ID;
export const CUSTOM_MAP = { dimension1: 'question_id' };

export const reportPageView = (url: string) => {
  // console.log('pageview', url);
  if (typeof gtag === 'undefined') {
    return;
  }

  gtag('config', GA_TRACKING_ID, {
    page_path: url,
    custom_map: CUSTOM_MAP,
  });
};

export const reportPdfDownload = (ids: Array<number | string>) => {
  // console.log('pdfDownload', ids);
  if (typeof gtag === 'undefined') {
    return;
  }
  ids.forEach((id) => gtag('event', 'download_question_pdf', { question_id: String(id) }));
};

export const reportEvent = (
  action: string,
  category: string,
  label?: string,
  questionId?: number | string
) => {
  // console.log({ action, category, label, questionId });
  if (typeof gtag === 'undefined') {
    return;
  }
  const params: Gtag.EventParams | Gtag.CustomParams = { event_category: category };
  if (label) {
    params.event_label = label;
  }
  if (questionId) {
    (params as Gtag.CustomParams).question_id = String(questionId);
  }
  gtag('event', action, params);
};
