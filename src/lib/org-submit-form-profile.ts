import type { OpportunityCategory } from "@/lib/types";

export type OrgFormMode =
  | "job"
  | "consultancy"
  | "training"
  | "volunteer"
  | "tender"
  | "grant";

const LISTING_TYPES_BY_CATEGORY: Record<
  OpportunityCategory,
  readonly string[]
> = {
  Jobs: [
    "Full-time",
    "Part-time",
    "Fixed-term contract",
    "Fellowship",
    "Internship",
    "Other",
  ],
  Consultancies: [
    "Consultancy / technical assistance",
    "Fixed-term contract",
    "Full-time",
    "Other",
  ],
  Trainings: ["Training / workshop / course", "Other"],
  "Volunteer Roles": ["Volunteer placement", "Internship", "Other"],
  Tenders: ["Tender / RFQ / RFP", "Other"],
  Grants: ["Grant / call for proposals", "Other"],
};

export function listingTypesForCategory(
  category: OpportunityCategory,
): string[] {
  return [...LISTING_TYPES_BY_CATEGORY[category]];
}

function resolveMode(
  category: OpportunityCategory,
  listingType: string,
): OrgFormMode {
  const t = listingType.trim().toLowerCase();
  if (t) {
    if (t.includes("tender") || t.includes("rfq") || t.includes("rfp"))
      return "tender";
    if (t.includes("grant")) return "grant";
    if (t.includes("volunteer")) return "volunteer";
    if (
      t.includes("training") ||
      t.includes("workshop") ||
      t.includes("course")
    )
      return "training";
    if (t.includes("consultancy") || t.includes("technical assistance"))
      return "consultancy";
  }
  switch (category) {
    case "Tenders":
      return "tender";
    case "Grants":
      return "grant";
    case "Volunteer Roles":
      return "volunteer";
    case "Trainings":
      return "training";
    case "Consultancies":
      return "consultancy";
    case "Jobs":
      return "job";
    default:
      return "job";
  }
}

export interface OrgSubmitFormProfile {
  mode: OrgFormMode;
  /** Shown under category + type selectors */
  hint: string;
  section2Title: string;
  section2Intro: string;
  salaryLabel: string;
  salaryPlaceholder: string;
  contractLabel: string;
  contractPlaceholder: string;
  durationLabel: string;
  durationPlaceholder: string;
  showWorkArrangement: boolean;
  showCompensationSelect: boolean;
  section3Title: string;
  shortSummaryPlaceholder: string;
  descriptionLabel: string;
  descriptionPlaceholder: string;
  requirementsLabel: string;
  requirementsPlaceholder: string;
  showCandidateGrid: boolean;
  experienceLabel: string;
  experiencePlaceholder: string;
  educationLabel: string;
  educationPlaceholder: string;
  languagesLabel: string;
  languagesPlaceholder: string;
  positionsLabel: string;
  positionsPlaceholder: string;
  sectorLabel: string;
  sectorPlaceholder: string;
  /** Procurement-style block (tender / grant) */
  showProcurementSection: boolean;
  procurementLegend: string;
  procurementIntro: string;
  referenceLabel: string;
  referencePlaceholder: string;
  budgetLabel: string;
  budgetPlaceholder: string;
  eligibilityLabel: string;
  eligibilityPlaceholder: string;
  requireProcurementFields: boolean;
  section5Title: string;
  howToApplyPlaceholder: string;
  attachmentsLabel: string;
  attachmentsPlaceholder: string;
}

