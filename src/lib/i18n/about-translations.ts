export type AboutLocale = "en" | "tr";

export const ABOUT_TRANSLATIONS = {
  en: {
    eyebrow: "About TürkiyeJobs.org",
    title: "NGO & Development Sector Jobs in Türkiye",
    description:
      "TürkiyeJobs.org connects mission-driven talent with NGOs, development agencies, and social enterprises across Türkiye — making it easier to find meaningful work and partnerships.",
    missionHeading: "Our mission",
    missionBody:
      "We believe Türkiye's nonprofit and development sector grows stronger when opportunities are transparent, accessible, and trustworthy. TürkiyeJobs.org aggregates roles across humanitarian response, sustainable development, education, climate resilience, gender equality, and more — in one bilingual-ready, mobile-friendly experience.",
    serveHeading: "Who we serve",
    serve1: "Professionals seeking NGO jobs, consultancies, and fellowships",
    serve2: "Students and graduates exploring trainings and volunteering",
    serve3: "Organizations recruiting vetted talent and publishing tenders or grants",
    serve4:
      "Turkish and international organizations seeking to reach pre-vetted, mission-aligned candidates working in Türkiye's development and humanitarian sector.",
    qualityHeading: "Quality & moderation",
    qualityBody:
      "TürkiyeJobs uses a two-stage review process. First, every organization account is verified by the admin team before the organization can post anything. Second, every individual listing is reviewed for quality and fit before it appears publicly. This means nothing on TürkiyeJobs is unreviewed — not the employer, not the role.",
    builtHeading: "Who built this",
    builtPara1Before: "TürkiyeJobs.org was founded by Maiwand Rohani, CEO of ",
    builtPara1After:
      " (International Network for Aid, Relief, and Assistance), with the support of volunteers from Türkiye's NGO and humanitarian sector who contributed their time and expertise to build the platform.",
    builtPara2:
      "The platform was built to fill a specific gap: Türkiye hosts one of the largest humanitarian operations in the world, yet had no dedicated, affordable, and trustworthy platform where NGO professionals and organizations could find each other. TürkiyeJobs is the answer to that gap.",
  },
  tr: {
    // TODO: extend Turkish translations to remaining pages
    eyebrow: "TürkiyeJobs.org Hakkında",
    title: "Türkiye'de STK ve Kalkınma Sektörü İşleri",
    description:
      "TürkiyeJobs.org, misyon odaklı yetenekleri Türkiye genelindeki STK'lar, kalkınma ajansları ve sosyal girişimlerle buluşturur.",
    missionHeading: "Misyonumuz",
    missionBody:
      "Türkiye'nin kâr amacı gütmeyen ve kalkınma sektörünün, fırsatlar şeffaf, erişilebilir ve güvenilir olduğunda güçlendiğine inanıyoruz.",
    serveHeading: "Kime hizmet ediyoruz",
    serve1: "STK işleri, danışmanlıklar ve burslar arayan profesyoneller",
    serve2: "Eğitim ve gönüllülük keşfeden öğrenciler ve mezunlar",
    serve3: "Eleme yapılmış yetenek istihdam eden ve ihale veya hibe yayınlayan kuruluşlar",
    serve4:
      "Türkiye'nin kalkınma ve insani yardım sektöründe önceden değerlendirilmiş, misyonla uyumlu adaylara ulaşmak isteyen Türk ve uluslararası kuruluşlar.",
    qualityHeading: "Kalite ve moderasyon",
    qualityBody:
      "TürkiyeJobs iki aşamalı bir inceleme süreci kullanır. Önce her kuruluş hesabı doğrulanır; sonra her ilan yayınlanmadan önce incelenir.",
    builtHeading: "Bunu kim kurdu",
    builtPara1Before: "TürkiyeJobs.org, ",
    builtPara1After:
      " (Uluslararası Yardım, İyileştirme ve Destek Ağı) CEO'su Maiwand Rohani tarafından, platformu inşa etmek için zaman ve uzmanlıklarını katkıda bulunan Türkiye'nin STK ve insani yardım sektöründen gönüllülerin desteğiyle kuruldu.",
    builtPara2:
      "Platform, dünyanın en büyük insani yardım operasyonlarından birine ev sahipliği yapan Türkiye'de, STK profesyonelleri ile kuruluşların birbirini bulabileceği güvenilir bir alanın eksikliğini kapatmak için inşa edildi.",
  },
} as const;

export type AboutTranslationKey = keyof (typeof ABOUT_TRANSLATIONS)["en"];
