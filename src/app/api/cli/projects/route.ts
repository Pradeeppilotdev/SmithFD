import { NextResponse } from "next/server";
import { resolveUserFromToken } from "@/lib/cli-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const resolved = await resolveUserFromToken(request);
  if (!resolved) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const name: string | undefined = body?.name;
  const goal: string | undefined = body?.goal;

  if (!name) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: existing } = await admin
    .from("projects")
    .select("id")
    .eq("user_id", resolved.userId)
    .eq("name", name)
    .maybeSingle();

  if (existing) {
    if (goal !== undefined) {
      await admin
        .from("projects")
        .update({ goal, goal_updated_at: new Date().toISOString() })
        .eq("id", existing.id);
    }
    return NextResponse.json({ projectId: existing.id });
  }

  const { data: created, error } = await admin
    .from("projects")
    .insert({
      user_id: resolved.userId,
      name,
      goal: goal ?? null,
      goal_updated_at: goal !== undefined ? new Date().toISOString() : null,
    })
    .select("id")
    .single();

  if (error || !created) {
    return NextResponse.json({ error: "failed to create project" }, { status: 500 });
  }

  return NextResponse.json({ projectId: created.id });
}
