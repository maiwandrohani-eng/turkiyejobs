import type { AppLocale } from "@/lib/i18n/locale";
import type { OpportunityCategory } from "@/lib/types";

const CATEGORY_LABELS_TR: Record<OpportunityCategory, string> = {
  Jobs: "İşler",
  Consultancies: "Danışmanlıklar",
  Trainings: "Eğitimler",
  "Volunteer Roles": "Gönüllülük",
  Tenders: "İhaleler",
  Grants: "Hibeler",
};

/** Display label for opportunity category (filter values stay English for URL/DB). */
export function labelOpportunityCategory(
  locale: AppLocale,
  category: OpportunityCategory,
): string {
  return locale === "tr" ? CATEGORY_LABELS_TR[category] : category;
}

const TYPE_LABELS_TR: Record<string, string> = {
  "Full-time": "Tam zamanlı",
  "Part-time": "Yarı zamanlı",
  Consultancy: "Danışmanlık",
  Training: "Eğitim",
  Volunteer: "Gönüllü",
  Tender: "İhale",
  Grant: "Hibe",
  Internship: "Staj",
  Fellowship: "Bursiyerlik",
  Contract: "Sözleşmeli",
  "Fixed-term": "Belirli süreli",
  "Short-term": "Kısa süreli",
};

/** Display label for opportunity type strings from listings. */
export function labelOpportunityType(locale: AppLocale, type: string): string {
  if (!type.trim()) return type;
  if (locale !== "tr") return type;
  return TYPE_LABELS_TR[type] ?? type;
}
