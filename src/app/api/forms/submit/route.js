import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { rateLimit } from "@/lib/rate-limit";
import { sanitizeString, sanitizeEmail, sanitizeAnswers } from "@/lib/sanitize";

export async function POST(request) {
  // ── Rate limiting: 5 submissions per minute per IP ──
  const limiter = rateLimit(request, { maxRequests: 5, windowMs: 60_000 });
  if (!limiter.success) {
    return NextResponse.json(
      { error: "Too many submissions. Please wait a minute and try again." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((limiter.reset - Date.now()) / 1000)),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  try {
    const body = await request.json();
    const { form_slug, name, email, answers } = body;

    // ── Sanitize inputs ──
    const cleanSlug  = sanitizeString(form_slug, { maxLength: 100 });
    const cleanName  = sanitizeString(name, { maxLength: 200 });
    const cleanEmail = sanitizeEmail(email);
    const cleanAnswers = sanitizeAnswers(answers);

    // ── Validate required fields ──
    if (!cleanSlug) {
      return NextResponse.json(
        { error: "form_slug is required." },
        { status: 400 }
      );
    }
    if (!cleanEmail) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    // ── Reject suspiciously large payloads ──
    const payloadSize = JSON.stringify(cleanAnswers).length;
    if (payloadSize > 50_000) {
      return NextResponse.json(
        { error: "Submission too large." },
        { status: 413 }
      );
    }

    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (toSet) => {
            toSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    // Grab user if logged in (nullable — survey is public)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("form_responses").insert({
      form_slug: cleanSlug,
      name:      cleanName || null,
      email:     cleanEmail,
      answers:   cleanAnswers,
      completed: true,
      user_id:   user?.id || null,
      source:    sanitizeString(request.headers.get("referer") || "", { maxLength: 500 }) || null,
    });

    if (error) {
      console.error("[form_responses] insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { success: true },
      {
        headers: {
          "X-RateLimit-Remaining": String(limiter.remaining),
        },
      }
    );
  } catch (err) {
    console.error("[/api/forms/submit] unexpected error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
