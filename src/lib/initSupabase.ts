import { createClient } from "@supabase/supabase-js";
import { type Database } from "database.types";

export const supabase = (token: string) =>
  createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    },
  );
