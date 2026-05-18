export type SocialLink = { href: string; label: string; abbr: string };

/** TODO: update social profile URLs in each platform dashboard for @turkiyejobs */
export const DEFAULT_SOCIAL_LINKS: SocialLink[] = [
  { href: "https://facebook.com/turkiyejobs", abbr: "f", label: "Facebook" },
  { href: "https://instagram.com/turkiyejobs", abbr: "◎", label: "Instagram" },
  { href: "https://x.com/turkiyejobs", abbr: "𝕏", label: "X" },
  { href: "https://linkedin.com/company/turkiyejobs", abbr: "in", label: "LinkedIn" },
  { href: "https://tiktok.com/@turkiyejobs", abbr: "♪", label: "TikTok" },
  { href: "https://youtube.com/@turkiyejobs", abbr: "▶", label: "YouTube" },
];

export const DEFAULT_CONTACT_CARD = {
  officeTitle: "Office",
  body: "Ankara, Türkiye\nEmail: hello@turkiyejobs.org\nHours: Mon–Fri, 9:00–18:00 (TRT)",
  mapEmbedUrl: "",
} as const;
