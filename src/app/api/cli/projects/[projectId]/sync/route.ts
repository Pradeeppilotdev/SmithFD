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

  // `message` (e.g. last commit message) is accepted for forward compatibility
  // with the CLI's heartbeat payload but has no column in the schema — it is
  // intentionally not persisted.
  const { goal } = (await request.json()) ?? {};

  const admin = createAdminClient();
  await admin
    .from("projects")
    .update({
      ...(goal !== undefined ? { goal, goal_updated_at: new Date().toISOString() } : {}),
      last_synced_at: new Date().toISOString(),
    })
    .eq("id", projectId);

  return NextResponse.json({ ok: true });
}
