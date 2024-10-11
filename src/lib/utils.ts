import { type Row } from "@tanstack/react-table";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

export const formatISOStringToDate = (date: string) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
};

export const filterFn = <T extends Record<string, unknown>>(
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
