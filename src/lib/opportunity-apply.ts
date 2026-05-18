import type { Opportunity, OpportunityApplicationMethod } from "@/lib/types";

/** Effective method; supports legacy listings before `applicationMethod` existed. */
export function getOpportunityApplicationMethod(
  o: Opportunity,
): OpportunityApplicationMethod {
  if (o.applicationMethod) return o.applicationMethod;
  if (o.applicationEmail?.trim()) return "email";
  const ext = (o.externalApplicationUrl ?? o.externalApplyUrl)?.trim();
  if (ext) return "external";
  return "internal";
}

export function getExternalApplicationHref(o: Opportunity): string | undefined {
  const u = (o.externalApplicationUrl ?? o.externalApplyUrl)?.trim();
  return u || undefined;
}

export function applicationMethodLabel(m: OpportunityApplicationMethod): string {
  switch (m) {
    case "internal":
      return "Internal (TürkiyeJobs.org)";
    case "email":
      return "Apply by email";
    case "external":
      return "External apply link";
    default:
      return m;
  }
}
