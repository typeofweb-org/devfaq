import Fs from 'fs';

export function getConfig(name: 'ENV'): 'production' | 'staging' | 'development' | 'test';
export function getConfig(name: 'NODE_ENV'): 'production' | 'development';
export function getConfig(name: string): string;
export function getConfig(name: string): string {
  const val = process.env[name];

  switch (name) {
    case 'NODE_ENV':
      return val || 'development';
    case 'ENV':
      return val || 'development';
    case 'PORT':
      return val || '3009';
    case 'AWS_ACCESS_KEY_ID':
    case 'AWS_SECRET_ACCESS_KEY':
    case 'SENTRY_DSN':
    case 'HARVEST_API_AUTH_TOKEN':
    case 'HARVEST_API_USER_AGENT':
    case 'GITHUB_CLIENT_ID':
    case 'GITHUB_CLIENT_SECRET':
      return val || '';
    case 'VERSION':
      return Fs.existsSync('.version') ? Fs.readFileSync('.version', 'utf-8').trim() : 'dev';
    case 'SENTRY_VERSION':
      return getConfig('VERSION').split(':').pop() || '';
  }

  if (!val) {
    throw new Error(`Cannot find environmental variable: ${name}`);
  }

  return val;
}

export const isProd = () => getConfig('ENV') === 'production';
export const isStaging = () => getConfig('ENV') === 'staging';
