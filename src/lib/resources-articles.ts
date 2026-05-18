export type ResourceArticleSummary = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author?: string;
};

export type ResourceArticleBody = ResourceArticleSummary & {
  /** ISO date for display */
  publishedAt: string;
  sections: { heading?: string; paragraphs: string[] }[];
};

export const RESOURCE_ARTICLES: ResourceArticleBody[] = [
  {
    slug: "how-to-read-a-tor-like-a-hiring-manager",
    title: "How to read a TOR like a hiring manager",
    excerpt:
      "Terms of reference hide clues about evaluation criteria, reporting lines, and what “success” really means.",
    category: "Hiring",
    publishedAt: "2026-04-18",
    sections: [
      {
        heading: "Start with the evaluation matrix",
        paragraphs: [
          "Most TORs attach a scoring grid or evaluation criteria, even if it is buried in an annex. Read those criteria before you skim the narrative: they tell you what the client will actually defend in debriefs and shortlisting.",
          "Highlight mandatory requirements (years of experience, language level, registration, geography) in one colour and desirable criteria in another. If you cannot evidence a mandatory criterion, do not burn time on a generic proposal.",
        ],
      },
      {
        heading: "Decode reporting lines and decision rights",
        paragraphs: [
          "Look for who signs off on deliverables, who chairs the steering group, and who owns budget revisions. Misaligned expectations between programme, finance, and MEAL teams are a common source of scope creep.",
          "If the TOR references a host government partner or cluster coordination, note how often formal approvals are required. That rhythm affects staffing intensity and travel.",
        ],
      },
      {
        heading: "Translate “success” into observable outcomes",
        paragraphs: [
          'Strong TORs still use vague phrases like “strengthen capacity” or “improve resilience.” Rewrite those into measurable indicators you can track in your workplan: numbers of staff trained, tools adopted, or response times improved.',
          "When you respond, mirror the TOR’s language in headings but tighten definitions in your methodology so evaluators see alignment without ambiguity.",
        ],
      },
    ],
  },
  {
    slug: "cvs-for-ngos-vs-private-sector",
    title: "CVs for NGOs vs. private sector",
    excerpt:
      "Lead with mission alignment, programme scale, and measurable impact — then layer technical skills.",
    category: "Careers",
    publishedAt: "2026-04-22",
    sections: [
      {
        heading: "Front-load context and scale",
        paragraphs: [
          "Private-sector CVs often lead with employer brand. In the NGO and development world, lead with the population reached, geography, donor instrument, and your role in delivery.",
          "Use one line per assignment: programme name, funding source, your title, and a quantified outcome (e.g., beneficiaries, grant volume managed, audit rating).",
        ],
      },
      {
        heading: "Competencies that transfer across sectors",
        paragraphs: [
          "Risk management, stakeholder engagement, and data literacy read well everywhere — but frame them through safeguarding, inclusion, and ethical data use when applying to mission-driven employers.",
          "If you are pivoting from corporate roles, add a short profile paragraph that names the social impact issues you care about and any volunteering, pro bono, or board experience.",
        ],
      },
      {
        heading: "Formatting and length",
        paragraphs: [
          "Two pages is still the norm for mid-senior roles in Türkiye’s INGO market unless the TOR specifies otherwise. Use clean section headings (Experience, Education, Languages, Technical skills) and avoid dense blocks of text.",
          "Save the narrative for the cover letter or technical proposal; the CV should scan in under two minutes.",
        ],
      },
    ],
  },
  {
    slug: "safeguarding-basics-every-applicant-should-know",
    title: "Safeguarding basics every applicant should know",
    excerpt:
      "Understand PSEA, referral pathways, and why recruiters ask behavioural questions in screenings.",
    category: "Safeguarding",
    publishedAt: "2026-05-01",
    sections: [
      {
        heading: "PSEA in plain language",
        paragraphs: [
          "Prevention of sexual exploitation, abuse, and harassment (PSEA) is a non-negotiable expectation for anyone working with vulnerable populations. Employers look for awareness of power dynamics, boundaries, and reporting duties.",
          "You do not need to memorise every policy name, but you should be able to describe what you would do if you witnessed misconduct and how you would support a survivor-centred response.",
        ],
      },
      {
        heading: "Why behavioural interview questions show up",
        paragraphs: [
          "Questions about conflict, safeguarding near-misses, or ethical dilemmas are designed to test judgement, not to trip you up. Use the STAR format (Situation, Task, Action, Result) with anonymised examples.",
          "If you have never worked in a humanitarian programme, be honest — and connect transferable experience such as child protection in education, GBV referral training, or whistleblowing processes in prior roles.",
        ],
      },
      {
        heading: "Before day one",
        paragraphs: [
          "Complete any mandatory e-learning promptly, read the organisation’s code of conduct, and clarify who your safeguarding focal point is. Treat safeguarding as a line responsibility, not only a compliance checkbox.",
        ],
      },
    ],
  },
  {
    slug: "remote-and-hybrid-roles-in-turkiyes-development-space",
    title: "Remote and hybrid roles in Türkiye’s development space",
    excerpt:
      "How to demonstrate async collaboration, data security, and field connectivity when working hybrid.",
    category: "Work formats",
    publishedAt: "2026-05-08",
    sections: [
      {
        heading: "Show how you work across locations",
        paragraphs: [
          "Hybrid roles often combine Ankara-based coordination with field visits in southeastern Türkiye or coastal provinces. Spell out how you plan travel, manage security protocols, and keep documentation current while mobile.",
          "Name the tools you use for async work (shared drives, task boards, version control for MEAL data) and how you run inclusive meetings across time zones when partners sit abroad.",
        ],
      },
      {
        heading: "Data handling and confidentiality",
        paragraphs: [
          "Donor and government data may be sensitive. Mention experience with access tiers, password hygiene, and secure file transfer. If you have handled personal data under GDPR-style or national data rules, say so briefly.",
        ],
      },
      {
        heading: "Connectivity and backup plans",
        paragraphs: [
          "Electricity and connectivity vary. Hiring managers appreciate candidates who describe contingency planning: offline packs, local partners for last-mile delivery, and how you validate data when sync is delayed.",
          "If you have run trainings or community consultations in low-connectivity settings, that is a strong signal you can operate in Türkiye’s mixed urban–rural programme reality.",
        ],
      },
    ],
  },
  {
    slug: "internal-application-checklist-turkiyejobs",
    title: "Internal application checklist for TürkiyeJobs.org",
    excerpt:
      "Before you submit through the platform: documents, tone, and double-checks that save time for you and recruiters.",
    category: "Careers",
    publishedAt: "2026-05-12",
    sections: [
      {
        heading: "Profile and attachments",
        paragraphs: [
          "Complete your applicant profile with accurate contact details, CV or resume link, and any links the listing requests (e.g. LinkedIn, portfolio). Use working URLs and files employers can open without special permissions.",
          "Match your profile name to the name you use on your CV so reviewers can reconcile documents quickly.",
        ],
      },
      {
        heading: "Tailor to the listing",
        paragraphs: [
          "Mirror key language from the opportunity title and requirements in your cover letter or motivation text, but avoid copying large blocks verbatim. Show you read the TOR or job description.",
          "If the role mentions languages, locations, or security clearances, state your situation plainly — partial eligibility is better than silent gaps.",
        ],
      },
      {
        heading: "Before you click submit",
        paragraphs: [
          "Re-read for typos, broken links, and the correct opportunity title in your letter. Confirm you chose the right application channel (internal vs email vs external) if the listing offers more than one path.",
          "Keep a copy of what you submitted and the deadline. Follow up only through channels the employer invites — unsolicited bulk messages rarely help.",
        ],
      },
    ],
  },
];

export function getResourceArticle(slug: string): ResourceArticleBody | undefined {
  return RESOURCE_ARTICLES.find((a) => a.slug === slug);
}

export function resourceArticleSummaries(): ResourceArticleSummary[] {
  return RESOURCE_ARTICLES.map(({ slug, title, excerpt, category, author }) => ({
    slug,
    title,
    excerpt,
    category,
    author,
  }));
}
