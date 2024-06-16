// cookieManager.js
import { encryptLocalIV, decryptLocalIV } from '~utils/crypto';

const defaultCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'Lax',
  maxAge: 24 * 60 * 60 * 1000,
};

export const setCookie = (res, name, value, options = defaultCookieOptions) => {
  const opts = { ...defaultCookieOptions, ...options };
  res.cookie(name, value, opts);
};

export const getCookie = (req, name) => {
  return req.cookies[name];
};

export const updateCookie = (res, name, value, options = defaultCookieOptions) => {
  setCookie(res, name, value, options);
};

export const deleteCookie = (res, name, options = defaultCookieOptions) => {
  res.clearCookie(name, { ...defaultCookieOptions, ...options });
};

export const deleteAllCookies = (req, res) => {
  const cookies = req.cookies;
  for (const cookieName in cookies) {
    if (cookies.hasOwnProperty(cookieName)) {
      deleteCookie(res, cookieName);
    }
  }
};

export const setEncryptedCookie = (res, name, value, options = defaultCookieOptions) => {
  setCookie(res, name, encryptLocalIV(value), options);
};

export const getDecryptedCookie = (req, name) => {
  const encryptedValue = getCookie(req, name);
  console.error('encryptedValue : ', encryptedValue);
  if (encryptedValue) {
    return decryptLocalIV(encryptedValue);
  }
  return null;
};
