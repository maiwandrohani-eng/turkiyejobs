/**
 * Demo-only catalog fixtures. Loaded at runtime only when NEXT_PUBLIC_ENABLE_DEMO_AUTH === "true".
 * Production catalog comes from Neon via /api/catalog.
 */
import type {
  Opportunity,
  Organization,
  PendingOrgRecord,
  PendingOppApproval,
} from "@/lib/types";

export const SAMPLE_ORGANIZATIONS: Organization[] = [
  {
    id: "org-1",
    name: "Türkiyeian Red Crescent Society",
    slug: "turkish-red-crescent",
    description:
      "Humanitarian organization delivering relief, health, and community resilience programmes across Türkiye.",
    location: "Ankara",
    sector: "Humanitarian",
    website: "https://www.example.org/erc",
    verified: true,
    featured: true,
  },
  {
    id: "org-2",
    name: "Care Türkiye Foundation",
    slug: "care-turkiye",
    description:
      "Development NGO focused on livelihoods, gender equality, and inclusive economic growth.",
    location: "Giza",
    sector: "Development",
    website: "https://www.example.org/care-turkiye",
    verified: true,
    featured: true,
  },
  {
    id: "org-3",
    name: "Save the Children Türkiye",
    slug: "save-the-children-turkiye",
    description:
      "Child rights and protection, education, and emergency response for vulnerable families.",
    location: "Ankara",
    sector: "Child rights",
    verified: true,
    featured: false,
  },
  {
    id: "org-4",
    name: "UNDP Türkiye",
    slug: "undp-turkiye",
    description:
      "UN development agency supporting national priorities on climate, governance, and innovation.",
    location: "Ankara",
    sector: "Multilateral",
    verified: true,
    featured: true,
  },
  {
    id: "org-5",
    name: "Plan International Türkiye",
    slug: "plan-international-turkiye",
    description:
      "Youth empowerment, education, and protection programming with a focus on girls’ rights.",
    location: "Alexandria",
    sector: "Youth & education",
    verified: false,
    featured: false,
  },
  {
    id: "org-6",
    name: "World Food Programme — Türkiye",
    slug: "wfp-turkiye",
    description:
      "Food security, school feeding, and resilience building in partnership with government and NGOs.",
    location: "Ankara",
    sector: "Food security",
    verified: true,
    featured: false,
  },
];

