"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AuthShell } from "@/components/AuthShell";
import { OAuthButtons, OrDivider } from "@/components/OAuthButtons";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({ email, password });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }

    if (data.session) {
      // Email confirmation is disabled — signUp already returned a live session.
      router.push("/projects");
      router.refresh();
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <AuthShell rail="confirm">
        <h1 className="mb-3 font-serif text-[28px] leading-[1.2] font-medium tracking-[-0.2px] text-foreground">
          Check your email
        </h1>
        <p className="text-[13.5px] leading-relaxed text-muted-foreground">
          We sent a confirmation link to <strong>{email}</strong>. Follow it to finish creating
          your account, then{" "}
          <Link href="/login" className="text-foreground hover:underline">
            sign in
          </Link>
          .
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell rail="sign up">
      <h1 className="mb-2 font-serif text-[28px] leading-[1.2] font-medium tracking-[-0.2px] text-foreground">
        Create your account
      </h1>
      <p className="mb-8 text-[13.5px] leading-relaxed text-muted-foreground">
        One account tracks every project you run{" "}
        <code className="rounded-[5px] bg-muted px-1.5 py-0.5 font-mono text-[12.5px]">
          smith init
        </code>{" "}
        in.
      </p>

      <OAuthButtons />
      <OrDivider />

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="flex h-[46px] items-center rounded-[12px] border border-border-strong bg-card px-4 focus-within:border-faint">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full border-none bg-transparent text-sm text-foreground placeholder:text-faint focus:outline-none"
          />
        </div>
        <div className="flex h-[46px] items-center rounded-[12px] border border-border-strong bg-card px-4 focus-within:border-faint">
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full border-none bg-transparent text-sm text-foreground placeholder:text-faint focus:outline-none"
          />
        </div>

        {error && <p className="text-[13px] text-destructive">{error}</p>}

        <Button
          type="submit"
          disabled={loading}
          className="h-auto w-full rounded-[10px] py-3 text-[13.5px]"
        >
          {loading ? "Creating account…" : "Sign up"}
        </Button>
      </form>

      <p className="mt-6 text-[13px] text-faint">
        Already have an account?{" "}
        <Link href="/login" className="text-muted-foreground hover:underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
