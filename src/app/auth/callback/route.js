import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/signup?error=auth`);
  }

  // Capture cookies written by exchangeCodeForSession so we can apply
  // them to whichever redirect response we end up creating.
  let cookiesToApply = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToApply = cookiesToSet;
        },
      },
    }
  );

  const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !sessionData?.user) {
    return NextResponse.redirect(`${origin}/signup?error=auth`);
  }

  // Returning user with a completed profile → dashboard, otherwise onboarding
  // Wrapped in try/catch so a missing profiles table never crashes the callback
  let destination = "/onboarding";
  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", sessionData.user.id)
      .single();
    if (profile?.full_name) destination = "/dashboard";
  } catch (_) {
    // profiles table missing or query failed — safe fallback to onboarding
  }

  // Build the final redirect and attach the session cookies to it
  const response = NextResponse.redirect(`${origin}${destination}`);
  cookiesToApply.forEach(({ name, value, options }) =>
    response.cookies.set(name, value, options)
  );

  return response;
}
