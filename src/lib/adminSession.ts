import crypto from 'node:crypto';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'gc_admin';

function base64url(buf: Buffer) {
  return buf
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function hmac(secret: string, value: string) {
  return base64url(crypto.createHmac('sha256', secret).update(value).digest());
}

export function setAdminSession(username: string) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error('Missing ADMIN_SESSION_SECRET');
  const issuedAt = Date.now();
  const payload = `${username}.${issuedAt}`;
  const sig = hmac(secret, payload);
  const token = `${payload}.${sig}`;

  // Next 16+: cookies() is async.
  return cookies().then((cookieStore) => {
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
  });
}

export function clearAdminSession() {
  return cookies().then((cookieStore) => {
    cookieStore.set(COOKIE_NAME, '', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 0 });
  });
}

export function isAdminSessionValid() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return false;
  return cookies().then((cookieStore) => {
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return false;

    const parts = token.split('.');
    if (parts.length < 3) return false;
    const payload = `${parts[0]}.${parts[1]}`;
    const sig = parts.slice(2).join('.');
    const expected = hmac(secret, payload);
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;

    const issuedAt = Number(parts[1]);
    if (!Number.isFinite(issuedAt)) return false;
    // 30 days TTL
    if (Date.now() - issuedAt > 1000 * 60 * 60 * 24 * 30) return false;
    return true;
  });
}
