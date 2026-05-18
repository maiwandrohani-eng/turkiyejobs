import type { AppLocale } from "@/lib/i18n/locale";

export type EventsLocale = AppLocale;

export const EVENTS_TRANSLATIONS = {
  en: {
    eyebrow: "Community",
    title: "Events & key dates",
    description: "Editorial calendar of sessions and seasonal hiring rhythms.",
    unconfirmedNotice:
      "Some events below are not yet confirmed. Check back or contact the organizer before registering.",
    unconfirmedBadge: "UNCONFIRMED",
    relatedLink: "Related link →",
    wantListedBefore: "Want something listed?",
    contactTeamLabel: "Contact the team",
    wantListedAfter: " with date, audience, and registration details.",
  },
  // TODO: extend Turkish translations to remaining pages
  tr: {
    eyebrow: "Topluluk",
    title: "Etkinlikler ve önemli tarihler",
    description: "Oturumlar ve mevsimsel işe alım ritimlerinin editoryal takvimi.",
    unconfirmedNotice:
      "Aşağıdaki bazı etkinlikler henüz onaylanmadı. Kayıt olmadan önce kontrol edin veya düzenleyiciyle iletişime geçin.",
    unconfirmedBadge: "ONAYLANMADI",
    relatedLink: "İlgili bağlantı →",
    wantListedBefore: "Listelenmesini mi istiyorsunuz?",
    contactTeamLabel: "Ekiple iletişime geçin",
    wantListedAfter: " — tarih, hedef kitle ve kayıt bilgileriyle.",
  },
} as const;

export type EventsTranslationKey = keyof (typeof EVENTS_TRANSLATIONS)["en"];
