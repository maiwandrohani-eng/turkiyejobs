import type { Session } from "next-auth";
import type { UserRole as PrismaUserRole } from "@/generated/prisma/enums";
import type { SessionUser, UserRole } from "@/lib/types";

function prismaRoleToUi(role: PrismaUserRole): UserRole {
  switch (role) {
    case "ADMIN":
      return "admin";
    case "ORG_USER":
      return "organization";
    case "INDIVIDUAL":
      return "individual";
  }
}

/** Maps NextAuth session (Prisma roles) into the UI `SessionUser` shape used by TurkiyeJobsProvider. */
export function sessionUserFromNextAuth(session: Session | null): SessionUser | null {
  const u = session?.user;
  if (!u?.email) return null;
  const role = u.role ? prismaRoleToUi(u.role) : "individual";
  const displayName =
    (u.name && u.name.trim()) ||
    u.email.split("@")[0]?.replace(/[._-]/g, " ") ||
    "User";
  const organizationName =
    typeof u.organizationName === "string" && u.organizationName.trim()
      ? u.organizationName.trim()
      : undefined;

  return {
    role,
    email: u.email.trim().toLowerCase(),
    displayName,
    userId: u.id,
    organizationId: u.organizationId ?? undefined,
    organizationName,
  };
}
