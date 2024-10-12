import { v4 as uuidv4 } from "uuid";
import { type OrderType } from "~/types/order";
import { variants, type PricingType } from "~/types/pricing";
import { type ProductType } from "~/types/product";
import { type ProductKeyType } from "~/types/productKey";
import { type UserType } from "~/types/user";

const fakeOwnerId = uuidv4();

export const DEFAULT_PRICING: PricingType[] = [
  { name: "1 Day", value: "1.5" },
  { name: "3 Days", value: "3" },
  { name: "7 Days", value: "5" },
  { name: "30 Days", value: "13" },
  { name: "Lifetime", value: "150" },
];

export const fakeProducts: ProductType[] = [
  {
    uuid: uuidv4(),
    createdAt: new Date(2024, 10 - 1, 9).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 9).toISOString(),
    product: "Distortion",
    value: "distortion",
    pricing: DEFAULT_PRICING,
    stock: 999,
  },
  {
    uuid: uuidv4(),
    createdAt: new Date(2024, 10 - 1, 8).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 8).toISOString(),
    product: "Densho",
    value: "densho",
    pricing: DEFAULT_PRICING,
    stock: 99,
  },
  {
    uuid: uuidv4(),
    createdAt: new Date(2024, 10 - 1, 4).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 4).toISOString(),
    product: "Unlock All",
    value: "unlock-all",
    pricing: DEFAULT_PRICING,
    stock: 0,
  },
];

export const fakeProductKeys: ProductKeyType[] = [
  {
    uuid: uuidv4(),
    product: fakeProducts[0]!.product,
    key: uuidv4(),
    variant: variants[1],
    expiry: undefined,
    createdAt: new Date(2024, 10 - 1, 8).toISOString(),
    hardwareId: uuidv4(),
    owner: null,
  },
  {
    uuid: uuidv4(),
    product: fakeProducts[1]!.product,
    key: uuidv4(),
    variant: variants[3],
    expiry: new Date(2024, 10 - 1, 8 + 30).toISOString(),
    createdAt: new Date(2024, 10 - 1, 8).toISOString(),
    hardwareId: uuidv4(),
    owner: fakeOwnerId,
  },
  {
    uuid: uuidv4(),
    product: fakeProducts[0]!.product,
    key: uuidv4(),
    variant: variants[0],
    expiry: new Date(2024, 10 - 1, 7 + 1).toISOString(),
    createdAt: new Date(2024, 10 - 1, 7).toISOString(),
    hardwareId: uuidv4(),
    owner: fakeOwnerId,
  },
  {
    uuid: uuidv4(),
    product: fakeProducts[1]!.product,
    key: uuidv4(),
    variant: variants[4],
    expiry: null,
    createdAt: new Date(2024, 10 - 1, 6).toISOString(),
    hardwareId: uuidv4(),
    owner: fakeOwnerId,
  },
  {
    uuid: uuidv4(),
    product: fakeProducts[0]!.product,
    key: uuidv4(),
    variant: variants[2],
    expiry: new Date(2024, 10 - 1, 5 + 7).toISOString(),
    createdAt: new Date(2024, 10 - 1, 5).toISOString(),
    hardwareId: uuidv4(),
    owner: fakeOwnerId,
  },
  {
    uuid: uuidv4(),
    product: fakeProducts[1]!.product,
    key: uuidv4(),
    variant: variants[1],
    expiry: new Date(2024, 10 - 1, 4 + 3).toISOString(),
    createdAt: new Date(2024, 10 - 1, 4).toISOString(),
    hardwareId: uuidv4(),
    owner: fakeOwnerId,
  },
  {
    uuid: uuidv4(),
    product: fakeProducts[0]!.product,
    key: uuidv4(),
    variant: variants[3],
    expiry: undefined,
    createdAt: new Date(2024, 10 - 1, 3).toISOString(),
    hardwareId: uuidv4(),
    owner: null,
  },
];

export const fakeOrders: OrderType[] = [
  {
    uuid: uuidv4(),
    purchasedBy: fakeOwnerId,
    productKey: fakeProductKeys[1]!,
    invoiceLink: uuidv4(),
    createdAt: new Date(2024, 10 - 1, 8).toISOString(),
  },
  {
    uuid: uuidv4(),
    purchasedBy: fakeOwnerId,
    productKey: fakeProductKeys[2]!,
    invoiceLink: uuidv4(),
    createdAt: new Date(2024, 10 - 1, 7).toISOString(),
  },
  {
    uuid: uuidv4(),
    purchasedBy: fakeOwnerId,
    productKey: fakeProductKeys[3]!,
    invoiceLink: uuidv4(),
    createdAt: new Date(2024, 10 - 1, 7).toISOString(),
  },
  {
    uuid: uuidv4(),
    purchasedBy: fakeOwnerId,
    productKey: fakeProductKeys[4]!,
    invoiceLink: uuidv4(),
    createdAt: new Date(2024, 10 - 1, 7).toISOString(),
  },
  {
    uuid: uuidv4(),
    purchasedBy: fakeOwnerId,
    productKey: fakeProductKeys[5]!,
    invoiceLink: uuidv4(),
    createdAt: new Date(2024, 10 - 1, 7).toISOString(),
  },
];

export const fakeUsers: UserType[] = [
  {
    uuid: uuidv4(),
    role: "admin",
    email: "email_one@example.com",
    orders: null,
    createdAt: new Date(2024, 10 - 1, 9).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 9).toISOString(),
  },
  {
    uuid: uuidv4(),
    role: "reseller",
    email: "email_two@example.com",
    orders: null,
    createdAt: new Date(2024, 10 - 1, 8).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 8).toISOString(),
  },
  {
    uuid: fakeOwnerId,
    role: "user",
    email: "email_three@example.com",
    orders: fakeOrders,
    createdAt: new Date(2024, 10 - 1, 7).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 7).toISOString(),
  },
  {
    uuid: uuidv4(),
    role: "user",
    email: "email_four@example.com",
    orders: [],
    createdAt: new Date(2024, 10 - 1, 6).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 6).toISOString(),
  },
  {
    uuid: uuidv4(),
    role: "user",
    email: "email_five@example.com",
    orders: [],
    createdAt: new Date(2024, 10 - 1, 4).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 4).toISOString(),
  },
  {
    uuid: uuidv4(),
    role: "user",
    email: "email_six@example.com",
    orders: [],
    createdAt: new Date(2024, 10 - 1, 4).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 4).toISOString(),
  },
  {
    uuid: uuidv4(),
    role: "user",
    email: "email_seven@example.com",
    orders: [],
    createdAt: new Date(2024, 10 - 1, 3).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 3).toISOString(),
  },
];
