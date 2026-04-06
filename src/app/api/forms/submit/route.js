import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    const body = await request.json();
    const { form_slug, name, email, answers } = body;

    // Basic validation
    if (!form_slug || !email?.trim()) {
      return NextResponse.json(
        { error: "form_slug and email are required." },
        { status: 400 }
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
      form_slug,
      name:      name?.trim()  || null,
      email:     email.trim(),
      answers:   answers       || {},
      completed: true,
      user_id:   user?.id      || null,
      source:    request.headers.get("referer") || null,
    });

    if (error) {
      console.error("[form_responses] insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[/api/forms/submit] unexpected error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
