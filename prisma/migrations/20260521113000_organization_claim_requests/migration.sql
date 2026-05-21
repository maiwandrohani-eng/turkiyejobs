-- Organization claim request workflow

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'OrgClaimRequestStatus') THEN
    CREATE TYPE "OrgClaimRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "OrganizationClaimRequest" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "requesterUserId" TEXT NOT NULL,
  "requesterEmail" TEXT NOT NULL,
  "requesterName" TEXT,
  "message" TEXT,
  "status" "OrgClaimRequestStatus" NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "OrganizationClaimRequest_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "OrganizationClaimRequest_organizationId_fkey"
    FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "OrganizationClaimRequest_requesterUserId_fkey"
    FOREIGN KEY ("requesterUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "OrganizationClaimRequest_organizationId_status_createdAt_idx"
  ON "OrganizationClaimRequest"("organizationId", "status", "createdAt");

CREATE INDEX IF NOT EXISTS "OrganizationClaimRequest_requesterUserId_status_createdAt_idx"
  ON "OrganizationClaimRequest"("requesterUserId", "status", "createdAt");
