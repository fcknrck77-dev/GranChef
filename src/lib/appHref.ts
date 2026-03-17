import { APP_ORIGIN, IS_LANDING } from '@/lib/deployTarget';

export function appHref(path: string) {
  if (!IS_LANDING) return path;
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${APP_ORIGIN}${p}`;
}

