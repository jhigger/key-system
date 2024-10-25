import { createClient } from "@supabase/supabase-js";
import { type Database } from "database.types";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  metadata: {
    user_uuid: string;
    order_uuid: string;
    keys: string[];
  };
  type: string;
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

    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      return res
        .status(500)
        .json({ error: "Supabase configuration is missing" });
    }

    const { metadata, type } = req.body as Data;

    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
    );

    try {
      switch (type) {
        case "InvoiceExpired":
          const { data: expiredData, error: expiredError } = await supabase
            .from("orders")
            .update({
              status: "expired",
              updated_at: new Date().toISOString(),
            })
            .eq("uuid", metadata.order_uuid)
            .select();

          if (expiredError) {
            console.error("Supabase error:", expiredError);
            return res.status(400).json({
              error: expiredError.message,
              details: expiredError.details,
            });
          }

          const { error: updateProductKeysErrorExpired } = await supabase
            .from("product_keys")
            .update({
              reserved: false,
            })
            .in("key", metadata.keys);

          if (updateProductKeysErrorExpired) {
            console.error("Supabase error:", updateProductKeysErrorExpired);
            return res.status(400).json({
              error: updateProductKeysErrorExpired.message,
              details: updateProductKeysErrorExpired.details,
            });
          }

          // Increase the stock of the keys' pricing on the pricing table
          const { data: productKeysData, error: productKeysError } =
            await supabase
              .from("product_keys")
              .select("pricing_id")
              .in("key", metadata.keys);

          if (productKeysError) {
            console.error("Supabase error:", productKeysError);
            return res.status(400).json({
              error: productKeysError.message,
              details: productKeysError.details,
            });
          }

          const pricingIds = productKeysData
            .map((item) => item.pricing_id)
            .filter((id): id is string => id !== null && id !== undefined);

          for (const pricingId of pricingIds) {
            const { error: incrementStockError } = await supabase.rpc(
              "increment_stock",
              {
                pricing_uuid: pricingId,
                amount: 1,
              },
            );

            if (incrementStockError) {
              console.error("Error incrementing stock:", incrementStockError);
              return res.status(400).json({
                error: incrementStockError.message,
                details: incrementStockError.details,
              });
            }
          }

          console.log("expiredData: ", expiredData);

          return res
            .status(200)
            .json({ message: "Order updated successfully", expiredData });

        case "InvoiceSettled":
          const { data: settledData, error: settledError } = await supabase
            .from("orders")
            .update({
              status: "paid",
              updated_at: new Date().toISOString(),
            })
            .eq("uuid", metadata.order_uuid)
            .select();

          if (settledError) {
            console.error("Supabase error:", settledError);
            return res.status(400).json({
              error: settledError.message,
              details: settledError.details,
            });
          }

          const { error: updateProductKeysErrorSettled } = await supabase
            .from("product_keys")
            .update({
              owner: metadata.user_uuid,
            })
            .in("key", metadata.keys);

          if (updateProductKeysErrorSettled) {
            console.error("Supabase error:", updateProductKeysErrorSettled);
            return res.status(400).json({
              error: updateProductKeysErrorSettled.message,
              details: updateProductKeysErrorSettled.details,
            });
          }

          console.log("settledData: ", settledData);

          return res
            .status(200)
            .json({ message: "Order updated successfully", settledData });
      }

      console.log("received: ", type);

      return res.status(200).json({ received: true });
    } catch (error) {
      console.error("Webhook error:", error);
      return res.status(500).json({ error: "Webhook processing failed" });
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
}
