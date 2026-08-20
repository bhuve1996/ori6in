/** Client/server deploy stamp — changes each production build to reset stale browsers. */

export const DEPLOY_COOKIE = 'ori6in_deploy';
export const DEPLOY_STORAGE_KEY = 'ori6in_deploy';

/** Cookies owned by the web app that should reset across deploys. */
export const APP_COOKIES_TO_CLEAR = [
  DEPLOY_COOKIE,
  'ori6in_coming_soon',
] as const;

export function getDeployId() {
  return (
    process.env.NEXT_PUBLIC_DEPLOY_ID?.trim() ||
    process.env.RAILWAY_GIT_COMMIT_SHA?.trim() ||
    'dev'
  );
}
