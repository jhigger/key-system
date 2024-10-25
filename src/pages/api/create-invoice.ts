import { clerkClient, getAuth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import axios, { AxiosError } from "axios";
import { type Database } from "database.types";
import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";

type Data = {
  amount: string;
  cart: {
    productName: string;
    keys: { quantity: number; pricingUuid: string }[];
    totalPrice: number;
  }[];
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

    const { amount, cart, user_uuid } = req.body as Data;
    const orderUUID = uuidv4();

    const { data: pricingData } = await supabase.from("pricings").select("*");
    const { data: productKeys } = await supabase
      .from("product_keys")
      .select("*")
      .is("owner", null);

    const usedKeys = new Set<string>();

    const productKeySnapshots: Database["public"]["Tables"]["product_keys_snapshots"]["Insert"][] =
      cart.flatMap(
        (
          product,
        ): Database["public"]["Tables"]["product_keys_snapshots"]["Insert"][] => {
          return product.keys.flatMap(
            (
              keyRequest,
            ): Database["public"]["Tables"]["product_keys_snapshots"]["Insert"][] => {
              const pricing = pricingData?.find(
                (p) => p.uuid === keyRequest.pricingUuid,
              );
              const availableKeys =
                productKeys?.filter(
                  (p) =>
                    p.pricing_id === keyRequest.pricingUuid &&
                    !usedKeys.has(p.key),
                ) ?? [];

              if (!pricing || availableKeys.length < keyRequest.quantity) {
                console.error(
                  `Not enough keys available for ${product.productName}`,
                );
                return [];
              }

              return Array.from({ length: keyRequest.quantity }, () => {
                const productKey = availableKeys.pop();
                if (!productKey) {
                  console.error(
                    `Unexpected: No key available for ${product.productName}`,
                  );
                  return null;
                }
                usedKeys.add(productKey.key);

                return {
                  uuid: uuidv4(),
                  product_name: product.productName,
                  key: productKey.key,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                  owner: user_uuid,
                  pricing: pricing,
                  hardware_id: null,
                  expiry: pricing.duration
                    ? new Date(
                        new Date().getTime() +
                          pricing.duration * 24 * 60 * 60 * 1000,
                      ).toISOString()
                    : null,
                  order_id: orderUUID,
                };
              }).filter(
                (item): item is NonNullable<typeof item> => item !== null,
              );
            },
          );
        },
      );

    // Update stock for each pricing
    for (const product of cart) {
      for (const keyRequest of product.keys) {
        const { error: updateStockError } = await supabase
          .from("pricings")
          .update({
            stock:
              (
                await supabase.rpc("decrement_stock", {
                  pricing_uuid: keyRequest.pricingUuid,
                  amount: keyRequest.quantity,
                })
              ).data ?? 0,
          })
          .eq("uuid", keyRequest.pricingUuid);

        if (updateStockError) {
          console.error("Error updating stock:", updateStockError);
          // Handle the error appropriately
        }
      }
    }

    for (const productKey of productKeySnapshots) {
      const { error: updateReservedError } = await supabase
        .from("product_keys")
        .update({ reserved: true })
        .eq("key", productKey.key);

      if (updateReservedError) {
        console.error("Error updating reserved:", updateReservedError);
      }
    }

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
        order_uuid: orderUUID,
        keys: productKeySnapshots.map((snapshot) => snapshot.key),
      },
      checkout: {
        speedPolicy: "HighSpeed",
        paymentMethods: ["BTC", "LTC"],
      },
    };

    const response = await axios.post(apiEndpoint, payload, { headers });
    console.log("Invoice created:", response.data);
    const data = response.data as { checkoutLink: string };

    const { error: newOrderError } = await supabase.from("orders").insert({
      uuid: orderUUID,
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
