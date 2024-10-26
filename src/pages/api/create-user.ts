import { clerkClient, getAuth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { type Database } from "database.types";
import { type NextApiRequest, type NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    // Check if the request method is POST
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // Authenticate the request
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { clerkUserId, email, username } = req.body as {
      clerkUserId: string;
      email: string;
      username: string;
    };

    // Verify that the authenticated user is creating their own account
    if (userId !== clerkUserId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await clerkClient.users.updateUserMetadata(clerkUserId, {
      publicMetadata: {
        role: "user",
      },
    });

    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      return res
        .status(500)
        .json({ error: "Supabase configuration is missing" });
    }

    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
    );

    const { data, error } = await supabase
      .from("users")
      .insert({
        uuid: uuidv4(),
        clerk_id: clerkUserId,
        email: email,
        username: username,
        role: "user",
      })
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return res
        .status(400)
        .json({ error: error.message, details: error.details });
    }

    return res.status(200).json({ message: "User created successfully", data });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
}
