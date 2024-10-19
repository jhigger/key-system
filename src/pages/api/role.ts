import { clerkClient } from "@clerk/nextjs/server";
import { type NextApiRequest, type NextApiResponse } from "next";
import { type RoleType } from "~/types/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { clerkId, role } = req.body as { clerkId: string; role: RoleType };

    const { publicMetadata } = await clerkClient().users.updateUserMetadata(
      clerkId,
      {
        publicMetadata: { role },
      },
    );

    if (!publicMetadata.role) {
      res.status(500).json({ message: "Failed to change role" });
    }

    res.status(200).json({ message: "Changed role successfully" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
