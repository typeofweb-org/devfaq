/// <reference types="next" />
/// <reference types="next/types/global" />

declare function globalReportEvent(
  action: string,
  category: string,
  label?: string,
  questionId?: number | string
);
declare function strum(label: string, meta: string | object);

declare namespace NodeJS {
  interface ProcessEnv {
    readonly ENV: 'development' | 'production' | 'test' | 'staging';
  }
}