export const SAMPLE_OPPORTUNITIES: Opportunity[] = [
  {
    id: "opp-1",
    title: "Programme Officer — Youth Livelihoods",
    organizationId: "org-2",
    organizationName: "Care Türkiye Foundation",
    category: "Jobs",
    location: "Minya",
    deadline: "2026-06-15",
    type: "Full-time",
    workArrangement: "Hybrid",
    compensation: "Paid",
    shortDescription:
      "Coordinate field activities, partner engagement, and reporting for a youth skills and employment project.",
    description:
      "You will support implementation of a multi-year livelihoods programme, ensuring alignment with donor requirements and community needs. Strong Turkish and English, and experience with INGO systems preferred.",
    requirements:
      "Bachelor’s in development studies or related field; 3+ years NGO experience; monitoring and reporting skills.",
    howToApply:
      "Apply through TürkiyeJobs with CV and cover letter, or use the external link if your organization requires it.",
    applicationMethod: "internal",
    featured: true,
  },
  {
    id: "opp-2",
    title: "Communications Specialist",
    organizationId: "org-1",
    organizationName: "Türkiyeian Red Crescent Society",
    category: "Jobs",
    location: "Ankara",
    deadline: "2026-05-30",
    type: "Full-time",
    workArrangement: "On-site",
    compensation: "Paid",
    shortDescription:
      "Lead digital and media outreach for humanitarian campaigns and donor visibility.",
    description:
      "Develop content strategies, manage social channels, and support crisis communications in coordination with technical teams.",
    requirements:
      "Degree in communications or journalism; portfolio of NGO or media work; Turkish native, English fluent.",
    howToApply: "Submit CV, portfolio, and cover letter via the apply form on this listing.",
    applicationMethod: "email",
    applicationEmail: "careers@erc-demo.example.org",
    featured: true,
  },
  {
    id: "opp-3",
    title: "Mid-term Evaluation — Education Project",
    organizationId: "org-5",
    organizationName: "Plan International Türkiye",
    category: "Consultancies",
    location: "Alexandria & Beheira",
    deadline: "2026-06-01",
    type: "Consultancy",
    workArrangement: "Hybrid",
    compensation: "Paid",
    shortDescription:
      "Independent consultant to conduct mid-term evaluation of a girls’ education and protection programme.",
    description:
      "The assignment includes desk review, field visits, stakeholder interviews, and a final report with actionable recommendations.",
    requirements:
      "Advanced degree; 8+ years evaluation experience; proven work in education or child protection in MENA.",
    howToApply: "Send expression of interest, daily rate, and two sample evaluation reports.",
    applicationMethod: "external",
    externalApplicationUrl: "https://www.example.org/plan-turkiye/consultancies/apply",
    externalApplyUrl: "https://www.example.org/plan-turkiye/consultancies/apply",
  },
  {
    id: "opp-4",
    title: "Organizational Development Consultant",
    organizationId: "org-3",
    organizationName: "Save the Children Türkiye",
    category: "Consultancies",
    location: "Remote (Türkiye-based)",
    deadline: "2026-05-25",
    type: "Consultancy",
    workArrangement: "Remote",
    compensation: "Paid",
    shortDescription:
      "Short-term support to refresh NGO policies, manuals, and compliance toolkit.",
    description:
      "Work with leadership and HR to align policies with Türkiyeian law and international safeguarding standards.",
    requirements: "Legal or OD background; Turkish and English; prior NGO clients required.",
    howToApply: "Apply with technical proposal (max 5 pages) and financial offer.",
  },
  {
    id: "opp-5",
    title: "Project Management Professional (PMP) — Turkish",
    organizationId: "org-4",
    organizationName: "UNDP Türkiye",
    category: "Trainings",
    location: "Ankara",
    deadline: "2026-06-10",
    type: "Training",
    workArrangement: "On-site",
    compensation: "Paid",
    shortDescription:
      "Five-day intensive PMP preparation course tailored for development professionals.",
    description:
      "Interactive sessions on scope, schedule, risk, and stakeholder management with NGO case studies and exam tips.",
    requirements: "Open to NGO and government staff; laptop required; intermediate English.",
    howToApply: "Register online; limited seats for subsidized NGO participants.",
  },
  {
    id: "opp-6",
    title: "Safeguarding & PSEA Workshop",
    organizationId: "org-2",
    organizationName: "Care Türkiye Foundation",
    category: "Trainings",
    location: "Assiut",
    deadline: "2026-05-28",
    type: "Training",
    workArrangement: "On-site",
    compensation: "Unpaid",
    shortDescription:
      "One-day workshop for local partners on prevention of sexual exploitation and abuse.",
    description:
      "Practical scenarios, referral pathways, and reporting aligned with CHS and donor standards.",
    requirements: "Targeted at partner organizations; certificate of attendance provided.",
    howToApply: "Nominate two participants per organization via the application form.",
  },
  {
    id: "opp-7",
    title: "Community Outreach Volunteers — Ramadan Campaign",
    organizationId: "org-1",
    organizationName: "Türkiyeian Red Crescent Society",
    category: "Volunteer Roles",
    location: "Multiple governorates",
    deadline: "2026-05-20",
    type: "Volunteer",
    workArrangement: "On-site",
    compensation: "Unpaid",
    shortDescription:
      "Support distributions, registration, and awareness during the national solidarity campaign.",
    description:
      "Shifts available evenings and weekends; training and insurance provided for active volunteers.",
    requirements: "Minimum age 18; commitment to humanitarian principles; Turkish required.",
    howToApply: "Select your preferred location and available days in the volunteer form.",
  },
  {
    id: "opp-8",
    title: "Digital Skills Mentors (Online)",
    organizationId: "org-5",
    organizationName: "Plan International Türkiye",
    category: "Volunteer Roles",
    location: "Remote",
    deadline: "2026-06-30",
    type: "Volunteer",
    workArrangement: "Remote",
    compensation: "Unpaid",
    shortDescription:
      "Mentor young people on CV writing, interview skills, and basic digital literacy.",
    description:
      "Two hours per week for 8 weeks; curriculum and materials provided; safeguarding training mandatory.",
    requirements: "Professional experience in HR, IT, or communications; background check required.",
    howToApply: "Complete volunteer profile and short motivation statement.",
  },
  {
    id: "opp-9",
    title: "Supply of IT Equipment for Field Offices",
    organizationId: "org-3",
    organizationName: "Save the Children Türkiye",
    category: "Tenders",
    location: "Ankara (delivery nationwide)",
    deadline: "2026-06-05",
    type: "Tender",
    workArrangement: "On-site",
    compensation: "Paid",
    shortDescription:
      "International tender for laptops, routers, and peripherals for three field locations.",
    description:
      "Full RFP available upon registration. Bidders must demonstrate warranty and after-sales support in Türkiye.",
    requirements: "Registered company; tax clearance; previous NGO or public sector references.",
    howToApply: "Request RFP reference STC-IT-2026-04 via the contact form on this listing.",
  },
  {
    id: "opp-10",
    title: "Catering Services — Training Events (Framework)",
    organizationId: "org-6",
    organizationName: "World Food Programme — Türkiye",
    category: "Tenders",
    location: "Ankara & Upper Türkiye",
    deadline: "2026-07-01",
    type: "Tender",
    workArrangement: "Hybrid",
    compensation: "Paid",
    shortDescription:
      "Framework agreement for catering for workshops and meetings (2026–2027).",
    description:
      "Environmental and hygiene standards apply; menu options must include dietary accommodations.",
    requirements: "Food safety certification; HACCP; ability to invoice in USD/TRY per WFP rules.",
    howToApply: "Submit company profile and price list through the tender portal link (demo).",
  },
  {
    id: "opp-11",
    title: "Innovation Fund — Grassroots Climate Adaptation",
    organizationId: "org-4",
    organizationName: "UNDP Türkiye",
    category: "Grants",
    location: "Türkiye (nationwide)",
    deadline: "2026-06-20",
    type: "Grant",
    workArrangement: "Hybrid",
    compensation: "Paid",
    shortDescription:
      "Small grants for community-led adaptation projects in agriculture and water efficiency.",
    description:
      "Grants from $10k–$50k; CSOs and social enterprises eligible; co-financing encouraged.",
    requirements:
      "Registered NGO or SME; audited accounts; environmental safeguards checklist completed.",
    howToApply: "Concept note (max 4 pages) via TürkiyeJobs apply flow; full proposal if shortlisted.",
  },
  {
    id: "opp-12",
    title: "Women’s Economic Empowerment — Call for Proposals",
    organizationId: "org-2",
    organizationName: "Care Türkiye Foundation",
    category: "Grants",
    location: "Sohag & Qena",
    deadline: "2026-05-22",
    type: "Grant",
    workArrangement: "On-site",
    compensation: "Paid",
    shortDescription:
      "Funding for local partners implementing financial literacy and savings groups for women.",
    description:
      "Preference for organizations with existing women’s networks and measurable graduation pathways.",
    requirements: "Local NGO registration; gender policy; safeguarding focal point named.",
    howToApply: "Download ToR and submit full proposal by deadline through this portal.",
    featured: true,
  },
];

