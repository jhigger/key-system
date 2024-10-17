import { v4 as uuidv4 } from "uuid";
import { type OrderType } from "~/types/order";
import { type PricingType } from "~/types/pricing";
import { type ProductType } from "~/types/product";
import { type ProductKeyType } from "~/types/productKey";
import { type UserType } from "~/types/user";

export const fakeOwnerId = "7c1d59b1-0cc5-437d-a419-543a65cf16ab";

const fakeProductId1 = uuidv4();
const fakeProductId2 = uuidv4();
const fakeProductId3 = uuidv4();

const fakePricingId1 = uuidv4();
const fakePricingId2 = uuidv4();
const fakePricingId3 = uuidv4();
const fakePricingId4 = uuidv4();
const fakePricingId5 = uuidv4();

const fakeProductKeyId1 = uuidv4();
const fakeProductKeyId2 = uuidv4();
const fakeProductKeyId3 = uuidv4();
const fakeProductKeyId4 = uuidv4();
const fakeProductKeyId5 = uuidv4();
const fakeProductKeyId6 = uuidv4();
const fakeProductKeyId7 = uuidv4();

const fakeOrderId1 = uuidv4();
const fakeOrderId2 = uuidv4();
const fakeOrderId3 = uuidv4();
const fakeOrderId4 = uuidv4();
const fakeOrderId5 = uuidv4();

const fakeUserId1 = uuidv4();
const fakeUserId2 = uuidv4();
const fakeUserId3 = fakeOwnerId;
const fakeUserId4 = uuidv4();
const fakeUserId5 = uuidv4();
const fakeUserId6 = uuidv4();
const fakeUserId7 = uuidv4();

export const DEFAULT_PRICING: PricingType[] = [
  { uuid: fakePricingId1, duration: 1, value: 1.5, stock: 0 },
  { uuid: fakePricingId2, duration: 3, value: 3, stock: 0 },
  { uuid: fakePricingId3, duration: 7, value: 5, stock: 0 },
  { uuid: fakePricingId4, duration: 30, value: 13, stock: 0 },
  { uuid: fakePricingId5, duration: 0, value: 150, stock: 0 },
];

export const fakeProducts: ProductType[] = [
  {
    uuid: fakeProductId1,
    createdAt: new Date(2024, 10 - 1, 9).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 9).toISOString(),
    name: "Distortion",
    pricings: [
      { uuid: fakePricingId1, duration: 1, value: 1.5, stock: 1 },
      { uuid: fakePricingId2, duration: 3, value: 3, stock: 0 },
      { uuid: fakePricingId3, duration: 7, value: 5, stock: 0 },
      { uuid: fakePricingId4, duration: 30, value: 13, stock: 0 },
      { uuid: fakePricingId5, duration: 0, value: 150, stock: 1 },
    ],
  },
  {
    uuid: fakeProductId2,
    createdAt: new Date(2024, 10 - 1, 8).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 8).toISOString(),
    name: "Densho",
    pricings: DEFAULT_PRICING,
  },
  {
    uuid: fakeProductId3,
    createdAt: new Date(2024, 10 - 1, 4).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 4).toISOString(),
    name: "Unlock All",
    pricings: DEFAULT_PRICING,
  },
];

