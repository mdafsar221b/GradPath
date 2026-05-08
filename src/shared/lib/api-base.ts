const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
const configuredApiUrlIsAbsolute = Boolean(configuredApiUrl && /^https?:\/\//i.test(configuredApiUrl));

const browserLocalhost = typeof window !== 'undefined'
  && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const API_BASE_URL = browserLocalhost
  ? trimTrailingSlash(configuredApiUrl || 'http://localhost:5000/api')
  : configuredApiUrl
    ? configuredApiUrlIsAbsolute
      ? '/api'
      : trimTrailingSlash(configuredApiUrl)
    : '/api';
