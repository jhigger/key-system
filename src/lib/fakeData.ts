import { v4 as uuidv4 } from "uuid";
import { type OrderType } from "~/types/order";
import { type PricingType } from "~/types/pricing";
import { type ProductType } from "~/types/product";
import { type ProductKeyType } from "~/types/productKey";
import { type UserType } from "~/types/user";

export const fakeOwnerId = "67dd6c56-29a6-46c7-a038-33f7e37fc72a";

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
    pricing: [
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
    pricing: DEFAULT_PRICING,
  },
  {
    uuid: fakeProductId3,
    createdAt: new Date(2024, 10 - 1, 4).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 4).toISOString(),
    name: "Unlock All",
    pricing: DEFAULT_PRICING,
  },
];

export const fakeProductKeys: ProductKeyType[] = [
  {
    uuid: fakeProductKeyId1,
    productId: fakeProductId1,
    key: fakePricingId1,
    expiry: undefined,
    createdAt: new Date(2024, 10 - 1, 8).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 8).toISOString(),
    hardwareId: null,
    owner: null,
    pricingId: fakeProducts[0]?.pricing[0]?.uuid ?? "",
  },
  {
    uuid: fakeProductKeyId2,
    productId: fakeProductId2,
    key: fakePricingId2,
    expiry: new Date(2024, 10 - 1, 8 + 30).toISOString(),
    createdAt: new Date(2024, 10 - 1, 8).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 8).toISOString(),
    hardwareId: "b81826ac-6a44-4043-91e1-86573c24a9b5",
    owner: fakeOwnerId,
    pricingId: fakeProducts[1]?.pricing[0]?.uuid ?? "",
  },
  {
    uuid: fakeProductKeyId3,
    productId: fakeProductId1,
    key: fakePricingId3,
    expiry: new Date(2024, 10 - 1, 7 + 1).toISOString(),
    createdAt: new Date(2024, 10 - 1, 7).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 7).toISOString(),
    hardwareId: "c81826ac-6a44-4043-91e1-86573c24a9b5",
    owner: fakeOwnerId,
    pricingId: fakeProducts[0]?.pricing[0]?.uuid ?? "",
  },
  {
    uuid: fakeProductKeyId4,
    productId: fakeProductId2,
    key: fakePricingId4,
    expiry: null,
    createdAt: new Date(2024, 10 - 1, 6).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 6).toISOString(),
    hardwareId: "d81826ac-6a44-4043-91e1-86573c24a9b5",
    owner: fakeOwnerId,
    pricingId: fakeProducts[1]?.pricing[0]?.uuid ?? "",
  },
  {
    uuid: fakeProductKeyId5,
    productId: fakeProductId1,
    key: fakePricingId5,
    expiry: new Date(2024, 10 - 1, 5 + 7).toISOString(),
    createdAt: new Date(2024, 10 - 1, 5).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 5).toISOString(),
    hardwareId: "e81826ac-6a44-4043-91e1-86573c24a9b5",
    owner: fakeOwnerId,
    pricingId: fakeProducts[0]?.pricing[0]?.uuid ?? "",
  },
  {
    uuid: fakeProductKeyId6,
    productId: fakeProductId2,
    key: fakePricingId1,
    expiry: new Date(2024, 10 - 1, 4 + 3).toISOString(),
    createdAt: new Date(2024, 10 - 1, 4).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 4).toISOString(),
    hardwareId: "f81826ac-6a44-4043-91e1-86573c24a9b5",
    owner: fakeOwnerId,
    pricingId: fakeProducts[1]?.pricing[0]?.uuid ?? "",
  },
  {
    uuid: fakeProductKeyId7,
    productId: fakeProductId1,
    key: fakePricingId1,
    expiry: undefined,
    createdAt: new Date(2024, 10 - 1, 3).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 3).toISOString(),
    hardwareId: null,
    owner: null,
    pricingId: fakeProducts[0]?.pricing[4]?.uuid ?? "",
  },
];

export const fakeOrders: OrderType[] = [
  {
    uuid: fakeOrderId1,
    purchasedBy: fakeOwnerId,
    productKey: fakeProductKeys[1]!,
    invoiceLink: uuidv4(),
    createdAt: new Date(2024, 10 - 1, 8).toISOString(),
  },
  {
    uuid: fakeOrderId2,
    purchasedBy: fakeOwnerId,
    productKey: fakeProductKeys[2]!,
    invoiceLink: uuidv4(),
    createdAt: new Date(2024, 10 - 1, 7).toISOString(),
  },
  {
    uuid: fakeOrderId3,
    purchasedBy: fakeOwnerId,
    productKey: fakeProductKeys[3]!,
    invoiceLink: uuidv4(),
    createdAt: new Date(2024, 10 - 1, 7).toISOString(),
  },
  {
    uuid: fakeOrderId4,
    purchasedBy: fakeOwnerId,
    productKey: fakeProductKeys[4]!,
    invoiceLink: uuidv4(),
    createdAt: new Date(2024, 10 - 1, 7).toISOString(),
  },
  {
    uuid: fakeOrderId5,
    purchasedBy: fakeOwnerId,
    productKey: fakeProductKeys[5]!,
    invoiceLink: uuidv4(),
    createdAt: new Date(2024, 10 - 1, 7).toISOString(),
  },
];

export const fakeUsers: UserType[] = [
  {
    uuid: fakeUserId1,
    role: "admin",
    username: "admin",
    email: "email_one@example.com",
    orders: null,
    createdAt: new Date(2024, 10 - 1, 9).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 9).toISOString(),
  },
  {
    uuid: fakeUserId2,
    role: "reseller",
    username: "reseller1",
    email: "email_two@example.com",
    orders: null,
    createdAt: new Date(2024, 10 - 1, 8).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 8).toISOString(),
  },
  {
    uuid: fakeUserId3,
    role: "user",
    username: "dev",
    email: "email_three@example.com",
    orders: fakeOrders,
    createdAt: new Date(2024, 10 - 1, 7).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 7).toISOString(),
  },
  {
    uuid: fakeUserId4,
    role: "user",
    username: "user2",
    email: "email_four@example.com",
    orders: [],
    createdAt: new Date(2024, 10 - 1, 6).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 6).toISOString(),
  },
  {
    uuid: fakeUserId5,
    role: "user",
    username: "user5",
    email: "email_five@example.com",
    orders: [],
    createdAt: new Date(2024, 10 - 1, 4).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 4).toISOString(),
  },
  {
    uuid: fakeUserId6,
    role: "user",
    username: "user6",
    email: "email_six@example.com",
    orders: [],
    createdAt: new Date(2024, 10 - 1, 4).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 4).toISOString(),
  },
  {
    uuid: fakeUserId7,
    role: "user",
    username: "user7",
    email: "email_seven@example.com",
    orders: [],
    createdAt: new Date(2024, 10 - 1, 3).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 3).toISOString(),
  },
];
