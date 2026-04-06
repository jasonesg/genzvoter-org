import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl    = process.env.NEXT_PUBLIC_SUPABASE_URL    || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// createBrowserClient (from @supabase/ssr) stores the session in cookies
// instead of localStorage, so the server-side middleware can read it.
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createBrowserClient(supabaseUrl, supabaseAnonKey)
    : null;
