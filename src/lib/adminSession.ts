import crypto from 'node:crypto';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'gc_admin';
const TOKEN_VERSION = 'v2';

function getAdminSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (secret) return secret;
  // Preview/dev fallback so admin login works out of the box.
  if (process.env.NODE_ENV !== 'production') return 'grandchef_dev_admin_session_secret_change_me';
  return null;
}

function base64url(buf: Buffer) {
  return buf
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function fromBase64url(s: string) {
  const padLen = (4 - (s.length % 4)) % 4;
  const padded = s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat(padLen);
  return Buffer.from(padded, 'base64');
}

function hmac(secret: string, value: string) {
  return base64url(crypto.createHmac('sha256', secret).update(value).digest());
}

export function setAdminSession(username: string) {
  const secret = getAdminSessionSecret();
  if (!secret) throw new Error('Missing ADMIN_SESSION_SECRET');
  const issuedAt = Date.now();
  // v2 token format: v2.<base64url(json)>.sig
  // This avoids delimiter issues for usernames/emails containing dots.
  const payloadJson = JSON.stringify({ u: username, i: issuedAt });
  const payloadB64 = base64url(Buffer.from(payloadJson, 'utf8'));
  const payload = `${TOKEN_VERSION}.${payloadB64}`;
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
  const secret = getAdminSessionSecret();
  if (!secret) return false;
  return cookies().then((cookieStore) => {
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return false;

    const parts = token.split('.');
    if (parts.length < 3) return false;

    // v2: version.payloadB64.sig
    if (parts.length === 3 && parts[0] === TOKEN_VERSION) {
      const payloadB64 = parts[1];
      const sig = parts[2];
      const payload = `${TOKEN_VERSION}.${payloadB64}`;
      const expected = hmac(secret, payload);
      // timingSafeEqual throws on different lengths; treat as invalid.
      if (sig.length !== expected.length) return false;
      if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;

      try {
        const obj = JSON.parse(fromBase64url(payloadB64).toString('utf8')) as { u?: string; i?: number };
        const issuedAt = Number(obj?.i);
        if (!Number.isFinite(issuedAt)) return false;
        // 30 days TTL
        if (Date.now() - issuedAt > 1000 * 60 * 60 * 24 * 30) return false;
        return true;
      } catch {
        return false;
      }
    }

    // Legacy format: username.issuedAt.sig (username may contain dots)
    const sig = parts[parts.length - 1];
    const issuedAtRaw = parts[parts.length - 2];
    const username = parts.slice(0, -2).join('.');
    const payload = `${username}.${issuedAtRaw}`;
    const expected = hmac(secret, payload);
    if (sig.length !== expected.length) return false;
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;

    const issuedAt = Number(issuedAtRaw);
    if (!Number.isFinite(issuedAt)) return false;
    if (Date.now() - issuedAt > 1000 * 60 * 60 * 24 * 30) return false;
    return true;
  });
}
