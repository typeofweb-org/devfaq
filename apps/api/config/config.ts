import Fs from 'fs';

export function getConfig(name: 'ENV'): 'production' | 'staging' | 'development' | 'test';
export function getConfig(name: 'NODE_ENV'): 'production' | 'development';
export function getConfig(name: 'PORT'): number;
export function getConfig(name: string): string;
export function getConfig(name: string): string | number {
  const val = process.env[name];

  switch (name) {
    case 'PORT':
      return val ? Number(val) : '3002';
    case 'NODE_ENV':
      return val || 'development';
    case 'ENV':
      return val || 'development';
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
