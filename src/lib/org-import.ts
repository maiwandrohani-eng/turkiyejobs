import { slugify } from "@/lib/slugify";
import type { PrismaClient } from "@/generated/prisma/client";
import * as XLSX from "xlsx";

type ExcelRow = Record<string, unknown>;

type ParsedOrg = {
  name: string;
  email: string | null;
  website: string | null;
  location: string | null;
  description: string | null;
  logoUrl: string | null;
  abbreviation: string | null;
  sector: string | null;
  organizationType: string | null;
  sourceUrl: string | null;
  profileCompleteness: number;
};

type ExistingOrg = {
  id: string;
  name: string;
  slug: string;
  email: string | null;
  phone: string | null;
  website: string | null;
  location: string | null;
  description: string | null;
  logoUrl: string | null;
  featuredBadge: boolean;
  profileCompleteness: number;
  verificationStatus: string;
  verifiedAt: Date | null;
  isActive: boolean;
  abbreviation: string | null;
  sector: string | null;
  organizationType: string | null;
  sourceType: string | null;
  sourceUrl: string | null;
  claimed: boolean | null;
  importedAt: Date | null;
  importedBy: string | null;
  country: string | null;
  platform: string | null;
};

export type OrganizationImportSummary = {
  rowsRead: number;
  created: number;
  updated: number;
  skipped: number;
};

function toText(value: unknown): string | null {
  if (value == null) return null;
  const str = String(value).trim();
  return str.length > 0 ? str : null;
}

function normalizeName(name: string): string {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractDomain(input: string | null): string | null {
  if (!input) return null;
  const raw = input.trim();
  if (!raw) return null;

  if (raw.includes("@")) {
    const part = raw.split("@")[1]?.trim().toLowerCase();
    return part || null;
  }

  const normalized = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const hostname = new URL(normalized).hostname.replace(/^www\./i, "").toLowerCase();
    return hostname || null;
  } catch {
    return null;
  }
}

function classifySector(description: string | null, organizationType: string | null): string | null {
  const text = `${description ?? ""} ${organizationType ?? ""}`.toLowerCase().trim();
  if (!text) return null;

  const sectorMatchers: Array<[string, RegExp]> = [
    ["Health", /health|public health|maternal health|reproductive health|disease/],
    ["WASH", /wash|water|sanitation|hygiene/],
    ["Education", /education|school|learning|literacy/],
    ["Food Security", /food security|food assistance|school feeding|agriculture|livelihood/],
    ["Protection", /protection|gbv|gender equality|child protection|refugee protection|safeguarding/],
    ["Migration", /migration|displacement|refugee|resettlement|return/],
    ["Humanitarian", /humanitarian|emergency response|relief/],
    ["Development", /development finance|development|economic policy|social protection|governance/],
  ];

  for (const [label, re] of sectorMatchers) {
    if (re.test(text)) return label;
  }

  return null;
}

function mapRow(row: ExcelRow): ParsedOrg | null {
  const cols = Object.entries(row).reduce<Record<string, unknown>>((acc, [key, value]) => {
    acc[key.trim().toLowerCase()] = value;
    return acc;
  }, {});

  const pick = (...names: string[]) => {
    for (const name of names) {
      const v = cols[name.trim().toLowerCase()];
      const t = toText(v);
      if (t) return t;
    }
    return null;
  };

  const name = pick("Organization", "Name", "Organization Name");
  if (!name) return null;

  const email = pick("Official Contact Email", "Email", "Official Email");
  const website = pick("Website", "Web", "URL");
  const location = pick("Primary Location(s) in Türkiye", "Location", "Primary Location");
  const description = pick("Notes / Focus Areas", "Notes", "Focus Areas", "Description");
  const logoUrl = pick("Logo URL", "Logo", "LogoUrl");
  const abbreviation = pick("Abbreviation", "Short Name", "Acronym");
  const organizationType = pick("Organization Type", "Type");
  const sourceUrl = pick("Source URL", "Reference URL", "Source");
  const sector = classifySector(description, organizationType);

  const profileBase = [email, website, location, description, logoUrl, abbreviation, organizationType]
    .filter(Boolean).length;
  const profileCompleteness = Math.min(100, Math.round((profileBase / 7) * 100));

  return {
    name,
    email,
    website,
    location,
    description,
    logoUrl,
    abbreviation,
    sector,
    organizationType,
    sourceUrl,
    profileCompleteness,
  };
}