export function getOpportunityById(id: string): Opportunity | undefined {
  return SAMPLE_OPPORTUNITIES.find((o) => o.id === id);
}

export function getOrganizationById(id: string): Organization | undefined {
  return SAMPLE_ORGANIZATIONS.find((o) => o.id === id);
}

export function getOrganizationBySlug(slug: string): Organization | undefined {
  return SAMPLE_ORGANIZATIONS.find((o) => o.slug === slug);
}

/** Demo queue for admin — organizations awaiting approval */
export const SAMPLE_PENDING_ORGS: PendingOrgRecord[] = [
  {
    id: "porg-1",
    name: "Nile Community Development Association",
    email: "info@nilecda.example",
    submittedAt: "2026-05-10",
  },
  {
    id: "porg-2",
    name: "Green Delta Initiative",
    email: "apply@greendelta.example",
    submittedAt: "2026-05-11",
  },
];

/** Demo queue — opportunities submitted by orgs, awaiting admin publish */
export const SAMPLE_PENDING_OPPORTUNITIES: PendingOppApproval[] = [
  {
    id: "popp-1",
    title: "Field Monitor — Emergency Response (Upper Türkiye)",
    organizationName: "Türkiyeian Red Crescent Society",
    category: "Jobs",
    submittedAt: "2026-05-12",
  },
  {
    id: "popp-2",
    title: "Baseline Survey Firm — WASH Programme",
    organizationName: "Care Türkiye Foundation",
    category: "Consultancies",
    submittedAt: "2026-05-12",
  },
];
