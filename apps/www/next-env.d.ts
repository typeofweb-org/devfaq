/// <reference types="next" />
/// <reference types="next/types/global" />

declare function globalReportEvent(
  action: string,
  category: string,
  label?: string,
  questionId?: number | string
);

declare namespace NodeJS {
  interface ProcessEnv {
    readonly ENV: 'development' | 'production' | 'test' | 'staging';
  }
}

interface Window {
  dataLayer: Array<any>;
}

interface Navigator {
  standalone?: boolean;
}
