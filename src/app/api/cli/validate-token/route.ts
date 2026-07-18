import { NextResponse } from "next/server";
import { resolveUserFromToken } from "@/lib/cli-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const resolved = await resolveUserFromToken(request);
  if (!resolved) {
    return NextResponse.json({ valid: false }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data } = await admin.auth.admin.getUserById(resolved.userId);

  return NextResponse.json({ valid: true, userLabel: data.user?.email ?? null });
}
