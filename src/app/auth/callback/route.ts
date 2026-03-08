import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/portal";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const user = data.user ?? data.session?.user;
      if (user) {
        await supabase.from("profiles").upsert(
          {
            id: user.id,
            email: user.email ?? "",
            display_name:
              (user.user_metadata?.display_name as string | undefined) ??
              (user.user_metadata?.full_name as string | undefined) ??
              user.email?.split("@")[0] ??
              "Teacher",
            pseudonym:
              (user.user_metadata?.pseudonym as string | undefined) ??
              null,
            role:
              (user.user_metadata?.role as string | undefined) ?? "teacher",
          },
          { onConflict: "id" }
        );
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If code exchange failed, redirect to login with error
  return NextResponse.redirect(
    `${origin}/login?error=Could+not+verify+email.+Please+try+again.`
  );
}
