import { clerkClient, getAuth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import axios, { AxiosError } from "axios";
import { type Database } from "database.types";
import type { NextApiRequest, NextApiResponse } from "next";

export type CreateInvoiceData = {
  amount: string;
  order_uuid: string;
  productKeySnapshots: Database["public"]["Tables"]["product_keys_snapshots"]["Insert"][];
  user_uuid: string;
};

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

    const user = await clerkClient().users.getUser(userId);
    const role = user.publicMetadata.role;

    if (role !== "user") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const btcpayServerUrl = process.env.BTCPAY_SERVER_URL;
    const storeId = process.env.BTCPAY_STORE_ID;
    const apiKey = process.env.BTCPAY_API_KEY;

    if (!btcpayServerUrl || !storeId || !apiKey) {
      return res
        .status(500)
        .json({ error: "BTCPay Server configuration is missing" });
    }

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

    const { amount, order_uuid, productKeySnapshots, user_uuid } =
      req.body as CreateInvoiceData;

    const apiEndpoint = `${btcpayServerUrl}/api/v1/stores/${storeId}/invoices`;

    const headers = {
      "Content-Type": "application/json",
      Authorization: "token " + apiKey,
    };

    const payload = {
      amount: amount,
      currency: "USD",
      metadata: {
        user_uuid: user_uuid,
        order_uuid: order_uuid,
        keys: productKeySnapshots.map((snapshot) => snapshot.key),
      },
      checkout: {
        speedPolicy: "HighSpeed",
        paymentMethods: ["BTC", "LTC"],
        redirectURL: new URL(
          process.env.NEXT_PUBLIC_FRONT_END_URL + "/account#order-history",
        ),
      },
    };

    const response = await axios.post(apiEndpoint, payload, { headers });
    console.log("Invoice created:", response.data);
    const data = response.data as { checkoutLink: string };

    const { error: newOrderError } = await supabase.from("orders").insert({
      uuid: order_uuid,
      purchased_by: user_uuid,
      invoice_link: data.checkoutLink,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: "unpaid",
    });

    if (newOrderError) {
      console.error("Supabase error:", newOrderError);
      return res
        .status(400)
        .json({ error: newOrderError.message, details: newOrderError.details });
    }

    const { error: newProductKeySnapshotsError } = await supabase
      .from("product_keys_snapshots")
      .insert(productKeySnapshots);

    if (newProductKeySnapshotsError) {
      console.error("Supabase error:", newProductKeySnapshotsError);
      return res
        .status(400)
        .json({ error: newProductKeySnapshotsError.message });
    }

    return res.status(200).json({ checkoutLink: data.checkoutLink });
  } catch (error) {
    console.error("Error creating invoice:", error);
    if (error instanceof AxiosError) {
      const axiosError = error as AxiosError;
      return res
        .status(axiosError.response?.status ?? 500)
        .json({ error: axiosError.response?.data ?? axiosError.message });
    }
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
}
