import { v4 as uuidv4 } from "uuid";
import { type PricingType } from "~/types/pricing";
import { type ProductType } from "~/types/product";
import { type PurchasedKeyType } from "~/types/purchasedKey";
import { type UserType } from "~/types/user";
import { variants } from "~/types/variant";
import { formatPrice } from "./utils";

export const DEFAULT_PRICING: [PricingType, ...PricingType[]] = variants.map(
  ({ name, value }) => {
    return { name: `${name} - ${formatPrice(Number(value))}`, value };
  },
) as [PricingType, ...PricingType[]];

export const fakeProducts: [ProductType, ...ProductType[]] = [
  {
    name: "Distortion",
    value: "distortion",
    pricing: DEFAULT_PRICING,
    stock: 999,
  },
  {
    name: "Densho",
    value: "densho",
    pricing: DEFAULT_PRICING,
    stock: 99,
  },
  {
    name: "Unlock All",
    value: "unlock-all",
    pricing: DEFAULT_PRICING,
    stock: 0,
  },
];

export const fakeOrders: PurchasedKeyType[] = [
  {
    uuid: uuidv4(),
    product: fakeProducts[0].name,
    key: uuidv4(),
    invoiceLink: uuidv4(),
    variant: variants[2]!.name,
    expiry: new Date(2024, 10 - 1, 9 + 7).toISOString(),
    purchasedAt: new Date(2024, 10 - 1, 9).toISOString(),
  },
  {
    uuid: uuidv4(),
    product: fakeProducts[0].name,
    key: uuidv4(),
    invoiceLink: uuidv4(),
    variant: variants[1]!.name,
    expiry: new Date(2024, 10 - 1, 8 + 3).toISOString(),
    purchasedAt: new Date(2024, 10 - 1, 8).toISOString(),
  },
  {
    uuid: uuidv4(),
    product: fakeProducts[1]!.name,
    key: uuidv4(),
    invoiceLink: uuidv4(),
    variant: variants[0].name,
    expiry: new Date(2024, 10 - 1, 7 + 1).toISOString(),
    purchasedAt: new Date(2024, 10 - 1, 7).toISOString(),
  },
  {
    uuid: uuidv4(),
    product: fakeProducts[1]!.name,
    key: uuidv4(),
    invoiceLink: uuidv4(),
    variant: variants[0].name,
    expiry: new Date(2024, 10 - 1, 6 + 1).toISOString(),
    purchasedAt: new Date(2024, 10 - 1, 6).toISOString(),
  },
  {
    uuid: uuidv4(),
    product: fakeProducts[0]?.name,
    key: uuidv4(),
    invoiceLink: uuidv4(),
    variant: variants[4]!.name,
    expiry: null,
    purchasedAt: new Date(2024, 10 - 1, 5).toISOString(),
  },
  {
    uuid: uuidv4(),
    product: fakeProducts[1]!.name,
    key: uuidv4(),
    invoiceLink: uuidv4(),
    variant: variants[3]!.name,
    expiry: new Date(2024, 10 - 1, 4 + 30).toISOString(),
    purchasedAt: new Date(2024, 10 - 1, 4).toISOString(),
  },
  {
    uuid: uuidv4(),
    product: fakeProducts[0].name,
    key: uuidv4(),
    invoiceLink: uuidv4(),
    variant: variants[3]!.name,
    expiry: new Date(2024, 10 - 1, 3 + 30).toISOString(),
    purchasedAt: new Date(2024, 10 - 1, 3).toISOString(),
  },
];

export const fakeUsers: UserType[] = [
  {
    uuid: uuidv4(),
    role: "admin",
    email: "email_one@example.com",
    keys: null,
    createdAt: new Date(2024, 10 - 1, 9 + 30).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 9 + 30).toISOString(),
  },
  {
    uuid: uuidv4(),
    role: "reseller",
    email: "email_two@example.com",
    keys: null,
    createdAt: new Date(2024, 10 - 1, 8 + 3).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 8 + 3).toISOString(),
  },
  {
    uuid: uuidv4(),
    role: "user",
    email: "email_three@example.com",
    keys: [
      {
        uuid: uuidv4(),
        product: fakeProducts[0]?.name,
        key: uuidv4(),
        invoiceLink: uuidv4(),
        variant: variants[1]!.name,
        expiry: new Date(
          new Date().setDate(new Date().getDate() + 30),
        ).toISOString(),
        purchasedAt: new Date(2024, 10 - 1, 7 + 1).toISOString(),
      },
    ],
    createdAt: new Date(2024, 10 - 1, 7 + 1).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 7 + 1).toISOString(),
  },
  {
    uuid: uuidv4(),
    role: "user",
    email: "email_four@example.com",
    keys: [],
    createdAt: new Date(2024, 10 - 1, 6 + 1).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 6 + 1).toISOString(),
  },
  {
    uuid: uuidv4(),
    role: "user",
    email: "email_five@example.com",
    keys: [],
    createdAt: new Date(2024, 10 - 1, 4 + 30).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 4 + 30).toISOString(),
  },
  {
    uuid: uuidv4(),
    role: "user",
    email: "email_six@example.com",
    keys: [],
    createdAt: new Date(2024, 10 - 1, 4 + 30).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 4 + 30).toISOString(),
  },
  {
    uuid: uuidv4(),
    role: "user",
    email: "email_seven@example.com",
    keys: [],
    createdAt: new Date(2024, 10 - 1, 3 + 7).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 3 + 7).toISOString(),
  },
];
