/**
 * Canonical site origin for SEO, Open Graph, and absolute URLs.
 * Set `NEXT_PUBLIC_SITE_URL` in production (e.g. https://turkiyejobs.org).
 */
export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://turkiyejobs.org").replace(/\/$/, "");
}

export function absoluteUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl()}${p}`;
}
