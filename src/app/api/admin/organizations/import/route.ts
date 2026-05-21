import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { getPrisma } from "@/lib/prisma";
import { importOrganizationsFromWorkbookBuffer } from "@/lib/org-import";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 403 });
  }

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ ok: false, error: "Database not configured." }, { status: 503 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid form data." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "Excel file is required." }, { status: 400 });
  }

  if (file.size === 0) {
    return NextResponse.json({ ok: false, error: "Excel file is empty." }, { status: 400 });
  }

  if (file.size > 12 * 1024 * 1024) {
    return NextResponse.json({ ok: false, error: "Excel file is too large (max 12 MB)." }, { status: 400 });
  }

  try {
    const bytes = await file.arrayBuffer();
    const summary = await importOrganizationsFromWorkbookBuffer(prisma, Buffer.from(bytes));

    return NextResponse.json({
      ok: true,
      summary,
    });
  } catch (error) {
    console.error("POST /api/admin/organizations/import", error);
    const msg = error instanceof Error ? error.message : "Import failed.";
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }
}