function extractRowsFromSheet(sheet: XLSX.WorkSheet): ExcelRow[] {
  const matrix = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
    header: 1,
    defval: null,
    blankrows: false,
  });

  const headerRowIndex = matrix.findIndex((row) =>
    row.some((cell) => String(cell ?? "").trim().toLowerCase() === "organization"),
  );

  if (headerRowIndex < 0) {
    return XLSX.utils.sheet_to_json<ExcelRow>(sheet, { defval: null });
  }

  const headerCells = matrix[headerRowIndex] ?? [];
  const headers = headerCells.map((cell, i) => toText(cell) ?? `column_${i + 1}`);

  const out: ExcelRow[] = [];
  for (const row of matrix.slice(headerRowIndex + 1)) {
    const obj: ExcelRow = {};
    let hasData = false;
    headers.forEach((header, i) => {
      const value = row[i] ?? null;
      if (value != null && String(value).trim() !== "") hasData = true;
      obj[header] = value;
    });
    if (hasData) out.push(obj);
  }

  return out;
}

function isMissing(value: string | null | undefined): boolean {
  return value == null || value.trim().length === 0;
}

function initialsPlaceholder(name: string): string {
  const letters = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "ORG";

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256'><rect width='100%' height='100%' fill='#0f3f5f'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Arial,sans-serif' font-size='84' fill='#f6d365'>${letters}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function absolutizeAssetUrl(asset: string, base: URL): string | null {
  const trimmed = asset.trim();
  if (!trimmed) return null;
  try {
    return new URL(trimmed, base).toString();
  } catch {
    return null;
  }
}

function readSchemaLogo(value: unknown): string | null {
  if (!value) return null;
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = readSchemaLogo(item);
      if (found) return found;
    }
    return null;
  }
  if (typeof value !== "object") return null;

  const obj = value as Record<string, unknown>;
  const type = toText(obj["@type"]);
  const graph = obj["@graph"];
  if (graph) {
    const fromGraph = readSchemaLogo(graph);
    if (fromGraph) return fromGraph;
  }

  if (type?.toLowerCase().includes("organization")) {
    const logo = obj.logo;
    if (typeof logo === "string") return logo;
    if (logo && typeof logo === "object") {
      const nested = (logo as Record<string, unknown>).url;
      if (typeof nested === "string") return nested;
    }
  }

  return null;
}

