const target = process.env.NEXT_PUBLIC_DEPLOY_TARGET || '';

export const DEPLOY_TARGET = target;
export const IS_LANDING = target === 'landing';
export const IS_STATIC_EXPORT = target === 'static' || target === 'landing';

export const APP_ORIGIN = process.env.NEXT_PUBLIC_APP_ORIGIN || 'https://app.grandchefapp.online';
export const LANDING_ORIGIN = process.env.NEXT_PUBLIC_LANDING_ORIGIN || 'https://grandchefapp.online';
