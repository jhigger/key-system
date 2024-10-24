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
    category: null,
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
    category: null,
    pricings: DEFAULT_PRICING,
  },
  {
    uuid: fakeProductId3,
    createdAt: new Date(2024, 10 - 1, 4).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 4).toISOString(),
    name: "Unlock All",
    category: null,
    pricings: DEFAULT_PRICING,
  },
];

export const fakeProductKeys: ProductKeyType[] = [
  {
    uuid: fakeProductKeyId1,
    productId: fakeProductId1,
    key: uuidv4(),
    createdAt: new Date(2024, 10 - 1, 8).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 8).toISOString(),
    owner: null,
    pricingId: fakePricingId1,
    reserved: false,
  },
  {
    uuid: fakeProductKeyId2,
    productId: fakeProductId2,
    key: uuidv4(),
    createdAt: new Date(2024, 10 - 1, 8).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 8).toISOString(),
    owner: fakeOwnerId,
    pricingId: fakePricingId2,
    reserved: false,
  },
  {
    uuid: fakeProductKeyId3,
    productId: fakeProductId1,
    key: uuidv4(),
    createdAt: new Date(2024, 10 - 1, 7).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 7).toISOString(),
    owner: fakeOwnerId,
    pricingId: fakePricingId3,
    reserved: false,
  },
  {
    uuid: fakeProductKeyId4,
    productId: fakeProductId2,
    key: uuidv4(),
    expiry: null,
    createdAt: new Date(2024, 10 - 1, 6).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 6).toISOString(),
    owner: fakeOwnerId,
    pricingId: fakePricingId4,
    reserved: false,
  },
  {
    uuid: fakeProductKeyId5,
    productId: fakeProductId1,
    key: uuidv4(),
    createdAt: new Date(2024, 10 - 1, 5).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 5).toISOString(),
    owner: fakeOwnerId,
    pricingId: fakePricingId5,
    reserved: false,
  },
  {
    uuid: fakeProductKeyId6,
    productId: fakeProductId2,
    key: uuidv4(),
    createdAt: new Date(2024, 10 - 1, 4).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 4).toISOString(),
    owner: fakeOwnerId,
    pricingId: fakePricingId1,
    reserved: false,
  },
  {
    uuid: fakeProductKeyId7,
    productId: fakeProductId1,
    key: uuidv4(),
    createdAt: new Date(2024, 10 - 1, 3).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 3).toISOString(),
    owner: null,
    pricingId: fakePricingId5,
    reserved: false,
  },
];

export const fakeOrders: OrderType[] = [
  {
    uuid: fakeOrderId1,
    purchasedBy: fakeOwnerId,
    invoiceLink: uuidv4(),
    createdAt: new Date(2024, 10 - 1, 8).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 8).toISOString(),
    status: "paid",
  },
  {
    uuid: fakeOrderId2,
    purchasedBy: fakeOwnerId,
    invoiceLink: uuidv4(),
    createdAt: new Date(2024, 10 - 1, 7).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 7).toISOString(),
    status: "paid",
  },
  {
    uuid: fakeOrderId3,
    purchasedBy: fakeOwnerId,
    invoiceLink: uuidv4(),
    createdAt: new Date(2024, 10 - 1, 7).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 7).toISOString(),
    status: "paid",
  },
  {
    uuid: fakeOrderId4,
    purchasedBy: fakeOwnerId,
    invoiceLink: uuidv4(),
    createdAt: new Date(2024, 10 - 1, 7).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 7).toISOString(),
    status: "paid",
  },
  {
    uuid: fakeOrderId5,
    purchasedBy: fakeOwnerId,
    invoiceLink: uuidv4(),
    createdAt: new Date(2024, 10 - 1, 7).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 7).toISOString(),
    status: "paid",
  },
];

export const fakeUsers: UserType[] = [
  {
    uuid: fakeUserId1,
    clerkId: "clerk_id_one",
    role: "admin",
    username: "admin",
    email: "email_one@example.com",
    approvedBy: null,
    createdAt: new Date(2024, 10 - 1, 9).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 9).toISOString(),
  },
  {
    uuid: fakeUserId2,
    clerkId: "clerk_id_two",
    role: "reseller",
    username: "reseller1",
    email: "email_two@example.com",
    approvedBy: null,
    createdAt: new Date(2024, 10 - 1, 8).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 8).toISOString(),
  },
  {
    uuid: fakeUserId3,
    clerkId: "clerk_id_three",
    role: "user",
    username: "dev",
    email: "email_three@example.com",
    approvedBy: null,
    createdAt: new Date(2024, 10 - 1, 7).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 7).toISOString(),
  },
  {
    uuid: fakeUserId4,
    clerkId: "clerk_id_four",
    role: "user",
    username: "user2",
    email: "email_four@example.com",
    approvedBy: null,
    createdAt: new Date(2024, 10 - 1, 6).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 6).toISOString(),
  },
  {
    uuid: fakeUserId5,
    clerkId: "clerk_id_five",
    role: "user",
    username: "user5",
    email: "email_five@example.com",
    approvedBy: null,
    createdAt: new Date(2024, 10 - 1, 4).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 4).toISOString(),
  },
  {
    uuid: fakeUserId6,
    clerkId: "clerk_id_six",
    role: "user",
    username: "user6",
    email: "email_six@example.com",
    approvedBy: null,
    createdAt: new Date(2024, 10 - 1, 4).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 4).toISOString(),
  },
  {
    uuid: fakeUserId7,
    clerkId: "clerk_id_seven",
    role: "user",
    username: "user7",
    email: "email_seven@example.com",
    approvedBy: null,
    createdAt: new Date(2024, 10 - 1, 3).toISOString(),
    updatedAt: new Date(2024, 10 - 1, 3).toISOString(),
  },
];
