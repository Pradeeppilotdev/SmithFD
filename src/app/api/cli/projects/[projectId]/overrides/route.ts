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
  const { action, actionHash } = body ?? {};

  if (typeof action !== "string") {
    return NextResponse.json({ error: "action is required" }, { status: 400 });
  }

  const admin = createAdminClient();
  await admin.from("overrides").insert({
    project_id: projectId,
    action,
    action_hash: actionHash ?? null,
  });

  return NextResponse.json({ ok: true });
}
