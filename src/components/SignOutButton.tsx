"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={signOut}
      aria-label="Sign out"
      className="flex items-center gap-1.5 text-[13px] text-faint hover:text-muted-foreground"
    >
      <LogOut className="size-3.5 shrink-0" />
      <span className="hidden sm:inline">Sign out</span>
    </button>
  );
}
