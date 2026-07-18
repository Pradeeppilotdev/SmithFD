import { NextResponse } from "next/server";
import { resolveUserFromToken, verifyProjectOwnership } from "@/lib/cli-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const resolved = await resolveUserFromToken(request);
  if (!resolved) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;
  const owns = await verifyProjectOwnership(projectId, resolved.userId);
  if (!owns) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const body = await request.json();
  const { action, contradicts, reasoning } = body ?? {};

  if (typeof action !== "string" || typeof contradicts !== "boolean") {
    return NextResponse.json(
      { error: "action and contradicts are required" },
      { status: 400 },
    );
  }

  const admin = createAdminClient();
  await admin.from("decisions").insert({
    project_id: projectId,
    action,
    contradicts,
    reasoning: reasoning ?? null,
  });

  return NextResponse.json({ ok: true });
}
