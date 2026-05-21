export type OpportunityCategory =
  | "Jobs"
  | "Consultancies"
  | "Trainings"
  | "Volunteer Roles"
  | "Tenders"
  | "Grants";

export type WorkArrangement = "Remote" | "Hybrid" | "On-site";
export type Compensation = "Paid" | "Unpaid";

export type ApplicationStatus =
  | "Submitted"
  | "Under review"
  | "Shortlisted"
  | "Rejected"
  | "Accepted";

export type ListingStatus =
  | "Draft"
  | "Pending approval"
  | "Published"
  | "Rejected"
  | "Closed";

/** Org-submitted rows only; sample listings omit this and are treated as published. */
export type OpportunityVisibility =
  | "pending_approval"
  | "published"
  | "rejected"
  | "closed";

/** How candidates submit for this listing (set by org/admin when posting). */
export type OpportunityApplicationMethod = "internal" | "email" | "external";

export interface Opportunity {
  id: string;
  /** Public URL segment when present (Neon); links use slug ?? id. */
  slug?: string;
  title: string;
  organizationId: string;
  organizationName: string;
  category: OpportunityCategory;
  location: string;
  deadline: string;
  type: string;
  workArrangement: WorkArrangement;
  compensation: Compensation;
  shortDescription: string;
  description: string;
  requirements: string;
  howToApply: string;
  /** @deprecated Prefer externalApplicationUrl + applicationMethod */
  externalApplyUrl?: string;
  /** When applicationMethod is "email", applications go to this address. */
  applicationEmail?: string;
  /** When applicationMethod is "external", candidates follow this URL. */
  externalApplicationUrl?: string;
  /** How to apply; omit on legacy data (see getOpportunityApplicationMethod). */
  applicationMethod?: OpportunityApplicationMethod;
  featured?: boolean;
  visibility?: OpportunityVisibility;

  /** Contract / engagement (e.g. fixed-term, open-ended, LOE days). */
  contractType?: string;
  startDate?: string;
  duration?: string;
  salaryOrCompensationDetail?: string;
  budgetOrContractValue?: string;
  experienceLevel?: string;
  educationRequirements?: string;
  languagesRequired?: string;
  positionsAvailable?: string;
  sectorThematicArea?: string;
  tenderOrGrantReference?: string;
  eligibilitySummary?: string;
  contactPersonName?: string;
  contactEmail?: string;
  contactPhone?: string;
  attachmentsUrl?: string;
  additionalInformation?: string;
}

/** Full payload when an organization posts any platform service type. */
export interface OrgOpportunitySubmissionInput {
  title: string;
  category: OpportunityCategory;
  type: string;
  location: string;
  deadline: string;
  workArrangement: WorkArrangement;
  compensation: Compensation;
  shortDescription: string;
  description: string;
  requirements: string;
  howToApply: string;
  applicationMethod: OpportunityApplicationMethod;
  applicationEmail: string;
  externalApplicationUrl: string;
  contractType: string;
  startDate: string;
  duration: string;
  salaryOrCompensationDetail: string;
  budgetOrContractValue: string;
  experienceLevel: string;
  educationRequirements: string;
  languagesRequired: string;
  positionsAvailable: string;
  sectorThematicArea: string;
  tenderOrGrantReference: string;
  eligibilitySummary: string;
  contactPersonName: string;
  contactEmail: string;
  contactPhone: string;
  attachmentsUrl: string;
  additionalInformation: string;
}

export type InternalApplyPayload = {
  coverLetter?: string;
  fullName: string;
  phone?: string;
  portfolioUrl?: string;
};

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description: string;
  location: string;
  /** Shown in directory card/list (e.g. humanitarian, development). */
  sector?: string;
  organizationType?: string;
  website?: string;
  verificationStatus: "VERIFIED" | "PENDING" | "REJECTED" | "CURATED_PUBLIC_PROFILE" | "UNCLAIMED_PROFILE";
  claimed?: boolean | null;
  verified: boolean;
  featured: boolean;
}

export type UserRole = "individual" | "organization" | "admin";

export interface SessionUser {
  role: UserRole;
  email: string;
  displayName: string;
  /** Neon-backed account id (NextAuth). Omitted in local demo preview sessions. */
  userId?: string;
  organizationName?: string;
  /** Links applicant submissions to this employer (sample / preview data). */
  organizationId?: string;
}

export interface ApplicationRecord {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  organizationName: string;
  organizationId: string;
  status: ApplicationStatus;
  submittedAt: string;
  coverLetter?: string;
  /** When set, scopes the individual dashboard; older records may omit this. */
  applicantEmail?: string;
  applicantDisplayName?: string;
  applicantFullName?: string;
  applicantPhone?: string;
  cvUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  /** Set when persisted via API (Neon). */
  serverId?: string;
  channel?: "internal";
}

/** User marked that they applied off-platform (email or external link). */
export interface ExternalApplyIntentRecord {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  organizationName: string;
  applicantEmail: string;
  channel: "email" | "external_link";
  recordedAt: string;
}

export interface OrgListingRecord {
  id: string;
  opportunityId: string;
  title: string;
  category: OpportunityCategory;
  status: ListingStatus;
  submittedAt: string;
  applicantCount: number;
  /** When set, this row appears only on that organization’s dashboard. */
  submittedByOrgId?: string;
}

export interface PendingOrgRecord {
  id: string;
  name: string;
  email: string;
  submittedAt: string;
}

export interface PendingOppApproval {
  id: string;
  /** Links to `Opportunity.id` in `extraOpportunities` for org submissions. */
  opportunityId?: string;
  title: string;
  organizationName: string;
  category: OpportunityCategory;
  submittedAt: string;
}

export type TürkiyeJobsNotificationAudience =
  | { kind: "admin" }
  | { kind: "org"; email: string }
  | { kind: "user"; email: string };

export interface TürkiyeJobsNotification {
  id: string;
  createdAt: string;
  read: boolean;
  audience: TürkiyeJobsNotificationAudience;
  title: string;
  message: string;
}

export interface RegisteredUserSnapshot {
  email: string;
  displayName: string;
  role: UserRole;
  registeredAt: string;
}

export interface ApplicantProfile {
  fullName: string;
  email: string;
  phone: string;
  cvUrl: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
}
