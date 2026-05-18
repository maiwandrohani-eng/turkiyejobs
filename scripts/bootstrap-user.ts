/**
 * Create or update a user in the database (Neon).
 *
 * Usage (from repo root, DATABASE_URL in .env or exported):
 *   BOOTSTRAP_EMAIL=you@example.com BOOTSTRAP_PASSWORD='your-secure-password' npx tsx scripts/bootstrap-user.ts
 *
 * Admin panel access:
 *   BOOTSTRAP_ROLE=ADMIN BOOTSTRAP_EMAIL=... BOOTSTRAP_PASSWORD='...' npx tsx scripts/bootstrap-user.ts
 *
 * Do not commit real passwords; prefer env vars over shell history where possible.
 */
import "dotenv/config";
import { hash } from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "../src/generated/prisma/client";
import type { UserRole } from "../src/generated/prisma/enums";

const email = process.env.BOOTSTRAP_EMAIL?.trim().toLowerCase();
const password = process.env.BOOTSTRAP_PASSWORD;
const roleRaw = (process.env.BOOTSTRAP_ROLE ?? "INDIVIDUAL").toUpperCase();

function validRole(r: string): r is UserRole {
  return r === "INDIVIDUAL" || r === "ORG_USER" || r === "ADMIN";
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is required (e.g. in .env).");
    process.exit(1);
  }
  if (!email?.includes("@")) {
    console.error("Set BOOTSTRAP_EMAIL to a valid email.");
    process.exit(1);
  }
  if (!password || password.length < 10) {
    console.error("Set BOOTSTRAP_PASSWORD (min 10 characters, same rule as /register).");
    process.exit(1);
  }
  if (!validRole(roleRaw)) {
    console.error("BOOTSTRAP_ROLE must be INDIVIDUAL, ORG_USER, or ADMIN.");
    process.exit(1);
  }

  let dbHost = "(unknown)";
  try {
    dbHost = new URL(url.replace(/^postgres:/, "postgresql:")).hostname;
  } catch {
    /* ignore */
  }

  const pool = new Pool({ connectionString: url });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });
  const passwordHash = await hash(password, 12);
  const local = email.split("@")[0] ?? "User";
  const firstName = local.replace(/[._-]/g, " ").slice(0, 60) || "User";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    await prisma.user.update({
      where: { email },
      data: {
        passwordHash,
        role: roleRaw,
        isActive: true,
      },
    });
    console.log(`Updated user ${email} (role ${roleRaw}) on ${dbHost}.`);
  } else {
    await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: roleRaw,
        firstName,
        lastName: null,
        organizationId: null,
      },
    });
    console.log(`Created user ${email} (role ${roleRaw}) on ${dbHost}.`);
  }

  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
