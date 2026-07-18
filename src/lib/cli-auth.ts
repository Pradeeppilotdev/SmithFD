import "server-only";
import { createHash } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function resolveUserFromToken(
  request: Request,
): Promise<{ userId: string } | null> {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.match(/^Bearer (.+)$/)?.[1];
  if (!token) return null;

  const admin = createAdminClient();
  const { data } = await admin
    .from("access_tokens")
    .select("user_id")
    .eq("token_hash", hashToken(token))
    .is("revoked_at", null)
    .maybeSingle();

  if (!data) return null;
  return { userId: data.user_id };
}

export async function verifyProjectOwnership(projectId: string, userId: string) {
  const admin = createAdminClient();
  const { data } = await admin
    .from("projects")
    .select("id")
    .eq("id", projectId)
    .eq("user_id", userId)
    .maybeSingle();

  return Boolean(data);
}
