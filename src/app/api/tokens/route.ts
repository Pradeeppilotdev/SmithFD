import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { hashToken } from "@/lib/cli-auth";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const label: string | null = body?.label || null;

  const token = randomBytes(32).toString("hex");

  const { data, error } = await supabase
    .from("access_tokens")
    .insert({ user_id: user.id, token_hash: hashToken(token), label })
    .select("id, label, created_at")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "failed to create token" }, { status: 500 });
  }

  return NextResponse.json({ token, ...data });
}