export const fakeProductKeys: ProductKeyType[] = [
  {
    uuid: fakeProductKeyId1,
    productId: fakeProductId1,
    key: uuidv4(),
    expiry: undefined,
    createdAt: new Date(2024, 10 - 1, 8).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 8).toISOString(),
    hardwareId: null,
    owner: null,
    pricingId: fakePricingId1,
  },
  {
    uuid: fakeProductKeyId2,
    productId: fakeProductId2,
    key: uuidv4(),
    expiry: new Date(2024, 10 - 1, 8 + 30).toISOString(),
    createdAt: new Date(2024, 10 - 1, 8).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 8).toISOString(),
    hardwareId: "b81826ac-6a44-4043-91e1-86573c24a9b5",
    owner: fakeOwnerId,
    pricingId: fakePricingId2,
  },
  {
    uuid: fakeProductKeyId3,
    productId: fakeProductId1,
    key: uuidv4(),
    expiry: new Date(2024, 10 - 1, 7 + 1).toISOString(),
    createdAt: new Date(2024, 10 - 1, 7).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 7).toISOString(),
    hardwareId: "c81826ac-6a44-4043-91e1-86573c24a9b5",
    owner: fakeOwnerId,
    pricingId: fakePricingId3,
  },
  {
    uuid: fakeProductKeyId4,
    productId: fakeProductId2,
    key: uuidv4(),
    expiry: null,
    createdAt: new Date(2024, 10 - 1, 6).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 6).toISOString(),
    hardwareId: "d81826ac-6a44-4043-91e1-86573c24a9b5",
    owner: fakeOwnerId,
    pricingId: fakePricingId4,
  },
  {
    uuid: fakeProductKeyId5,
    productId: fakeProductId1,
    key: uuidv4(),
    expiry: new Date(2024, 10 - 1, 5 + 7).toISOString(),
    createdAt: new Date(2024, 10 - 1, 5).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 5).toISOString(),
    hardwareId: "e81826ac-6a44-4043-91e1-86573c24a9b5",
    owner: fakeOwnerId,
    pricingId: fakePricingId5,
  },
  {
    uuid: fakeProductKeyId6,
    productId: fakeProductId2,
    key: uuidv4(),
    expiry: new Date(2024, 10 - 1, 4 + 3).toISOString(),
    createdAt: new Date(2024, 10 - 1, 4).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 4).toISOString(),
    hardwareId: "f81826ac-6a44-4043-91e1-86573c24a9b5",
    owner: fakeOwnerId,
    pricingId: fakePricingId1,
  },
  {
    uuid: fakeProductKeyId7,
    productId: fakeProductId1,
    key: uuidv4(),
    expiry: undefined,
    createdAt: new Date(2024, 10 - 1, 3).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 3).toISOString(),
    hardwareId: null,
    owner: null,
    pricingId: fakePricingId5,
  },
];

export const fakeOrders: OrderType[] = [
  {
    uuid: fakeOrderId1,
    purchasedBy: fakeOwnerId,
    productKeySnapshot: {
      uuid: fakeProductKeys[1]?.uuid ?? "",
      key: fakeProductKeys[1]?.key ?? "",
      expiry: fakeProductKeys[1]?.expiry ?? "",
      owner: fakeProductKeys[1]?.owner ?? "",
      createdAt: fakeProductKeys[1]?.createdAt ?? "",
      updatedAt: fakeProductKeys[1]?.updatedAt ?? "",
      pricing: DEFAULT_PRICING[1] ?? ({} as PricingType),
      productName: fakeProducts[1]?.name ?? "",
    },
    hardwareId: fakeProductKeys[1]?.hardwareId ?? "",
    invoiceLink: uuidv4(),
    createdAt: new Date(2024, 10 - 1, 8).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 8).toISOString(),
  },
  {
    uuid: fakeOrderId2,
    purchasedBy: fakeOwnerId,
    productKeySnapshot: {
      uuid: fakeProductKeys[2]?.uuid ?? "",
      key: fakeProductKeys[2]?.key ?? "",
      expiry: fakeProductKeys[2]?.expiry ?? "",
      owner: fakeProductKeys[2]?.owner ?? "",
      createdAt: fakeProductKeys[2]?.createdAt ?? "",
      updatedAt: fakeProductKeys[2]?.updatedAt ?? "",
      pricing: DEFAULT_PRICING[2] ?? ({} as PricingType),
      productName: fakeProducts[2]?.name ?? "",
    },
    hardwareId: fakeProductKeys[2]?.hardwareId ?? "",
    invoiceLink: uuidv4(),
    createdAt: new Date(2024, 10 - 1, 7).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 7).toISOString(),
  },
  {
    uuid: fakeOrderId3,
    purchasedBy: fakeOwnerId,
    productKeySnapshot: {
      uuid: fakeProductKeys[3]?.uuid ?? "",
      key: fakeProductKeys[3]?.key ?? "",
      expiry: fakeProductKeys[3]?.expiry ?? "",
      owner: fakeProductKeys[3]?.owner ?? "",
      createdAt: fakeProductKeys[3]?.createdAt ?? "",
      updatedAt: fakeProductKeys[3]?.updatedAt ?? "",
      pricing: DEFAULT_PRICING[3] ?? ({} as PricingType),
      productName: fakeProducts[3]?.name ?? "",
    },
    invoiceLink: uuidv4(),
    createdAt: new Date(2024, 10 - 1, 7).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 7).toISOString(),
    hardwareId: fakeProductKeys[3]?.hardwareId ?? "",
  },
  {
    uuid: fakeOrderId4,
    purchasedBy: fakeOwnerId,
    productKeySnapshot: {
      uuid: fakeProductKeys[4]?.uuid ?? "",
      key: fakeProductKeys[4]?.key ?? "",
      expiry: fakeProductKeys[4]?.expiry ?? "",
      owner: fakeProductKeys[4]?.owner ?? "",
      createdAt: fakeProductKeys[4]?.createdAt ?? "",
      updatedAt: fakeProductKeys[4]?.updatedAt ?? "",
      pricing: DEFAULT_PRICING[4] ?? ({} as PricingType),
      productName: fakeProducts[4]?.name ?? "",
    },
    invoiceLink: uuidv4(),
    createdAt: new Date(2024, 10 - 1, 7).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 7).toISOString(),
    hardwareId: fakeProductKeys[4]?.hardwareId ?? "",
  },
  {
    uuid: fakeOrderId5,
    purchasedBy: fakeOwnerId,
    productKeySnapshot: {
      uuid: fakeProductKeys[5]?.uuid ?? "",
      key: fakeProductKeys[5]?.key ?? "",
      expiry: fakeProductKeys[5]?.expiry ?? "",
      owner: fakeProductKeys[5]?.owner ?? "",
      createdAt: fakeProductKeys[5]?.createdAt ?? "",
      updatedAt: fakeProductKeys[5]?.updatedAt ?? "",
      pricing: DEFAULT_PRICING[5] ?? ({} as PricingType),
      productName: fakeProducts[5]?.name ?? "",
    },
    invoiceLink: uuidv4(),
    createdAt: new Date(2024, 10 - 1, 7).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 7).toISOString(),
    hardwareId: fakeProductKeys[5]?.hardwareId ?? "",
  },
];

