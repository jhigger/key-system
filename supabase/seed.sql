-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS products (
    uuid UUID PRIMARY KEY,
    name TEXT NOT NULL,
    pricing UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pricings (
    uuid UUID PRIMARY KEY,
    duration INTEGER NOT NULL,
    value DECIMAL(10, 2) NOT NULL,
    stock INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
    uuid UUID PRIMARY KEY,
    clerk_id TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_keys (
    uuid UUID PRIMARY KEY,
    product_id UUID REFERENCES products(uuid),
    key TEXT UNIQUE NOT NULL,
    expiry TIMESTAMPTZ,
    hardware_id TEXT,
    owner UUID REFERENCES users(uuid),
    pricing_id UUID REFERENCES pricings(uuid),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
    uuid UUID PRIMARY KEY,
    purchased_by UUID REFERENCES users(uuid),
    product_key_id UUID REFERENCES product_keys(uuid),
    invoice_link TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Clear existing data
TRUNCATE products, pricings, product_keys, orders, users CASCADE;

-- Insert users first
INSERT INTO users (uuid, clerk_id, role, username, email) VALUES
(gen_random_uuid(), 'clerk_id_one', 'admin', 'admin', 'email_one@example.com'),
(gen_random_uuid(), 'clerk_id_two', 'reseller', 'reseller1', 'email_two@example.com'),
(gen_random_uuid(), 'clerk_id_three', 'user', 'dev', 'email_three@example.com');

-- Insert pricings
INSERT INTO pricings (uuid, duration, value, stock) VALUES
(gen_random_uuid(), 1, 1.5, 1),
(gen_random_uuid(), 3, 3.0, 0),
(gen_random_uuid(), 7, 5.0, 0),
(gen_random_uuid(), 30, 13.0, 0),
(gen_random_uuid(), 0, 150.0, 1);

-- Insert products with a single pricing ID
WITH pricing_ids AS (SELECT uuid FROM pricings)
INSERT INTO products (uuid, name, pricing)
SELECT
    gen_random_uuid(),
    product_name,
    (SELECT uuid FROM pricing_ids ORDER BY random() LIMIT 1)
FROM
    (VALUES ('Distortion'), ('Densho'), ('Unlock All')) AS products(product_name);

-- Insert product_keys
WITH product_ids AS (SELECT uuid, pricing FROM products),
     user_ids AS (SELECT uuid FROM users)
INSERT INTO product_keys (uuid, product_id, key, expiry, hardware_id, owner, pricing_id)
SELECT
    gen_random_uuid(),
    product_ids.uuid,
    gen_random_uuid()::text,
    CASE WHEN random() > 0.5 THEN NOW() + interval '1 year' ELSE NULL END,
    CASE WHEN random() > 0.5 THEN gen_random_uuid()::text ELSE NULL END,
    CASE WHEN random() > 0.5 THEN (SELECT uuid FROM user_ids ORDER BY random() LIMIT 1) ELSE NULL END,
    product_ids.pricing
FROM
    product_ids
CROSS JOIN generate_series(1, 2)  -- This will create 2 keys per product
LIMIT 5;

-- Insert orders
WITH product_key_ids AS (SELECT uuid FROM product_keys),
     user_ids AS (SELECT uuid FROM users)
INSERT INTO orders (uuid, purchased_by, product_key_id, invoice_link)
SELECT
    gen_random_uuid(),
    (SELECT uuid FROM user_ids ORDER BY random() LIMIT 1),
    product_key_ids.uuid,
    gen_random_uuid()::text
FROM
    product_key_ids
LIMIT 3;