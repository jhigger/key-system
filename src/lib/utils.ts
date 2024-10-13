import { type Row } from "@tanstack/react-table";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { validate as uuidValidate, version as uuidVersion } from "uuid";
import { type OrderTypeWithVariant } from "~/types/order";
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
  date: string,
): { formattedDate: string; formattedTime: string } => {
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

type ItemWithVariant = OrderTypeWithVariant | ProductKeyType;

export const sortByVariant = <T extends ItemWithVariant>(
  rowA: Row<T>,
  rowB: Row<T>
): number => {
  const getVariantValue = (row: Row<T>): number => {
    if ('variant' in row.original) {
      return row.original.variant;
    } else if ('duration' in row.original) {
      return row.original.duration;
    }
    return 0; // Default value if neither property exists
  };

  const variantA = getVariantValue(rowA);
  const variantB = getVariantValue(rowB);

  // Special cases
  if (variantA === 0) return 1; // 0 (Lifetime) is always first
  if (variantB === 0) return -1;
  if (variantA === 30 && variantB !== 0) return 1; // 30 is second, unless compared to 0
  if (variantB === 30 && variantA !== 0) return -1;

  // For all other cases, sort in descending order
  return variantA - variantB;
};