function extractCandidateAssetUrls(html: string, baseUrl: URL): string[] {
  const out: string[] = [];

  const pushMatch = (re: RegExp) => {
    for (const match of html.matchAll(re)) {
      const next = absolutizeAssetUrl(match[1] ?? "", baseUrl);
      if (next) out.push(next);
    }
  };

  pushMatch(/<link[^>]+rel=["'][^"']*apple-touch-icon[^"']*["'][^>]+href=["']([^"']+)["']/gi);
  pushMatch(/<link[^>]+rel=["'][^"']*icon[^"']*["'][^>]+href=["']([^"']+)["']/gi);
  pushMatch(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/gi);
  pushMatch(/<meta[^>]+name=["']og:image["'][^>]+content=["']([^"']+)["']/gi);

  for (const script of html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    const payload = script[1];
    if (!payload) continue;
    try {
      const data = JSON.parse(payload) as unknown;
      const logo = readSchemaLogo(data);
      if (logo) out.push(logo);
    } catch {
      // Ignore malformed JSON-LD.
    }
  }

  return out;
}

async function canReach(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: { "user-agent": "TurkiyeJobs-OrgImporter/1.0" },
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function enrichLogoUrl(website: string | null, name: string, provided: string | null): Promise<string> {
  if (provided) return provided;
  if (!website) return initialsPlaceholder(name);

  const normalized = /^https?:\/\//i.test(website) ? website : `https://${website}`;
  let base: URL;
  try {
    base = new URL(normalized);
  } catch {
    return initialsPlaceholder(name);
  }

  const candidates: string[] = [];
  candidates.push(new URL("/favicon.ico", base).toString());

  try {
    const htmlResp = await fetch(base.toString(), {
      method: "GET",
      redirect: "follow",
      headers: { "user-agent": "TurkiyeJobs-OrgImporter/1.0" },
      signal: AbortSignal.timeout(7000),
    });

    if (htmlResp.ok) {
      const html = await htmlResp.text();
      candidates.push(...extractCandidateAssetUrls(html, base));
    }
  } catch {
    // Fall through.
  }

  const domain = extractDomain(base.toString());
  if (domain) candidates.push(`https://logo.clearbit.com/${domain}`);

  const uniqueCandidates = [...new Set(candidates)];
  for (const candidate of uniqueCandidates) {
    if (await canReach(candidate)) return candidate;
  }

  return initialsPlaceholder(name);
}

function pickDuplicateCandidate(candidates: ExistingOrg[]): ExistingOrg | null {
  if (candidates.length === 0) return null;
  const verified = candidates.find((c) => c.verificationStatus === "VERIFIED");
  if (verified) return verified;
  return candidates[0] ?? null;
}

function upsertIndex(map: Map<string, ExistingOrg[]>, key: string | null, row: ExistingOrg) {
  if (!key) return;
  const arr = map.get(key) ?? [];
  if (!arr.some((r) => r.id === row.id)) arr.push(row);
  map.set(key, arr);
}

async function allocateUniqueOrganizationSlug(prisma: PrismaClient, name: string): Promise<string> {
  const base = slugify(name) || "organization";
  let candidate = base;
  let n = 0;
  for (;;) {
    const existing = await prisma.organization.findFirst({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!existing) return candidate;
    n += 1;
    candidate = `${base}-${n}`;
  }
}

export async function importOrganizationsFromWorkbookBuffer(
  prisma: PrismaClient,
  workbookBuffer: Buffer,
): Promise<OrganizationImportSummary> {
  const workbook = XLSX.read(workbookBuffer, { type: "buffer" });
  const firstSheet = workbook.SheetNames[0];
  if (!firstSheet) throw new Error("Excel file has no sheets.");

  const sheet = workbook.Sheets[firstSheet];
  const rawRows = extractRowsFromSheet(sheet);
  const mappedRows = rawRows
    .map(mapRow)
    .filter((row): row is ParsedOrg => Boolean(row?.name));

  if (mappedRows.length === 0) {
    throw new Error("No importable organizations found in the first sheet.");
  }

  const existing = (await prisma.organization.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      email: true,
      phone: true,
      website: true,
      location: true,
      description: true,
      logoUrl: true,
      featuredBadge: true,
      profileCompleteness: true,
      verificationStatus: true,
      verifiedAt: true,
      isActive: true,
      abbreviation: true,
      sector: true,
      organizationType: true,
      sourceType: true,
      sourceUrl: true,
      claimed: true,
      importedAt: true,
      importedBy: true,
      country: true,
      platform: true,
    },
  })) as ExistingOrg[];

  const byName = new Map<string, ExistingOrg[]>();
  const byWebsiteDomain = new Map<string, ExistingOrg[]>();
  const byEmailDomain = new Map<string, ExistingOrg[]>();

  for (const row of existing) {
    upsertIndex(byName, normalizeName(row.name), row);
    upsertIndex(byWebsiteDomain, extractDomain(row.website), row);
    upsertIndex(byEmailDomain, extractDomain(row.email), row);
  }

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const row of mappedRows) {
    const normalizedName = normalizeName(row.name);
    const websiteDomain = extractDomain(row.website);
    const emailDomain = extractDomain(row.email);

    const duplicate =
      pickDuplicateCandidate(byName.get(normalizedName) ?? []) ??
      pickDuplicateCandidate(websiteDomain ? byWebsiteDomain.get(websiteDomain) ?? [] : []) ??
      pickDuplicateCandidate(emailDomain ? byEmailDomain.get(emailDomain) ?? [] : []);

    const logoUrl = await enrichLogoUrl(row.website, row.name, row.logoUrl);

    if (!duplicate) {
      const slug = await allocateUniqueOrganizationSlug(prisma, row.name);
      const createdOrg = (await prisma.organization.create({
        data: {
          name: row.name,
          slug,
          abbreviation: row.abbreviation,
          sector: row.sector,
          organizationType: row.organizationType,
          email: row.email,
          website: row.website,
          location: row.location,
          description: row.description,
          logoUrl,
          featuredBadge: false,
          profileCompleteness: row.profileCompleteness,
          verificationStatus: "CURATED_PUBLIC_PROFILE",
          verifiedAt: null,
          isActive: true,
          sourceType: "ADMIN_IMPORT",
          sourceUrl: row.sourceUrl,
          claimed: false,
          importedAt: new Date(),
          importedBy: "admin_import",
          country: "Türkiye",
          platform: "turkiyejobs",
        },
      })) as ExistingOrg;

      upsertIndex(byName, normalizeName(createdOrg.name), createdOrg);
      upsertIndex(byWebsiteDomain, extractDomain(createdOrg.website), createdOrg);
      upsertIndex(byEmailDomain, extractDomain(createdOrg.email), createdOrg);
      created += 1;
      continue;
    }

    const patch: Record<string, unknown> = {};
    if (isMissing(duplicate.abbreviation) && !isMissing(row.abbreviation)) patch.abbreviation = row.abbreviation;
    if (isMissing(duplicate.sector) && !isMissing(row.sector)) patch.sector = row.sector;
    if (isMissing(duplicate.organizationType) && !isMissing(row.organizationType)) patch.organizationType = row.organizationType;
    if (isMissing(duplicate.email) && !isMissing(row.email)) patch.email = row.email;
    if (isMissing(duplicate.website) && !isMissing(row.website)) patch.website = row.website;
    if (isMissing(duplicate.location) && !isMissing(row.location)) patch.location = row.location;
    if (isMissing(duplicate.description) && !isMissing(row.description)) patch.description = row.description;
    if (isMissing(duplicate.logoUrl) && !isMissing(logoUrl)) patch.logoUrl = logoUrl;
    if (isMissing(duplicate.sourceUrl) && !isMissing(row.sourceUrl)) patch.sourceUrl = row.sourceUrl;
    if (!duplicate.sourceType) patch.sourceType = "ADMIN_IMPORT";
    if (duplicate.claimed == null) patch.claimed = false;
    if (!duplicate.importedAt) patch.importedAt = new Date();
    if (isMissing(duplicate.importedBy)) patch.importedBy = "admin_import";
    if (isMissing(duplicate.country)) patch.country = "Türkiye";
    if (isMissing(duplicate.platform)) patch.platform = "turkiyejobs";
    if (duplicate.profileCompleteness === 0 && row.profileCompleteness > 0) {
      patch.profileCompleteness = row.profileCompleteness;
    }

    if (Object.keys(patch).length === 0) {
      skipped += 1;
      continue;
    }

    await prisma.organization.update({ where: { id: duplicate.id }, data: patch });
    updated += 1;
  }

  return {
    rowsRead: mappedRows.length,
    created,
    updated,
    skipped,
  };
}
