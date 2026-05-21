-- Organization curated profile statuses + admin import metadata

DO $$
BEGIN
  ALTER TYPE "OrgVerificationStatus" ADD VALUE IF NOT EXISTS 'CURATED_PUBLIC_PROFILE';
  ALTER TYPE "OrgVerificationStatus" ADD VALUE IF NOT EXISTS 'UNCLAIMED_PROFILE';
END $$;

ALTER TABLE "Organization"
  ADD COLUMN IF NOT EXISTS "abbreviation" TEXT,
  ADD COLUMN IF NOT EXISTS "organizationType" TEXT,
  ADD COLUMN IF NOT EXISTS "sourceType" TEXT,
  ADD COLUMN IF NOT EXISTS "sourceUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "claimed" BOOLEAN,
  ADD COLUMN IF NOT EXISTS "importedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "importedBy" TEXT,
  ADD COLUMN IF NOT EXISTS "country" TEXT,
  ADD COLUMN IF NOT EXISTS "platform" TEXT;
