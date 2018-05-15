import { Registry, LinkProps } from 'next-routes';
import { ReactNode } from 'react';
export const Link: Registry['Link'];
// @ts-ignore
export interface LinkProps extends LinkProps {
  children: ReactNode;
}
export const Router: Registry['Router'];
