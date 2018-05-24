declare function globalReportEvent(action: string, category: string, label?: string, questionId?: number | string);

interface GtagEventParams {
  event_category?: string;
  event_label?: string;
  question_id?: string;
  value?: number;
  custom_map?: any;
  page_path?: string;
}
interface Gtag {
  (event: 'event' | 'config', eventName: string, eventParams?: GtagEventParams): any;
  (event: 'js', date: Date): any;
}
declare var gtag: Gtag;
