const DEFAULT_MAX_AGE_DAYS = 30;

function isBrowser() {
  return typeof document !== "undefined";
}

export function getCookie(name) {
  if (!isBrowser()) return null;

  const encodedName = `${encodeURIComponent(name)}=`;
  const parts = document.cookie ? document.cookie.split(";") : [];

  for (const part of parts) {
    const cookie = part.trim();
    if (cookie.startsWith(encodedName)) {
      return decodeURIComponent(cookie.slice(encodedName.length));
    }
  }

  return null;
}

export function setCookie(name, value, options = {}) {
  if (!isBrowser()) return;

  const maxAgeDays = Number(options.maxAgeDays ?? DEFAULT_MAX_AGE_DAYS);
  const expires = new Date(Date.now() + maxAgeDays * 24 * 60 * 60 * 1000).toUTCString();
  const secure = typeof window !== "undefined" && window.location.protocol === "https:" ? "; Secure" : "";

  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(String(value))}; Path=/; Expires=${expires}; SameSite=Lax${secure}`;
}

export function removeCookie(name) {
  if (!isBrowser()) return;
  document.cookie = `${encodeURIComponent(name)}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
}

export function getJsonCookie(name, fallback = null) {
  const raw = getCookie(name);
  if (!raw) return fallback;

  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function setJsonCookie(name, value, options = {}) {
  setCookie(name, JSON.stringify(value), options);
}
