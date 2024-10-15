import { clerkClient } from "@clerk/nextjs/server";
import { type NextApiRequest, type NextApiResponse } from "next";
import { type RoleType } from "~/types/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { userId, role } = req.body as { userId: string; role: RoleType };

    await clerkClient().users.updateUserMetadata(userId, {
      publicMetadata: { role },
    });
    res.status(200).json({ name: "John Doe" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
