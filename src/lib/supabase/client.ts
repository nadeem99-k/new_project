import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

// Singleton instance — prevents multiple clients fighting over the same
// Web Locks Manager lock and causing "timed out waiting 10000ms" errors.
let client: SupabaseClient | null = null;

export function createClient() {
    if (client) return client;
    client = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    return client;
}