export function getOrgSubmitFormProfile(
  category: OpportunityCategory,
  listingType: string,
): OrgSubmitFormProfile {
  const mode = resolveMode(category, listingType);

  const base = {
    showWorkArrangement: true,
    showCompensationSelect: true,
    showCandidateGrid: true,
    showProcurementSection: false,
    requireProcurementFields: false,
    procurementLegend: "",
    procurementIntro: "",
    referenceLabel: "Reference number / package ID",
    referencePlaceholder: "",
    budgetLabel: "Estimated budget / envelope",
    budgetPlaceholder: "",
    eligibilityLabel: "Eligibility & restrictions",
    eligibilityPlaceholder: "",
    section5Title: "How to apply & attachments",
    attachmentsLabel: "Link to TOR, SOW, annexes, or application pack (optional)",
    attachmentsPlaceholder:
      "Google Drive, Dropbox, or your website — optional for this listing type",
  } satisfies Partial<OrgSubmitFormProfile>;

  if (mode === "tender") {
    return {
      ...base,
      mode,
      hint: "You are posting a procurement opportunity. Focus on scope, evaluation criteria, deadlines, and submission rules.",
      section2Title: "Submission logistics & commercial terms",
      section2Intro:
        "Where and how bids are received, site visits or briefings, and any commercial conditions.",
      salaryLabel: "Fees / bid bonds / price format (if applicable)",
      salaryPlaceholder:
        "e.g. Fixed price lot, unit rates table, bid bond 2%, VAT excluded",
      contractLabel: "Contract award type / framework",
      contractPlaceholder:
        "e.g. Single lot, multiple awards, framework with call-offs",
      durationLabel: "Assignment or contract period (if known)",
      durationPlaceholder: "e.g. 18 months from signature",
      section3Title: "Scope, deliverables & evaluation",
      shortSummaryPlaceholder:
        "One short paragraph: what is being procured and why it matters.",
      descriptionLabel: "Full scope of work & specifications",
      descriptionPlaceholder:
        "Technical scope, milestones, reporting, site of performance, KPIs, and how bids will be evaluated.",
      requirementsLabel: "Mandatory qualifications & compliance",
      requirementsPlaceholder:
        "Registration, tax certificates, experience thresholds, joint venture rules, local content, insurance, etc.",
      showCandidateGrid: false,
      experienceLabel: "",
      experiencePlaceholder: "",
      educationLabel: "",
      educationPlaceholder: "",
      languagesLabel: "",
      languagesPlaceholder: "",
      positionsLabel: "Lots / packages / quantities",
      positionsPlaceholder: "e.g. Lot A civil works, Lot B M&E supervision",
      sectorLabel: "Sector / programme reference",
      sectorPlaceholder: "e.g. WASH infrastructure — Upper Türkiye",
      showProcurementSection: true,
      procurementLegend: "Procurement identifiers",
      procurementIntro:
        "These fields help applicants and reviewers identify the opportunity quickly.",
      referencePlaceholder: "e.g. RFQ-2026-ORG-014",
      budgetPlaceholder: "e.g. TRY ceiling 5.2M inclusive of all taxes",
      eligibilityPlaceholder:
        "Who may bid, ineligible entities, national preferences, co-financing…",
      requireProcurementFields: true,
      section5Title: "Bid submission & documents",
      howToApplyPlaceholder:
        "Exact submission channel (portal, sealed envelope), required forms, number of copies, clarification window, and opening date/time.",
      attachmentsLabel: "Link to full tender pack / BoQ / drawings (strongly recommended)",
      attachmentsPlaceholder: "Direct link to ZIP, portal, or document repository",
    };
  }

  if (mode === "grant") {
    return {
      ...base,
      mode,
      hint: "You are publishing a grant or call for proposals. Emphasise outcomes, eligibility, and assessment.",
      section2Title: "Funding window, location & modalities",
      section2Intro:
        "Where activities may take place, grant size, and how partners will engage.",
      salaryLabel: "Grant size / ceiling per award",
      salaryPlaceholder: "e.g. Up to USD 50,000 per organisation; co-finance 20%",
      contractLabel: "Grant mechanism & duration",
      contractPlaceholder: "e.g. Fixed grant 12 months; milestone-based tranches",
      durationLabel: "Implementation period",
      durationPlaceholder: "e.g. 24 months including inception workshop",
      section3Title: "Programme narrative & requirements",
      shortSummaryPlaceholder:
        "What change you seek, target groups, and geographic focus in 2–4 sentences.",
      descriptionLabel: "Objectives, outcomes, and activities",
      descriptionPlaceholder:
        "Theory of change, expected outputs, M&E approach, safeguarding, and partnership model.",
      requirementsLabel: "Applicant eligibility & capacity",
      requirementsPlaceholder:
        "Legal registration, thematic experience, audited accounts, gender policy, safeguarding focal point…",
      showCandidateGrid: true,
      experienceLabel: "Relevant programme experience",
      experiencePlaceholder: "e.g. 3+ years managing education grants in Türkiye",
      educationLabel: "Preferred team / lead qualifications",
      educationPlaceholder: "e.g. Project lead with PMP or equivalent",
      languagesLabel: "Proposal languages accepted",
      languagesPlaceholder: "e.g. Turkish proposal mandatory; summary in English",
      positionsLabel: "Number of awards / grants available",
      positionsPlaceholder: "e.g. Up to 8 grants in this window",
      sectorLabel: "Thematic priority area",
      sectorPlaceholder: "e.g. Youth livelihoods & financial inclusion",
      showProcurementSection: true,
      procurementLegend: "Grant reference & compliance",
      procurementIntro:
        "Official reference and any donor-specific compliance notes.",
      referencePlaceholder: "e.g. GCF-WINDOW2-2026-EG-04",
      budgetPlaceholder: "Total envelope for this call (if public)",
      eligibilityPlaceholder:
        "Nationality, consortium rules, match funding, ineligible costs…",
      requireProcurementFields: true,
      section5Title: "How to apply & annexes",
      howToApplyPlaceholder:
        "Portal registration, concept note vs full proposal, page limits, budget template, and assessment timeline.",
      attachmentsLabel: "Link to guidelines, templates, and budget forms",
      attachmentsPlaceholder: "Donor portal or shared folder with mandatory annexes",
    };
  }

  if (mode === "volunteer") {
    return {
      ...base,
      mode,
      hint: "Volunteer opportunities should be transparent about time commitment, support provided, and safeguarding.",
      section2Title: "Location, schedule & support",
      section2Intro:
        "When and where volunteers serve, and what the organisation provides (training, insurance, certificates).",
      salaryLabel: "Allowances, transport, or benefits (if any)",
      salaryPlaceholder:
        "e.g. Unpaid; local transport reimbursed; meals during shifts",
      contractLabel: "Time commitment & agreement type",
      contractPlaceholder: "e.g. 2 days/week for 3 months; volunteer agreement",
      durationLabel: "Volunteering period",
      durationPlaceholder: "e.g. Ramadan campaign — 4 weekends",
      showCompensationSelect: true,
      section3Title: "Role description & volunteer profile",
      shortSummaryPlaceholder:
        "What volunteers will do and who you are looking for in a few sentences.",
      descriptionLabel: "Activities, supervision, and safeguarding",
      descriptionPlaceholder:
        "Tasks, team structure, orientation, code of conduct, PSEA expectations, and support after service.",
      requirementsLabel: "Skills, age, and prerequisites",
      requirementsPlaceholder:
        "Minimum age, languages, physical requirements, background checks, and prior experience (if any).",
      showCandidateGrid: true,
      experienceLabel: "Preferred experience (optional)",
      experiencePlaceholder: "e.g. Prior community outreach helpful but not required",
      educationLabel: "Education (optional)",
      educationPlaceholder: "e.g. University students welcome",
      languagesLabel: "Languages",
      languagesPlaceholder: "e.g. Turkish conversational",
      positionsLabel: "Volunteer slots",
      positionsPlaceholder: "e.g. 15 volunteers per governorate",
      sectorLabel: "Thematic area",
      sectorPlaceholder: "e.g. Emergency distributions, digital literacy",
      showProcurementSection: false,
      requireProcurementFields: false,
      section5Title: "How to volunteer & next steps",
      howToApplyPlaceholder:
        "Sign-up link, shifts calendar, orientation date, and required documents (ID copy, etc.).",
      attachmentsLabel: "Volunteer handbook or role brief (optional)",
      attachmentsPlaceholder: "Link to PDF with expectations and FAQs",
    };
  }

  if (mode === "training") {
    return {
      ...base,
      mode,
      hint: "Training listings should clarify audience, modality, certification, and fees.",
      section2Title: "Venue, dates & fees",
      section2Intro:
        "Where the training runs (physical or virtual), schedule, and cost to participants.",
      salaryLabel: "Course fee / subsidy / employer-sponsored",
      salaryPlaceholder:
        "e.g. TRY 2,500 per seat; 20% NGO discount; fully subsidised for women-led NGOs",
      contractLabel: "Format & certification",
      contractPlaceholder: "e.g. 5-day residential; certificate of attendance; CPD points",
      durationLabel: "Total learning hours / days",
      durationPlaceholder: "e.g. 5 days (30 contact hours)",
      section3Title: "Curriculum & participant profile",
      shortSummaryPlaceholder:
        "What participants will learn and who should attend.",
      descriptionLabel: "Learning objectives, agenda outline, and materials",
      descriptionPlaceholder:
        "Modules, practical exercises, prerequisites software/tools, and post-training support.",
      requirementsLabel: "Prerequisites & selection criteria",
      requirementsPlaceholder:
        "Prior knowledge, laptop requirements, max participants, and priority groups.",
      showCandidateGrid: true,
      experienceLabel: "Professional background (optional)",
      experiencePlaceholder: "e.g. Programme officers with 1+ years field work",
      educationLabel: "Minimum education (optional)",
      educationPlaceholder: "e.g. Undergraduate students in final year",
      languagesLabel: "Language of instruction",
      languagesPlaceholder: "e.g. Turkish with English slides",
      positionsLabel: "Class size / cohorts",
      positionsPlaceholder: "e.g. 25 seats per cohort; 2 cohorts planned",
      sectorLabel: "Training theme",
      sectorPlaceholder: "e.g. MEAL for field teams, PSEA refresher",
      showProcurementSection: false,
      requireProcurementFields: false,
      section5Title: "Registration & payment",
      howToApplyPlaceholder:
        "Registration link, payment instructions, cancellation policy, and waitlist rules.",
      attachmentsLabel: "Agenda or brochure (optional)",
      attachmentsPlaceholder: "Link to PDF agenda or flyer",
    };
  }

  if (mode === "consultancy") {
    return {
      ...base,
      mode,
      hint: "Consultancies should spell out deliverables, LOE, reporting, and evaluation criteria.",
      section2Title: "Assignment location, modality & fees",
      section2Intro:
        "Where work is performed, expected presence, and how fees are structured.",
      salaryLabel: "Daily rate / lump sum / fee range",
      salaryPlaceholder: "e.g. USD 400–450/day all-inclusive; or fixed fee USD 28,000",
      contractLabel: "Contract type & LOE",
      contractPlaceholder: "e.g. 45 LOE days over 6 months; deliverables-based",
      durationLabel: "Assignment duration",
      durationPlaceholder: "e.g. Inception to final report — 5 months",
      section3Title: "Scope of work & qualifications",
      shortSummaryPlaceholder:
        "Purpose of the assignment and headline deliverables.",
      descriptionLabel: "Detailed scope, tasks, and reporting",
      descriptionPlaceholder:
        "Background, specific tasks, milestones, stakeholders, travel, and quality standards.",
      requirementsLabel: "Expertise & team composition",
      requirementsPlaceholder:
        "Years of experience, sector expertise, methodology, and key expert CV requirements.",
      showCandidateGrid: true,
      experienceLabel: "Minimum years of relevant experience",
      experiencePlaceholder: "e.g. 8+ years in evaluations in MENA",
      educationLabel: "Academic / professional qualifications",
      educationPlaceholder: "e.g. Master’s in economics or equivalent",
      languagesLabel: "Working languages",
      languagesPlaceholder: "e.g. Turkish & English — proposals in English",
      positionsLabel: "Number of consultants / firms",
      positionsPlaceholder: "e.g. Single firm; lead + deputy required",
      sectorLabel: "Technical area",
      sectorPlaceholder: "e.g. Mid-term evaluation of livelihoods programme",
      showProcurementSection: false,
      requireProcurementFields: false,
      section5Title: "Submission instructions",
      howToApplyPlaceholder:
        "EOI format, technical & financial proposal structure, page limits, and validity period.",
      attachmentsLabel: "ToR / RFP pack (recommended)",
      attachmentsPlaceholder: "Link to full terms of reference and annexes",
    };
  }

  /* mode === "job" */
  return {
    ...base,
    mode: "job",
    hint: "You are posting an employment or fixed-term staff role. Be specific about contract, pay band, and duties.",
    section2Title: "Role location, contract & compensation",
    section2Intro:
      "Standard employment details help candidates assess fit quickly.",
    salaryLabel: "Salary band, allowances, or pay scale (if applicable)",
    salaryPlaceholder:
      "e.g. TRY 28,000–32,000 gross + medical; or UND P2 equivalent",
    contractLabel: "Contract type & grade (if applicable)",
    contractPlaceholder: "e.g. National staff, G5, 12-month renewable",
    durationLabel: "Contract length (if fixed-term)",
    durationPlaceholder: "e.g. 12 months with possible extension",
    section3Title: "Role description & candidate requirements",
    shortSummaryPlaceholder:
      "2–4 sentences for search results: role essence and level.",
    descriptionLabel: "Full job description",
    descriptionPlaceholder:
      "Reporting line, key responsibilities, % travel, team context, and organisational values.",
    requirementsLabel: "Requirements & qualifications",
    requirementsPlaceholder:
      "Education, years of experience, technical competencies, languages, and legal work eligibility in Türkiye.",
    showCandidateGrid: true,
    experienceLabel: "Experience level",
    experiencePlaceholder: "e.g. 3–5 years in MEAL for INGOs",
    educationLabel: "Education",
    educationPlaceholder: "e.g. Bachelor’s in development studies or equivalent",
    languagesLabel: "Languages",
    languagesPlaceholder: "e.g. Turkish native, English C1",
    positionsLabel: "Number of positions",
    positionsPlaceholder: "e.g. 1 national position",
    sectorLabel: "Sector / programme",
    sectorPlaceholder: "e.g. Child protection — community-based programmes",
    showProcurementSection: false,
    requireProcurementFields: false,
    section5Title: "How to apply & attachments",
    howToApplyPlaceholder:
      "CV format, cover letter, references, and subject line for email applications.",
    attachmentsLabel: "Link to internal JD or annexes (optional)",
    attachmentsPlaceholder: "Optional link to longer PDF job description",
  };
}
