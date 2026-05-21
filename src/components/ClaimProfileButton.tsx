"use client";

import Link from "next/link";

type Props = {
  organizationId?: string;
  organizationName?: string;
  returnPath: string;
};

export function ClaimProfileButton({ organizationName, returnPath }: Props) {
  const params = new URLSearchParams({
    subject: `Claim profile: ${organizationName ?? "Organization"}`,
    message: `Hello, I would like to claim the organization profile for ${organizationName ?? "this organization"}.\n\nOrganization profile: ${returnPath}`,
  });

  return (
    <Link
      href={`/contact?${params.toString()}`}
      className="inline-flex min-h-[2.75rem] items-center justify-center rounded-lg border border-brand-border px-4 py-2 text-sm font-semibold text-brand-navy hover:bg-brand-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50"
    >
      Claim this profile
    </Link>
  );
}
