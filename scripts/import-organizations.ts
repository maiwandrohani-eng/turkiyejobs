import "dotenv/config";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { importOrganizationsFromWorkbookBuffer } from "../src/lib/org-import";

const DEFAULT_IMPORT_PATH = "/Users/maiwand/Desktop/directories/Turkey Organizations list.xlsx";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is required.");
    process.exit(1);
  }

  const inputPath = resolve(process.argv[2] ?? process.env.ORG_IMPORT_FILE ?? DEFAULT_IMPORT_PATH);
  let buffer: Buffer;
  try {
    buffer = readFileSync(inputPath);
  } catch (error) {
    console.error(`Failed to read Excel file at ${inputPath}.`, error);
    process.exit(1);
  }

  const pool = new Pool({ connectionString: url });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  const summary = await importOrganizationsFromWorkbookBuffer(prisma, buffer);

  console.log(`Import completed from ${inputPath}`);
  console.log(`Rows read: ${summary.rowsRead}`);
  console.log(`Created: ${summary.created}`);
  console.log(`Updated (missing fields only): ${summary.updated}`);
  console.log(`Skipped (no changes): ${summary.skipped}`);

  await prisma.$disconnect();
  await pool.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
