import { getPrisma } from "@/lib/prisma";
import { prismaErrorCode } from "@/lib/prisma-error-code";
import {
  DEFAULT_CONTACT_CARD,
  DEFAULT_SOCIAL_LINKS,
  type SocialLink,
} from "@/lib/site-contact-defaults";

export const SITE_SETTING_KEYS = {
  officeTitle: "contact.officeTitle",
  body: "contact.body",
  mapEmbedUrl: "contact.mapEmbedUrl",
  social: "contact.social",
} as const;

export type ContactPublicData = {
  officeTitle: string;
  body: string;
  mapEmbedUrl: string;
  social: SocialLink[];
};

function parseSocialJson(raw: string | undefined): SocialLink[] {
  if (!raw?.trim()) return DEFAULT_SOCIAL_LINKS;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return DEFAULT_SOCIAL_LINKS;
    const out: SocialLink[] = [];
    for (const x of parsed) {
      if (!x || typeof x !== "object") continue;
      const o = x as Record<string, unknown>;
      const href = typeof o.href === "string" ? o.href.trim() : "";
      const label = typeof o.label === "string" ? o.label.trim() : "";
      const abbrRaw = typeof o.abbr === "string" ? o.abbr.trim() : "";
      if (!href.startsWith("https://") || !label) continue;
      const abbr = abbrRaw || label.slice(0, 2);
      out.push({ href, label, abbr });
    }
    return out.length > 0 ? out : DEFAULT_SOCIAL_LINKS;
  } catch {
    return DEFAULT_SOCIAL_LINKS;
  }
}

export async function getContactPublicData(): Promise<ContactPublicData> {
  const prisma = getPrisma();
  if (!prisma) {
    return {
      officeTitle: DEFAULT_CONTACT_CARD.officeTitle,
      body: DEFAULT_CONTACT_CARD.body,
      mapEmbedUrl: DEFAULT_CONTACT_CARD.mapEmbedUrl,
      social: DEFAULT_SOCIAL_LINKS,
    };
  }

  const keys = Object.values(SITE_SETTING_KEYS);
  let rows: { key: string; value: string }[] = [];
  try {
    rows = await prisma.siteSetting.findMany({
      where: { key: { in: keys } },
    });
  } catch (e) {
    console.error("[site-contact] SiteSetting query failed:", prismaErrorCode(e) ?? e);
    return {
      officeTitle: DEFAULT_CONTACT_CARD.officeTitle,
      body: DEFAULT_CONTACT_CARD.body,
      mapEmbedUrl: DEFAULT_CONTACT_CARD.mapEmbedUrl,
      social: DEFAULT_SOCIAL_LINKS,
    };
  }
  const map = new Map(rows.map((r) => [r.key, r.value]));

  return {
    officeTitle:
      map.get(SITE_SETTING_KEYS.officeTitle)?.trim() || DEFAULT_CONTACT_CARD.officeTitle,
    body: map.get(SITE_SETTING_KEYS.body)?.trim() || DEFAULT_CONTACT_CARD.body,
    mapEmbedUrl: map.get(SITE_SETTING_KEYS.mapEmbedUrl)?.trim() || "",
    social: parseSocialJson(map.get(SITE_SETTING_KEYS.social)),
  };
}
