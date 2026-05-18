import type { AppLocale } from "@/lib/i18n/locale";

export type HowItWorksLocale = AppLocale;

export const HOW_IT_WORKS_TRANSLATIONS = {
  en: {
    eyebrow: "Guides",
    title: "How TürkiyeJobs.org works",
    description:
      "A short map of the platform so you know what to expect — whether you are applying, hiring, or browsing the directory.",
    applicantsHeading: "For applicants",
    applicant1Before: "Browse published opportunities, save listings, and track applications from your",
    applicant1LinkLabel: "applicant dashboard",
    applicant1After: ".",
    applicant2: "All listings are reviewed by the TürkiyeJobs team before going live.",
    applicant3Before: "Some roles use",
    applicant3Bold: "internal apply",
    applicant3After:
      "on TürkiyeJobs.org; others use email or an external link — the listing always states which path to use.",
    checklistLink: "Internal application checklist →",
    employersHeading: "For employers",
    employer1:
      "Register your organization — create an account and submit your organization profile for admin review.",
    employer2:
      "Account approved — once verified by the TürkiyeJobs team, you gain access to your employer dashboard and can submit listings.",
    employer3:
      "Each listing reviewed — every listing you submit is individually reviewed for quality and fit before it appears publicly on the platform.",
    employerTwoStage:
      "This two-stage process means every organization and every listing on TürkiyeJobs has been individually reviewed before any applicant sees it.",
    employer48h:
      "Most listings are reviewed within 48 hours of submission. You will receive a confirmation email when your listing is live.",
    postingGuidelinesLink: "Posting guidelines for faster approval →",
    trustHeading: "Trust & directory",
    trustBefore: "The",
    trustLinkLabel: "organization directory",
    trustAfter:
      "highlights verified employers. Badges and filters help you scan quickly before you open a full listing.",
    exploreHeading: "Explore more",
    exploreSectors: "Browse by theme / category",
    exploreEvents: "Events & key dates",
    exploreSpotlights: "Employer spotlights",
    exploreImpact: "Transparency & principles",
  },
  // TODO: extend Turkish translations to remaining pages
  tr: {
    eyebrow: "Rehberler",
    title: "TürkiyeJobs.org nasıl çalışır",
    description:
      "Başvuran, işveren veya dizin gezgini olsanız da platformdan ne bekleyeceğinizi kısaca özetler.",
    applicantsHeading: "Adaylar için",
    applicant1Before: "Yayınlanan fırsatlara göz atın, ilanları kaydedin ve",
    applicant1LinkLabel: "aday panelinizden",
    applicant1After: " başvurularınızı takip edin.",
    applicant2: "Tüm ilanlar yayına girmeden önce TürkiyeJobs ekibi tarafından incelenir.",
    applicant3Before: "Bazı roller",
    applicant3Bold: "dahili başvuru",
    applicant3After:
      " kullanır; diğerleri e-posta veya harici bağlantı kullanır — ilan hangi yolu kullandığınızı belirtir.",
    checklistLink: "Dahili başvuru kontrol listesi →",
    employersHeading: "İşverenler için",
    employer1:
      "Kuruluşunuzu kaydedin — hesap oluşturun ve kuruluş profilinizi yönetici incelemesine gönderin.",
    employer2:
      "Hesap onaylandı — TürkiyeJobs ekibi doğruladıktan sonra işveren panelinize erişir ve ilan gönderebilirsiniz.",
    employer3:
      "Her ilan incelenir — gönderdiğiniz her ilan platformda yayınlanmadan önce ayrı ayrı incelenir.",
    employerTwoStage:
      "Bu iki aşamalı süreç, her kuruluşun ve her ilanın bir aday görmeden önce incelendiği anlamına gelir.",
    employer48h:
      "Çoğu ilan gönderimden sonraki 48 saat içinde incelenir. İlanınız yayında olduğunda onay e-postası alırsınız.",
    postingGuidelinesLink: "Daha hızlı onay için ilan rehberi →",
    trustHeading: "Güven ve dizin",
    trustBefore: "",
    trustLinkLabel: "Kuruluş dizini",
    trustAfter: " doğrulanmış işverenleri öne çıkarır.",
    exploreHeading: "Daha fazlasını keşfedin",
    exploreSectors: "Tema / kategoriye göre göz atın",
    exploreEvents: "Etkinlikler ve önemli tarihler",
    exploreSpotlights: "İşveren spotları",
    exploreImpact: "Şeffaflık ve ilkeler",
  },
} as const;

export type HowItWorksTranslationKey = keyof (typeof HOW_IT_WORKS_TRANSLATIONS)["en"];
