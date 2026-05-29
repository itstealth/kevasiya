"use client";

/**
 * Sets a cookie in the browser.
 * @param name - The name of the cookie.
 * @param value - The value of the cookie.
 * @param days - The number of days until the cookie expires.
 */
export function setCookie(name: string, value: string, days: number): void {
  if (typeof document === "undefined") return; // Ensure this runs only on the client

  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  // Add Secure and SameSite=Strict for production security
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  document.cookie = `${name}=${
    value || ""
  }${expires}; path=/; SameSite=Strict${secure}`;
}

/**
 * Gets a cookie from the browser by its name.
 * @param name - The name of the cookie to retrieve.
 * @returns The value of the cookie, or null if not found.
 */
export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null; // Ensure this runs only on the client

  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

/**
 * Erases a cookie from the browser.
 * @param name - The name of the cookie to erase.
 */
export function eraseCookie(name: string): void {
  if (typeof document === "undefined") return; // Ensure this runs only on the client

  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}