export const fakeUsers: UserType[] = [
  {
    uuid: fakeUserId1,
    clerkId: "clerk_id_one",
    role: "admin",
    username: "admin",
    email: "email_one@example.com",
    orders: null,
    createdAt: new Date(2024, 10 - 1, 9).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 9).toISOString(),
  },
  {
    uuid: fakeUserId2,
    clerkId: "clerk_id_two",
    role: "reseller",
    username: "reseller1",
    email: "email_two@example.com",
    orders: null,
    createdAt: new Date(2024, 10 - 1, 8).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 8).toISOString(),
  },
  {
    uuid: fakeUserId3,
    clerkId: "clerk_id_three",
    role: "user",
    username: "dev",
    email: "email_three@example.com",
    orders: fakeOrders.map((order) => order.uuid),
    createdAt: new Date(2024, 10 - 1, 7).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 7).toISOString(),
  },
  {
    uuid: fakeUserId4,
    clerkId: "clerk_id_four",
    role: "user",
    username: "user2",
    email: "email_four@example.com",
    orders: [],
    createdAt: new Date(2024, 10 - 1, 6).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 6).toISOString(),
  },
  {
    uuid: fakeUserId5,
    clerkId: "clerk_id_five",
    role: "user",
    username: "user5",
    email: "email_five@example.com",
    orders: [],
    createdAt: new Date(2024, 10 - 1, 4).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 4).toISOString(),
  },
  {
    uuid: fakeUserId6,
    clerkId: "clerk_id_six",
    role: "user",
    username: "user6",
    email: "email_six@example.com",
    orders: [],
    createdAt: new Date(2024, 10 - 1, 4).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 4).toISOString(),
  },
  {
    uuid: fakeUserId7,
    clerkId: "clerk_id_seven",
    role: "user",
    username: "user7",
    email: "email_seven@example.com",
    orders: [],
    createdAt: new Date(2024, 10 - 1, 3).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 3).toISOString(),
  },
];
