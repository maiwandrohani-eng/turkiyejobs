import type { AppLocale } from "@/lib/i18n/locale";

export type ImpactLocale = AppLocale;

export const IMPACT_TRANSLATIONS = {
  en: {
    eyebrow: "TürkiyeJobs.org",
    title: "Transparency & principles",
    description:
      "We want TürkiyeJobs.org to be a calm, trustworthy place to find serious roles — for candidates and for mission-driven employers.",
    commitmentsHeading: "Our commitments",
    commitment1: "Every listing is reviewed by a human before publication.",
    commitment2:
      "We do not accept listings from organizations with open safeguarding violations or fraud allegations.",
    commitment3:
      "Listings with false deadlines or closed roles are removed within 24 hours of being reported.",
    commitment4: "We do not sell applicant data to third parties.",
    verificationHeading: "How verification works",
    verificationBody:
      "TürkiyeJobs uses a two-stage review process. First, every organization account is verified by the admin team before the organization can post anything. Second, every individual listing is reviewed for quality and fit before it appears publicly. This means nothing on TürkiyeJobs is unreviewed — not the employer, not the role.",
    optimizeHeading: "What we optimize for",
    optimize1Label: "Clarity",
    optimize1:
      " — candidates should understand role, location, and how to apply without hunting through attachments.",
    optimize2Label: "Fair process",
    optimize2:
      " — published listings should reflect what the organization intends to recruit for, with deadlines that respect applicants' time.",
    optimize3Label: "Verified employers",
    optimize3:
      " — organization accounts go through review so the directory is not a free-for-all.",
    growingHeading: "Growing with the sector",
    growingBefore:
      "Metrics and partner stories will expand as the platform matures. For now, the best signal is the quality of listings and the organizations choosing to post here. If you have ideas for accountability or reporting you would like to see published, reach us via",
    growingContactLabel: "Contact",
    growingAfter: ".",
  },
  tr: {
    eyebrow: "TürkiyeJobs.org",
    title: "Şeffaflık ve ilkeler",
    description:
      "TürkiyeJobs.org'un ciddi roller için sakin ve güvenilir bir yer olmasını istiyoruz — hem adaylar hem de misyon odaklı işverenler için.",
    commitmentsHeading: "Taahhütlerimiz",
    commitment1: "Her ilan yayınlanmadan önce bir ekip üyesi tarafından incelenir.",
    commitment2:
      "Açık koruma ihlalleri veya dolandırıcılık iddiaları olan kuruluşlardan ilan kabul etmiyoruz.",
    commitment3:
      "Yanıltıcı son tarihli veya kapanmış roller, bildirildikten sonra 24 saat içinde kaldırılır.",
    commitment4: "Aday verilerini üçüncü taraflara satmıyoruz.",
    verificationHeading: "Doğrulama nasıl çalışır",
    verificationBody:
      "TürkiyeJobs iki aşamalı bir inceleme süreci kullanır. Önce her kuruluş hesabı yönetici ekibi tarafından doğrulanır; kuruluş herhangi bir şey yayınlayabilmeden önce bu onay gereklidir. İkinci aşamada ise her ilan yayınlanmadan önce kalite ve uygunluk açısından incelenir. Bu sayede TürkiyeJobs'ta hiçbir şey incelenmeden kalmaz — ne işveren ne de ilan.",
    optimizeHeading: "Neyi optimize ediyoruz",
    optimize1Label: "Netlik",
    optimize1:
      " — adaylar rolü, konumu ve başvuru yolunu ekler arasında kaybolmadan anlamalı.",
    optimize2Label: "Adil süreç",
    optimize2:
      " — yayınlanan ilanlar kuruluşun gerçekten ne için işe aldığını yansıtmalı ve son tarihler adayların zamanına saygı göstermeli.",
    optimize3Label: "Doğrulanmış işverenler",
    optimize3: " — kuruluş hesapları incelemeden geçer.",
    growingHeading: "Sektörle birlikte büyüme",
    growingBefore:
      "Platform olgunlaştıkça metrikler ve ortak hikâyeler genişleyecek. Şimdilik en iyi sinyal, ilan kalitesi ve buraya ilan vermeyi tercih eden kuruluşlardır. Hesap verebilirlik veya raporlama konusunda yayınlanmasını istediğiniz fikirleriniz varsa,",
    growingContactLabel: "İletişim",
    growingAfter: " üzerinden ulaşın.",
  },
} as const;

export type ImpactTranslationKey = keyof (typeof IMPACT_TRANSLATIONS)["en"];
