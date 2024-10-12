import { type OrderType } from "./order";

export const roles = ["admin", "user", "reseller"] as const;

export type RoleType = (typeof roles)[number];

export type UserType = {
  uuid: string;
  role: RoleType;
  email: string;
  orders: OrderType[] | null;
  createdAt: string;
  updatedAt: string;
};
