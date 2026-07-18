import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // Behind a reverse proxy (Render, etc.) the request's own origin can reflect
  // the proxy's internal host:port rather than the public URL — trust an
  // explicit site URL when one is configured instead.
  const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL || origin;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${siteOrigin}/projects`);
    }
  }

  return NextResponse.redirect(`${siteOrigin}/login?error=oauth_failed`);
}
