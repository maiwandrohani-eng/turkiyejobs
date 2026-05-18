import fs from "fs";
import path from "path";

const root = path.join(import.meta.dirname, "..");

function patchHome() {
  const file = path.join(root, "src/lib/i18n/home-translations.ts");
  let s = fs.readFileSync(file, "utf8");
  s = s.replace(/export type HomeLocale = "en" \| "ar";/, 'export type HomeLocale = "en" | "tr";');
  s = s.replace(/orgsOnMasrjobs/g, "orgsOnTurkiyejobs");

  const enPatches = {
    heroBadge: "Türkiye's NGO & Development Sector Jobs Platform",
    heroHeading:
      "Trusted jobs, consultancies, and grants for Türkiye's NGO and humanitarian sector",
    heroLine1:
      "Find verified NGO jobs, consultancies, and grants in Türkiye's development and humanitarian sector.",
    heroLine2:
      "Post your opening and reach professionals who are already here for this work.",
    heroTrust: "Every employer verified. Every listing reviewed.",
    newsletterSubtext: "No spam — only what's posted on TürkiyeJobs.",
    employerBody:
      "TürkiyeJobs.org was built for Türkiye's NGO and humanitarian ecosystem. Post your listing and reach professionals who are already here.",
    orgsOnTurkiyejobs: "Organizations on TürkiyeJobs",
    catalogFeaturedSubtext:
      "Hand-picked and newly approved listings across Türkiye's social impact sector.",
    filterLocationPlaceholder: "e.g. Ankara",
    footerTagline: "Verified NGO jobs and opportunities for Türkiye's development and humanitarian sector.",
    footerBuiltFor: "Built for Türkiye's NGO and humanitarian ecosystem.",
    spotlightsCard2Title: "Turkish–English balance",
    spotlightsCard2Text:
      "Many roles require fluent Turkish for communities and strong English for reporting. Candidates who state CEFR or workplace level honestly save everyone time in interview.",
    resourcesDescription:
      "Practical articles for candidates and employers in Türkiye's social impact ecosystem.",
  };

  for (const [key, val] of Object.entries(enPatches)) {
    const re = new RegExp(`(${key}:\\s*")([^"]*)(")`, "s");
    if (!re.test(s)) console.warn("home en missing", key);
    s = s.replace(re, `$1${val.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}$3`);
  }

  s = s.replace(/Egypt's/g, "Türkiye's");
  s = s.replace(/Egypt/g, "Türkiye");
  s = s.replace(/Cairo/g, "Ankara");
  s = s.replace(/Arabic/g, "Turkish");

  const arStart = s.indexOf("  // ═══════════════════════════════════════════════════════════════════════════\n  //  ARABIC");
  const arEnd = s.lastIndexOf("\n} as const;");
  if (arStart === -1) throw new Error("ar block not found");

  const enBlock = s.slice(0, arStart);
  const tail = s.slice(arEnd);

  const enMatch = enBlock.match(/en: \{([\s\S]*)\},\s*$/);
  if (!enMatch) throw new Error("en block parse failed");
  const enInner = enMatch[1];

  const trOverrides = {
    heroLine1:
      "Türkiye'nin sivil toplum ve insani yardım sektöründe doğrulanmış iş ilanlarını, danışmanlıkları ve hibeleri bulun.",
    heroLine2:
      "İlanınızı yayınlayın ve bu iş için burada olan profesyonellere ulaşın.",
    heroTrust: "Her işveren doğrulandı. Her ilan incelendi.",
    ctaPrimary: "Fırsatları İncele",
    ctaSecondary: "İlan Ver →",
    newsletterHeading: "Her hafta yeni fırsatları e-postanıza alın.",
    newsletterSubtext: "Spam yok — yalnızca TürkiyeJobs'ta yayınlananlar.",
    newsletterButton: "Abone Ol",
    employerHeading: "İşe mi alıyorsunuz?",
    employerBody:
      "TürkiyeJobs.org, Türkiye'nin STK ekosistemi için kuruldu. İlanınızı yayınlayın ve profesyonellere ulaşın.",
    employerButton: "İlan Ver →",
    navOpportunities: "Fırsatlar",
    navOrganizations: "Kuruluşlar",
    navResources: "Kaynaklar",
    navHowItWorks: "Nasıl çalışır",
    navAbout: "Hakkında",
    navContact: "İletişim",
    navDashboard: "Panel",
    navLogin: "Giriş",
    navRegister: "Hesap oluştur",
    backToHome: "Ana sayfaya dön",
    orgsOnTurkiyejobs: "TürkiyeJobs'taki kuruluşlar",
  };

  let trInner = enInner;
  for (const [key, val] of Object.entries(trOverrides)) {
    const re = new RegExp(`(${key}:\\s*")([^"]*)(")`, "s");
    trInner = trInner.replace(re, `$1${val.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}$3`);
  }

  const trBlock = `  // ═══════════════════════════════════════════════════════════════════════════
  //  TURKISH
  // TODO: extend Turkish translations to remaining pages
  // ═══════════════════════════════════════════════════════════════════════════
  tr: {${trInner}
  },`;

  const newContent = enBlock.replace(/\},\s*$/, `},\n\n${trBlock}`) + tail;
  fs.writeFileSync(file, newContent);
}

function patchLocaleType(file, typeName) {
  let s = fs.readFileSync(file, "utf8");
  s = s.replace(new RegExp(`export type ${typeName} = "en" \\| "ar";`), `export type ${typeName} = "en" | "tr";`);
  s = s.replace(/\n  ar: \{[\s\S]*?\n  \},/m, "");
  s = s.replace(/MasrJobs/g, "TürkiyeJobs");
  s = s.replace(/Egypt's/g, "Türkiye's");
  s = s.replace(/Egypt/g, "Türkiye");
  fs.writeFileSync(file, s);
}

patchHome();
for (const f of [
  "about-translations.ts",
  "impact-translations.ts",
  "how-it-works-translations.ts",
  "events-translations.ts",
]) {
  const p = path.join(root, "src/lib/i18n", f);
  const type =
    f === "about-translations.ts"
      ? "AboutLocale"
      : f === "impact-translations.ts"
        ? "ImpactLocale"
        : f === "how-it-works-translations.ts"
          ? "HowItWorksLocale"
          : "EventsLocale";
  if (f !== "about-translations.ts") patchLocaleType(p, type);
}

console.log("i18n patch done");
