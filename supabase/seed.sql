-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS categories (
    uuid UUID PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
    uuid UUID PRIMARY KEY,
    name TEXT NOT NULL,
    category UUID REFERENCES categories(uuid),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    pricings UUID[] -- Array of UUIDs referencing pricings
);

CREATE TABLE IF NOT EXISTS pricings (
    uuid UUID PRIMARY KEY,
    duration INTEGER NOT NULL, -- Duration in days
    value DECIMAL(10, 2) NOT NULL, -- Price value
    stock INTEGER NOT NULL, -- Available stock
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
    uuid UUID PRIMARY KEY,
    clerk_id TEXT UNIQUE NOT NULL, -- Unique identifier for the clerk
    role TEXT NOT NULL, -- User role (admin, user, etc.)
    username TEXT UNIQUE NOT NULL, -- Unique username
    email TEXT UNIQUE NOT NULL, -- Unique email address
    approved_by UUID REFERENCES users(uuid), -- Reference to another user who approved this user
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_keys (
    uuid UUID PRIMARY KEY,
    product_id UUID REFERENCES products(uuid), -- Reference to the product
    key TEXT UNIQUE NOT NULL, -- Unique key for the product
    expiry TIMESTAMPTZ, -- Expiry date for the key
    hardware_id TEXT, -- Optional hardware ID
    owner UUID REFERENCES users(uuid), -- Reference to the user who owns the key
    pricing_id UUID REFERENCES pricings(uuid), -- Reference to the pricing
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reserved BOOLEAN DEFAULT FALSE -- Indicates if the key is reserved
);

CREATE TABLE IF NOT EXISTS orders (
    uuid UUID PRIMARY KEY,
    purchased_by UUID REFERENCES users(uuid), -- Reference to the user who made the purchase
    product_key_id UUID REFERENCES product_keys(uuid), -- Reference to the purchased product key
    invoice_link TEXT, -- Link to the invoice
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status TEXT NOT NULL CHECK (status IN ('paid', 'unpaid', 'expired')) -- Order status
);

CREATE TABLE IF NOT EXISTS product_keys_snapshots (
    uuid UUID PRIMARY KEY,
    key TEXT NOT NULL, -- Key associated with the snapshot
    order_id UUID REFERENCES orders(uuid), -- Reference to the order
    owner UUID REFERENCES users(uuid), -- Reference to the owner
    pricing JSONB NOT NULL, -- Pricing details in JSONB format
    product_name TEXT NOT NULL, -- Name of the product
    expiry TIMESTAMPTZ, -- Expiry date for the snapshot
    hardware_id TEXT, -- Optional hardware ID
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Clear existing data
TRUNCATE categories, products, pricings, product_keys, orders, users, product_keys_snapshots CASCADE;
