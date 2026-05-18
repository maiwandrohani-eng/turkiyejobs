import "dotenv/config";
import { compare } from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "../src/generated/prisma/client";

const email = (process.argv[2] ?? "maiwandr@gmail.com").trim().toLowerCase();
const password = process.argv[3];

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL required");
  const host = new URL(url.replace(/^postgres:/, "postgresql:")).hostname;
  console.log(`DB host: ${host}`);

  const pool = new Pool({ connectionString: url });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.log(`No user: ${email}`);
    process.exit(1);
  }
  const tries = password
    ? [password]
    : ["TurkiyeAdmin2026!", "Come*1234!", "TurkiyeJobsSeedPass123"];
  for (const pw of tries) {
    console.log(`${pw} => ${await compare(pw, user.passwordHash)}`);
  }
  console.log(`role=${user.role} active=${user.isActive}`);
  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
