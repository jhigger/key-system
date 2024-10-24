import { type Row } from "@tanstack/react-table";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { validate as uuidValidate, version as uuidVersion } from "uuid";
import { type ProductType } from "~/types/product";
import { type ProductKeyType } from "~/types/productKey";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

export const formatISOStringToDate = (
  date?: string | null,
): { formattedDate: string; formattedTime: string } => {
  if (!date) return { formattedDate: "", formattedTime: "" };

  const dateObj = new Date(date);

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(dateObj);

  const formattedTime = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  }).format(dateObj);

  return { formattedDate, formattedTime };
};

export const dateFilterFn = <T extends Record<string, unknown>>(
  row: Row<T>,
  columnId: string,
  filterValue: [Date, Date],
) => {
  const dateValue: string = row.getValue(columnId);

  if (!dateValue) return false;

  const date = new Date(dateValue);
  const [startDate, endDate] = filterValue;

  // Check if the date falls within the specified range
  return date >= startDate && date <= endDate;
};

export const censorUUID = (uuid: string) => {
  if (!uuidValidate(uuid) || uuidVersion(uuid) !== 4) {
    return uuid;
  }
  return uuid.slice(0, -12) + "*".repeat(12);
};

export const copyToClipboard = (key: string) => {
  return navigator.clipboard.writeText(key);
};

export const formatDuration = (duration: number) => {
  return duration === 0 || !duration
    ? "Lifetime"
    : `${duration} Day${duration > 1 ? "s" : ""}`;
};

export const getProductPricingDuration = (
  pricingId: string,
  products: ProductType[],
): number => {
  for (const product of products) {
    const pricing = product.pricings.find((p) => p.uuid === pricingId);
    if (pricing) {
      return pricing.duration ?? 0;
    }
  }
  return 0;
};

export const sortByVariant = <T extends ProductKeyType>(
  rowA: Row<T>,
  rowB: Row<T>,
  products: ProductType[],
): number => {
  const getVariantValue = (row: Row<T>): number => {
    const pricingId = row.original.pricingId;
    return pricingId ? getProductPricingDuration(pricingId, products) : 0;
  };

  const variantA = getVariantValue(rowA);
  const variantB = getVariantValue(rowB);

  // Special cases
  if (variantA === 0 && variantB === 0) return 0; // Both are Lifetime, so they're equal
  if (variantA === 0) return -1; // 0 (Lifetime) is the highest
  if (variantB === 0) return 1;

  // For all other cases, sort in descending order
  return variantB - variantA;
};

export const getStatus = (expiry?: string | null) => {
  return expiry
    ? new Date(expiry) < new Date()
      ? "expired"
      : "active"
    : "active";
};

export const sortByProduct = <T extends ProductKeyType>(
  rowA: Row<T>,
  rowB: Row<T>,
  products: ProductType[],
): number => {
  const productA = products.find(
    (product) => product.uuid === rowA.original.productId,
  );
  const productB = products.find(
    (product) => product.uuid === rowB.original.productId,
  );

  return (productA?.name ?? "").localeCompare(productB?.name ?? "");
};
