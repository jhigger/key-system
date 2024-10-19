import { createClient } from "@supabase/supabase-js";
import { type Database } from "database.types";

let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null;

export const supabase = (token?: string) => {
  if (!supabaseInstance) {
    supabaseInstance = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        },
      },
    );
  }

  return supabaseInstance;
};
