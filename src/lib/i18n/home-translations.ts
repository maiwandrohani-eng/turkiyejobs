import type { AppLocale } from "@/lib/i18n/locale";

export type HomeLocale = AppLocale;

export const HOME_TRANSLATIONS = {
  en: {
    // ── Hero ─────────────────────────────────────────────────────────────────
    heroBadge: "Türkiye's NGO & Development Sector Jobs Platform",
    heroHeading: "Trusted jobs, consultancies, and grants for Türkiye's NGO and humanitarian sector",
    heroLine1:
      "Find verified NGO jobs, consultancies, and grants in Türkiye's development and humanitarian sector.",
    heroLine2:
      "Post your opening and reach professionals who are already here for this work.",
    heroTrust: "Every employer verified. Every listing reviewed.",
    heroCardTitle: "Search & filter",
    heroCardBody:
      "Category, location, employer, deadline, remote/hybrid, paid or unpaid — built for busy recruiters and applicants.",
    heroCardCta: "Start searching",
    ctaPrimary: "Browse opportunities",
    ctaSecondary: "Post a listing →",

    // ── Newsletter ────────────────────────────────────────────────────────────
    newsletterHeading: "Get new opportunities in your inbox every week.",
    newsletterSubtext: "No spam — only what's posted on TürkiyeJobs.",
    newsletterButton: "Subscribe",

    // ── Employer CTA ──────────────────────────────────────────────────────────
    employerHeading: "Are you hiring?",
    employerBody:
      "TürkiyeJobs.org was built for Türkiye's NGO and humanitarian ecosystem. Post your listing and reach professionals who are already here.",
    employerButton: "Post a listing →",
    employerSupport:
      "Every organization account and every listing is individually reviewed before going live.",

    // ── Navigation ────────────────────────────────────────────────────────────
    navOpportunities: "Opportunities",
    navOrganizations: "Organizations",
    navResources: "Resources",
    navHowItWorks: "How it works",
    navAbout: "About",
    navContact: "Contact",
    navDashboard: "Dashboard",
    navLogin: "Log in",
    navRegister: "Create account",
    navOpenMenu: "Open menu",
    navCloseMenu: "Close menu",

    // ── Utilities ─────────────────────────────────────────────────────────────
    backToHome: "Back to home",
    readMore: "Read more →",
    exploreListings: "Explore listings →",
    viewListings: "View listings →",
    loading: "Loading…",

    // ── Organizations strip (homepage) ────────────────────────────────────────
    orgsOnTurkiyejobs: "Organizations on TürkiyeJobs",

    // ── HomeCatalog ────────────────────────────────────────────────────────────
    catalogFeaturedHeading: "Featured opportunities",
    catalogFeaturedSubtext:
      "Hand-picked and newly approved listings across Türkiye's social impact sector.",
    catalogLatestHeading: "Latest opportunities",
    catalogLatestSubtext: "Recently updated deadlines and new postings.",
    catalogSeeFullList: "See full list",
    catalogLoading: "Loading opportunities…",
    catalogFeaturedEmpty:
      "No featured opportunities right now. Browse all roles to discover what is open.",
    catalogLatestEmpty: "No opportunities to show in this section yet.",
    catalogViewAll: "View all opportunities",
    catalogCreateAccount: "Create free account",
    catalogLayoutLabel: "Featured and latest opportunity layout",

    // ── HomeExplore ────────────────────────────────────────────────────────────
    exploreHeading: "Explore the platform",
    exploreSubtext:
      "Guides and hubs beyond the job board — built to help applicants and employers get more from TürkiyeJobs.org.",
    explorePostingGuidelines: "Posting guidelines (employers)",
    explorePartnersLink: "Partners",
    exploreCard1Title: "How TürkiyeJobs works",
    exploreCard1Text:
      "Who can post, how review works, and what verified employers mean.",
    exploreCard2Title: "Browse by theme",
    exploreCard2Text:
      "Jump to jobs, consultancies, trainings, and more by category or focus area.",
    exploreCard3Title: "Application checklist",
    exploreCard3Text: "Prepare a strong internal application before you hit submit.",
    exploreCard4Title: "Events & deadlines",
    exploreCard4Text:
      "Workshops, webinars, and milestone dates worth adding to your calendar.",
    exploreCard5Title: "Employer spotlights",
    exploreCard5Text:
      "Short reads on how teams hire and what they look for in candidates.",
    exploreCard6Title: "Our commitments",
    exploreCard6Text:
      "How we verify employers, review listings, and protect applicants.",

    // ── Early-access capture (HomeCategorySection) ────────────────────────────
    earlyLaunchText: "Early launch — new listings being added.",
    earlyEmailRequired: "Please enter your email.",
    earlyError: "Something went wrong. Please try again.",
    earlyAlreadyOnList:
      "You're already on the list — we'll notify you when more listings go live.",
    earlyThankYou: "Thanks — we'll notify you when more listings go live.",
    earlyNetworkError: "Network error. Please try again.",
    earlySaving: "Saving…",

    // ── Opportunities page ────────────────────────────────────────────────────
    opportunitiesEyebrow: "Opportunities",
    opportunitiesTitle: "Browse roles, consultancies, trainings, and more",
    opportunitiesDescription:
      "Filter by category, location, organization, work arrangement, and deadline. Listings posted by organizations appear here after admin approval.",
    opportunitiesLoading: "Loading opportunities…",

    // ── Opportunities explorer filters ────────────────────────────────────────
    filterKeyword: "Keyword",
    filterKeywordPlaceholder: "Search titles, orgs…",
    filterCategory: "Category",
    filterAllCategories: "All categories",
    filterOrganization: "Organization",
    filterAllOrganizations: "All organizations",
    filterLocation: "Location contains",
    filterLocationPlaceholder: "e.g. Ankara",
    filterType: "Type",
    filterAllTypes: "All types",
    filterWorkArrangement: "Work arrangement",
    filterCompensation: "Compensation",
    filterDeadline: "Deadline on or before",
    filterAny: "Any",
    filterRemote: "Remote",
    filterHybrid: "Hybrid",
    filterOnSite: "On-site",
    filterPaid: "Paid",
    filterUnpaid: "Unpaid",
    filterClearAll: "Clear filters",
    filterShowing: "Showing",
    filterOpportunitiesCount: "opportunities",
    filterNoMatch:
      "No opportunities match these filters. Try clearing filters or broadening your search.",
    filterLayoutLabel: "Opportunity browse layout",

    // ── Organizations directory ────────────────────────────────────────────────
    organizationsEyebrow: "Directory",
    organizationsTitle: "Organization directory",
    organizationsDescription:
      "Explore NGOs, UN agencies, and social impact employers posting on TürkiyeJobs.org. Verified and featured badges help you spot trusted partners.",
    orgDirectoryCount: "organizations",
    orgDirectoryLayoutLabel: "Organization directory layout",
    orgDirectoryFeatured: "Featured",
    orgDirectoryVerified: "Verified",
    orgDirectoryPendingVerification: "Verification pending",
    orgDirectoryPendingVerificationShort: "Pending verification",
    orgDirectoryViewProfile: "View profile",
    orgDirectoryViewOpportunities: "View opportunities",
    orgDirectoryWebsite: "Website",
    orgDirectorySocialImpact: "Social impact",

    // ── Footer ────────────────────────────────────────────────────────────────
    footerTagline: "Verified NGO jobs and opportunities for Türkiye's development and humanitarian sector.",
    footerPlatformCol: "Platform",
    footerOpportunities: "Opportunities",
    footerOrganizations: "Organizations",
    footerResources: "Resources",
    footerHowItWorks: "How it works",
    footerBrowseTheme: "Browse by theme",
    footerPostingGuidelines: "Posting guidelines",
    footerEvents: "Events",
    footerCompanyCol: "Company",
    footerAbout: "About",
    footerContact: "Contact",
    footerPartners: "Partners",
    footerTransparency: "Transparency",
    footerSpotlights: "Employer spotlights",
    footerLegalCol: "Legal",
    footerTerms: "Terms",
    footerPrivacy: "Privacy",
    footerCopyright: "© 2026 TürkiyeJobs.org. All rights reserved.",
    footerBuiltFor: "Built for Türkiye's NGO and humanitarian ecosystem.",

    // ── Sectors page ──────────────────────────────────────────────────────────
    sectorsEyebrow: "Discover",
    sectorsTitle: "Browse by theme",
    sectorsDescription:
      "Each card opens the public opportunities list with the matching category filter. You can still refine by keyword, location, and organization.",
    sectorsPreferGrid: "Prefer the full grid?",
    sectorsOpenAll: "Open all opportunities",
    sectorsOr: "or read",
    sectorsHowItWorksLink: "how the platform works",
    sectorsJobsTitle: "Jobs & fixed-term roles",
    sectorsJobsBlurb: "National and programme staff, fellows, and internships.",
    sectorsConsultanciesTitle: "Consultancies & TA",
    sectorsConsultanciesBlurb: "Evaluations, research, and short-term expert support.",
    sectorsTrainingsTitle: "Trainings & courses",
    sectorsTrainingsBlurb: "Workshops, certifications, and cohort-based learning.",
    sectorsVolunteerTitle: "Volunteer roles",
    sectorsVolunteerBlurb: "Unpaid placements and structured volunteering.",
    sectorsTendersTitle: "Tenders & procurement",
    sectorsTendersBlurb: "RFQs, RFPs, and service contracts.",
    sectorsGrantsTitle: "Grants & calls",
    sectorsGrantsBlurb: "Funding windows and partnership opportunities.",

    // ── Spotlights page ────────────────────────────────────────────────────────
    spotlightsEyebrow: "Employers",
    spotlightsTitle: "Employer spotlights",
    spotlightsDescription:
      "Short reads on hiring norms in Türkiye's social impact sector — editorial guidance, not quotes from individual employers.",
    spotlightsFooterBefore:
      "If your organization would like a structured spotlight interview for this page in the future, mention it when you",
    spotlightsFooterLinkLabel: "contact us",
    spotlightsFooterAfter: ".",
    spotlightsCard1Org: "Humanitarian & health programmes",
    spotlightsCard1Title: "Clarity beats volume",
    spotlightsCard1Body:
      "Teams that respond fastest often run shortlisting against the TOR line-by-line. They look for evidence of delivery in similar contexts — not generic corporate language.",
    spotlightsCard2Org: "National NGOs",
    spotlightsCard2Title: "Turkish–English balance",
    spotlightsCard2Body:
      "Many roles require fluent Turkish for communities and strong English for reporting. Candidates who state CEFR or workplace level honestly save everyone time in interview.",
    spotlightsCard3Org: "Consultancies & evaluations",
    spotlightsCard3Title: "Methodology and ethics",
    spotlightsCard3Body:
      "Evaluators want to see how you handle data protection, consent, and inclusion in sampling. A two-paragraph methodology sketch in your expression of interest can carry more weight than a long biography.",

    // ── Partners page ─────────────────────────────────────────────────────────
    partnersEyebrow: "TürkiyeJobs.org",
    partnersTitle: "Partners & collaboration",
    partnersDescription:
      "TürkiyeJobs.org grows through trusted employers, networks, and funders who care about transparent hiring in Türkiye's NGO and development space.",
    partnersPara1:
      "We are building space for mission-aligned partners: NGOs posting roles, universities linking graduates, donors who care about workforce development, and media amplifying impact careers.",
    partnersPara2Before:
      "If you represent an institution that wants to explore co-branded content, events, or data ethics guardrails for listings, start a conversation through",
    partnersPara2LinkLabel: "Contact",
    partnersPara2After: ".",
    partnersPlaceholder:
      "Partner logos and joint announcements can live here as relationships formalize.",

    // ── Contact page ──────────────────────────────────────────────────────────
    contactEyebrow: "Contact",
    contactTitle: "We would love to hear from you",
    contactDescription:
      "Partnerships, media, employer onboarding, or technical support — send us a note and we will route it to the right team.",
    contactFormName: "Name",
    contactFormEmail: "Email",
    contactFormSubject: "Subject",
    contactFormMessage: "Message",
    contactFormSend: "Send message",
    contactFormSending: "Sending…",
    contactFormSuccess:
      "Thank you — TürkiyeJobs.org received your message and will reply as soon as we can. Check your inbox for a confirmation email.",
    contactFormError:
      "Something went wrong. Please try again or email hello@turkiyejobs.org.",
    contactFormNetworkError:
      "Network error. Please try again or email hello@turkiyejobs.org.",
    contactFormCheckError: "Please check the form and try again.",
    contactSidebarSocial: "Social",

    // ── Posting guidelines page ───────────────────────────────────────────────
    postingEyebrow: "Employers",
    postingTitle: "Posting guidelines",
    postingDescription:
      "Clear, complete listings get better applicants and spend less time in review. Use this checklist before you submit.",
    postingBasicsHeading: "Basics",
    postingBasics1:
      "Use a specific title (role + programme or location level), not only a project acronym.",
    postingBasics2Before: "Set a realistic",
    postingBasics2Bold: "deadline",
    postingBasics2After:
      "and keep application instructions consistent across the short summary and full description.",
    postingBasics3:
      "State location, modality (remote / hybrid / on-site), and language requirements up front.",
    postingCompHeading: "Compensation & logistics",
    postingComp1: "Clarify paid vs volunteer, stipend, or unpaid where relevant.",
    postingComp2:
      "For consultancies and tenders: mention deliverables, LOE or lot structure, and evaluation approach.",
    postingComp3:
      "For trainings: dates, modality, fees or subsidies, and prerequisites.",
    postingApplyHeading: "How to apply",
    postingApply1:
      "Choose the application channel that matches how you will actually process candidates.",
    postingApply2:
      "If you use email, use a monitored inbox and say what to put in the subject line.",
    postingApply3:
      "If you use an external portal, verify the link works for logged-out users.",
    postingReadyBefore: "Ready to post?",
    postingReadyLinkLabel: "Open the organization workspace →",

    // ── Resources page ────────────────────────────────────────────────────────
    resourcesEyebrow: "Resources",
    resourcesTitle: "Career guidance & NGO sector tips",
    resourcesDescription:
      "Practical articles for candidates and employers in Türkiye's social impact ecosystem.",
    resourcesNewsletterHeading:
      "Get new opportunities in your inbox every week. No spam — only what's posted on TürkiyeJobs.",
    resourcesNewsletterButton: "Subscribe",
    resourcesNewsletterPlaceholder: "Your email address",
    resourcesReadyBefore: "Ready to search live roles?",
    resourcesBrowseLink: "Browse opportunities",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  //  TURKISH
  // TODO: extend Turkish translations to remaining pages
  // ═══════════════════════════════════════════════════════════════════════════
  tr: {
    // ── Hero ─────────────────────────────────────────────────────────────────
    heroBadge: "Türkiye STK ve kalkınma sektörü iş platformu",
    heroHeading:
      "Türkiye'nin STK ve insani yardım sektörü için güvenilir iş, danışmanlık ve hibe ilanları",
    heroLine1:
      "Türkiye'nin sivil toplum ve insani yardım sektöründe doğrulanmış iş ilanlarını, danışmanlıkları ve hibeleri bulun.",
    heroLine2:
      "İlanınızı yayınlayın ve bu iş için burada olan profesyonellere ulaşın.",
    heroTrust: "Her işveren doğrulandı. Her ilan incelendi.",
    heroCardTitle: "Ara ve filtrele",
    heroCardBody:
      "Kategori, konum, kuruluş, son tarih, uzaktan/hibrit, ücretli veya gönüllü — yoğun işe alım süreçleri için.",
    heroCardCta: "Aramaya başla",
    ctaPrimary: "Fırsatları İncele",
    ctaSecondary: "İlan Ver →",

    // ── Newsletter ────────────────────────────────────────────────────────────
    newsletterHeading: "Her hafta yeni fırsatları e-postanıza alın.",
    newsletterSubtext: "Spam yok — yalnızca TürkiyeJobs'ta yayınlananlar.",
    newsletterButton: "Abone Ol",

    // ── Employer CTA ──────────────────────────────────────────────────────────
    employerHeading: "İşe mi alıyorsunuz?",
    employerBody:
      "TürkiyeJobs.org, Türkiye'nin STK ekosistemi için kuruldu. İlanınızı yayınlayın ve profesyonellere ulaşın.",
    employerButton: "İlan Ver →",
    employerSupport:
      "Her kuruluş hesabı ve her ilan yayına girmeden önce ayrı ayrı incelenir.",

    // ── Navigation ────────────────────────────────────────────────────────────
    navOpportunities: "Fırsatlar",
    navOrganizations: "Kuruluşlar",
    navResources: "Kaynaklar",
    navHowItWorks: "Nasıl çalışır",
    navAbout: "Hakkında",
    navContact: "İletişim",
    navDashboard: "Panel",
    navLogin: "Giriş",
    navRegister: "Hesap oluştur",
    navOpenMenu: "Menüyü aç",
    navCloseMenu: "Menüyü kapat",

    // ── Utilities ─────────────────────────────────────────────────────────────
    backToHome: "Ana sayfaya dön",
    readMore: "Devamını oku →",
    exploreListings: "İlanlara göz at →",
    viewListings: "İlanları gör →",
    loading: "Yükleniyor…",

    // ── Organizations strip (homepage) ────────────────────────────────────────
    orgsOnTurkiyejobs: "TürkiyeJobs'taki kuruluşlar",

    // ── HomeCatalog ────────────────────────────────────────────────────────────
    catalogFeaturedHeading: "Öne çıkan fırsatlar",
    catalogFeaturedSubtext:
      "Türkiye'nin sosyal etki sektöründe seçilmiş ve yeni onaylanmış ilanlar.",
    catalogLatestHeading: "Son fırsatlar",
    catalogLatestSubtext: "Yakın zamanda güncellenen son tarihler ve yeni ilanlar.",
    catalogSeeFullList: "Tüm listeyi gör",
    catalogLoading: "Fırsatlar yükleniyor…",
    catalogFeaturedEmpty:
      "Şu an öne çıkan fırsat yok. Açık roller için tüm ilanlara göz atın.",
    catalogLatestEmpty: "Bu bölümde henüz gösterilecek fırsat yok.",
    catalogViewAll: "Tüm fırsatları gör",
    catalogCreateAccount: "Ücretsiz hesap oluştur",
    catalogLayoutLabel: "Öne çıkan ve son fırsatlar düzeni",

    // ── HomeExplore ────────────────────────────────────────────────────────────
    exploreHeading: "Platformu keşfedin",
    exploreSubtext:
      "İş panosunun ötesinde rehberler ve merkezler — adayların ve işverenlerin TürkiyeJobs.org'dan daha fazlasını almasına yardımcı olmak için.",
    explorePostingGuidelines: "İlan rehberi (işverenler)",
    explorePartnersLink: "Ortaklar",
    exploreCard1Title: "TürkiyeJobs nasıl çalışır",
    exploreCard1Text:
      "Kimlerin ilan verebileceği, incelemenin nasıl işlediği ve doğrulanmış işverenlerin ne anlama geldiği.",
    exploreCard2Title: "Temaya göre göz at",
    exploreCard2Text:
      "Kategori veya odak alanına göre iş, danışmanlık, eğitim ve daha fazlasına atlayın.",
    exploreCard3Title: "Başvuru kontrol listesi",
    exploreCard3Text: "Göndermeden önce güçlü bir dahili başvuru hazırlayın.",
    exploreCard4Title: "Etkinlikler ve son tarihler",
    exploreCard4Text:
      "Takviminize eklemeye değer atölyeler, webinarlar ve önemli tarihler.",
    exploreCard5Title: "İşveren spotları",
    exploreCard5Text:
      "Ekiplerin nasıl işe aldığı ve adaylarda ne aradığı hakkında kısa okumalar.",
    exploreCard6Title: "Taahhütlerimiz",
    exploreCard6Text:
      "İşverenleri nasıl doğruladığımız, ilanları nasıl incelediğimiz ve adayları nasıl koruduğumuz.",

    // ── Early-access capture (HomeCategorySection) ────────────────────────────
    earlyLaunchText: "Erken lansman — yeni ilanlar ekleniyor.",
    earlyEmailRequired: "Lütfen e-posta adresinizi girin.",
    earlyError: "Bir şeyler ters gitti. Lütfen tekrar deneyin.",
    earlyAlreadyOnList:
      "Zaten listedesiniz — daha fazla ilan yayınlandığında sizi bilgilendireceğiz.",
    earlyThankYou: "Teşekkürler — daha fazla ilan yayınlandığında sizi bilgilendireceğiz.",
    earlyNetworkError: "Ağ hatası. Lütfen tekrar deneyin.",
    earlySaving: "Kaydediliyor…",

    // ── Opportunities page ────────────────────────────────────────────────────
    opportunitiesEyebrow: "Fırsatlar",
    opportunitiesTitle: "İş, danışmanlık, eğitim ve daha fazlasına göz atın",
    opportunitiesDescription:
      "Kategori, konum, kuruluş, çalışma şekli ve son tarihe göre filtreleyin. Kuruluşların yayınladığı ilanlar yönetici onayından sonra burada görünür.",
    opportunitiesLoading: "Fırsatlar yükleniyor…",

    // ── Opportunities explorer filters ────────────────────────────────────────
    filterKeyword: "Anahtar kelime",
    filterKeywordPlaceholder: "Başlık, kuruluş ara…",
    filterCategory: "Kategori",
    filterAllCategories: "Tüm kategoriler",
    filterOrganization: "Kuruluş",
    filterAllOrganizations: "Tüm kuruluşlar",
    filterLocation: "Konum",
    filterLocationPlaceholder: "ör. Ankara",
    filterType: "Tür",
    filterAllTypes: "Tüm türler",
    filterWorkArrangement: "Çalışma şekli",
    filterCompensation: "Ücretlendirme",
    filterDeadline: "Son tarih (en geç)",
    filterAny: "Tümü",
    filterRemote: "Uzaktan",
    filterHybrid: "Hibrit",
    filterOnSite: "Yerinde",
    filterPaid: "Ücretli",
    filterUnpaid: "Ücretsiz",
    filterClearAll: "Filtreleri temizle",
    filterShowing: "Gösterilen",
    filterOpportunitiesCount: "fırsat",
    filterNoMatch:
      "Bu filtrelere uyan fırsat yok. Filtreleri temizleyin veya aramayı genişletin.",
    filterLayoutLabel: "Fırsat listesi görünümü",

    // ── Organizations directory ────────────────────────────────────────────────
    organizationsEyebrow: "Dizin",
    organizationsTitle: "Kuruluş dizini",
    organizationsDescription:
      "TürkiyeJobs.org'da ilan veren STK'ları, BM ajanslarını ve sosyal etki işverenlerini keşfedin. Doğrulanmış ve öne çıkan rozetler güvenilir ortakları görmenize yardımcı olur.",
    orgDirectoryCount: "kuruluş",
    orgDirectoryLayoutLabel: "Kuruluş dizini düzeni",
    orgDirectoryFeatured: "Öne çıkan",
    orgDirectoryVerified: "Doğrulanmış",
    orgDirectoryPendingVerification: "Doğrulama bekleniyor",
    orgDirectoryPendingVerificationShort: "Doğrulama bekliyor",
    orgDirectoryViewProfile: "Profili gör",
    orgDirectoryViewOpportunities: "Fırsatları gör",
    orgDirectoryWebsite: "Web sitesi",
    orgDirectorySocialImpact: "Sosyal etki",

    // ── Footer ────────────────────────────────────────────────────────────────
    footerTagline: "Türkiye'nin kalkınma ve insani yardım sektörü için doğrulanmış STK işleri ve fırsatlar.",
    footerPlatformCol: "Platform",
    footerOpportunities: "Fırsatlar",
    footerOrganizations: "Kuruluşlar",
    footerResources: "Kaynaklar",
    footerHowItWorks: "Nasıl çalışır",
    footerBrowseTheme: "Temaya göre göz at",
    footerPostingGuidelines: "İlan rehberi",
    footerEvents: "Etkinlikler",
    footerCompanyCol: "Şirket",
    footerAbout: "Hakkında",
    footerContact: "İletişim",
    footerPartners: "Ortaklar",
    footerTransparency: "Şeffaflık",
    footerSpotlights: "İşveren spotları",
    footerLegalCol: "Yasal",
    footerTerms: "Koşullar",
    footerPrivacy: "Gizlilik",
    footerCopyright: "© 2026 TürkiyeJobs.org. Tüm hakları saklıdır.",
    footerBuiltFor: "Türkiye'nin STK ve insani yardım ekosistemi için geliştirildi.",

    // ── Sectors page ──────────────────────────────────────────────────────────
    sectorsEyebrow: "Keşfet",
    sectorsTitle: "Temaya göre göz at",
    sectorsDescription:
      "Her kart, eşleşen kategori filtresiyle genel fırsatlar listesini açar. Anahtar kelime, konum ve kuruluşa göre daraltmaya devam edebilirsiniz.",
    sectorsPreferGrid: "Tam listeyi mi tercih edersiniz?",
    sectorsOpenAll: "Tüm fırsatları aç",
    sectorsOr: "veya okuyun",
    sectorsHowItWorksLink: "platform nasıl çalışır",
    sectorsJobsTitle: "İşler ve belirli süreli roller",
    sectorsJobsBlurb: "Ulusal ve program personeli, bursiyerler ve stajyerler.",
    sectorsConsultanciesTitle: "Danışmanlıklar ve teknik destek",
    sectorsConsultanciesBlurb: "Değerlendirmeler, araştırma ve kısa süreli uzman desteği.",
    sectorsTrainingsTitle: "Eğitimler ve kurslar",
    sectorsTrainingsBlurb: "Atölyeler, sertifikalar ve kohort tabanlı öğrenme.",
    sectorsVolunteerTitle: "Gönüllü roller",
    sectorsVolunteerBlurb: "Ücretsiz yerleştirmeler ve yapılandırılmış gönüllülük.",
    sectorsTendersTitle: "İhaleler ve tedarik",
    sectorsTendersBlurb: "Teklif talepleri, RFP'ler ve hizmet sözleşmeleri.",
    sectorsGrantsTitle: "Hibeler ve çağrılar",
    sectorsGrantsBlurb: "Finansman pencereleri ve ortaklık fırsatları.",

    // ── Spotlights page ────────────────────────────────────────────────────────
    spotlightsEyebrow: "İşverenler",
    spotlightsTitle: "İşveren spotları",
    spotlightsDescription:
      "Türkiye'nin sosyal etki sektöründe işe alım normları hakkında kısa okumalar — bireysel işveren alıntıları değil, editoryal rehberlik.",
    spotlightsFooterBefore:
      "Kuruluşunuz gelecekte bu sayfa için yapılandırılmış bir spot röportajı istiyorsa,",
    spotlightsFooterLinkLabel: "bizimle iletişime geçerken",
    spotlightsFooterAfter: " belirtin.",
    spotlightsCard1Org: "İnsani yardım ve sağlık programları",
    spotlightsCard1Title: "Netlik hacmi yener",
    spotlightsCard1Body:
      "En hızlı yanıt veren ekipler genelde TOR satır satır kısa listeleme yapar. Benzer bağlamlarda teslimat kanıtı ararlar — genel kurumsal dilden değil.",
    spotlightsCard2Org: "Ulusal STK'lar",
    spotlightsCard2Title: "Türkçe–İngilizce dengesi",
    spotlightsCard2Body:
      "Birçok rol topluluklar için akıcı Türkçe ve raporlama için güçlü İngilizce gerektirir. CEFR veya iş yeri seviyesini dürüstçe belirten adaylar mülakatta herkesin zamanını kazanır.",
    spotlightsCard3Org: "Danışmanlıklar ve değerlendirmeler",
    spotlightsCard3Title: "Metodoloji ve etik",
    spotlightsCard3Body:
      "Değerlendiriciler veri koruma, rıza ve örneklemede kapsayıcılığı nasıl ele aldığınızı görmek ister. İlgi beyanınızdaki iki paragraflık metodoloji taslağı uzun bir özgeçmişten daha ağır basabilir.",

    // ── Partners page ─────────────────────────────────────────────────────────
    partnersEyebrow: "TürkiyeJobs.org",
    partnersTitle: "Ortaklar ve iş birliği",
    partnersDescription:
      "TürkiyeJobs.org, Türkiye'nin STK ve kalkınma alanında şeffaf işe alımı önemseyen güvenilir işverenler, ağlar ve fon sağlayıcılarıyla büyür.",
    partnersPara1:
      "Misyonla uyumlu ortaklar için alan oluşturuyoruz: ilan veren STK'lar, mezunları bağlayan üniversiteler, iş gücü gelişimini önemseyen fon sağlayıcılar ve etki kariyerlerini güçlendiren medya.",
    partnersPara2Before:
      "Ortak markalı içerik, etkinlikler veya ilanlar için veri etiği korumalarını keşfetmek isteyen bir kurumu temsil ediyorsanız,",
    partnersPara2LinkLabel: "İletişim",
    partnersPara2After: " üzerinden konuşmaya başlayın.",
    partnersPlaceholder:
      "İlişkiler resmileştikçe ortak logoları ve ortak duyurular burada yer alabilir.",

    // ── Contact page ──────────────────────────────────────────────────────────
    contactEyebrow: "İletişim",
    contactTitle: "Sizden haber almak isteriz",
    contactDescription:
      "Ortaklıklar, medya, işveren kaydı veya teknik destek — mesajınızı doğru ekibe yönlendireceğiz.",
    contactFormName: "Ad",
    contactFormEmail: "E-posta",
    contactFormSubject: "Konu",
    contactFormMessage: "Mesaj",
    contactFormSend: "Mesaj gönder",
    contactFormSending: "Gönderiliyor…",
    contactFormSuccess:
      "Teşekkürler — TürkiyeJobs.org mesajınızı aldı ve en kısa sürede yanıtlayacak. Onay e-postası için gelen kutunuzu kontrol edin.",
    contactFormError:
      "Bir şeyler ters gitti. Lütfen tekrar deneyin veya hello@turkiyejobs.org adresine yazın.",
    contactFormNetworkError:
      "Ağ hatası. Lütfen tekrar deneyin veya hello@turkiyejobs.org adresine yazın.",
    contactFormCheckError: "Lütfen formu kontrol edip tekrar deneyin.",
    contactSidebarSocial: "Sosyal",

    // ── Posting guidelines page ───────────────────────────────────────────────
    postingEyebrow: "İşverenler",
    postingTitle: "İlan rehberi",
    postingDescription:
      "Net ve eksiksiz ilanlar daha iyi adaylar alır ve incelemede daha az zaman harcar. Göndermeden önce bu kontrol listesini kullanın.",
    postingBasicsHeading: "Temel bilgiler",
    postingBasics1:
      "Yalnızca proje kısaltması değil, belirli bir başlık (rol + program veya konum düzeyi) kullanın.",
    postingBasics2Before: "Gerçekçi bir ",
    postingBasics2Bold: "son tarih",
    postingBasics2After:
      " belirleyin ve kısa özet ile tam açıklamada başvuru talimatlarını tutarlı tutun.",
    postingBasics3:
      "Konumu, çalışma şeklini (uzaktan / hibrit / yerinde) ve dil gereksinimlerini baştan belirtin.",
    postingCompHeading: "Ücretlendirme ve lojistik",
    postingComp1: "İlgili yerlerde ücretli, gönüllü, burs veya ücretsiz olduğunu netleştirin.",
    postingComp2:
      "Danışmanlıklar ve ihaleler için: teslimatlar, iş yükü veya lot yapısı ve değerlendirme yaklaşımı.",
    postingComp3:
      "Eğitimler için: tarihler, şekil, ücretler veya destekler ve ön koşullar.",
    postingApplyHeading: "Nasıl başvurulur",
    postingApply1:
      "Adayları gerçekten nasıl işleyeceğinize uygun başvuru kanalını seçin.",
    postingApply2:
      "E-posta kullanıyorsanız izlenen bir gelen kutusu kullanın ve konu satırına ne yazılacağını söyleyin.",
    postingApply3:
      "Harici portal kullanıyorsanız bağlantının çıkış yapmış kullanıcılar için çalıştığını doğrulayın.",
    postingReadyBefore: "İlan vermeye hazır mısınız?",
    postingReadyLinkLabel: "Kuruluş çalışma alanını aç →",

    // ── Resources page ────────────────────────────────────────────────────────
    resourcesEyebrow: "Kaynaklar",
    resourcesTitle: "Kariyer rehberliği ve STK sektörü ipuçları",
    resourcesDescription:
      "Türkiye'nin sosyal etki ekosistemindeki adaylar ve işverenler için pratik makaleler.",
    resourcesNewsletterHeading:
      "Her hafta yeni fırsatları e-postanıza alın. Spam yok — yalnızca TürkiyeJobs'ta yayınlananlar.",
    resourcesNewsletterButton: "Abone ol",
    resourcesNewsletterPlaceholder: "E-posta adresiniz",
    resourcesReadyBefore: "Canlı ilanları aramaya hazır mısınız?",
    resourcesBrowseLink: "Fırsatlara göz at",
  
  },
} as const;

export type HomeTranslationKey = keyof (typeof HOME_TRANSLATIONS)["en"];
