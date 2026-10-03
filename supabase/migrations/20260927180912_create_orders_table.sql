/*
# Create orders table for Shopee Failed Delivery Prevention & Recovery prototype

## Overview
Creates a single `orders` table that stores the complete state of a Shopee order,
including delivery tracking, preferences, address, COD, and recovery information.
This is a single-tenant prototype (no auth), so all data is publicly accessible
via the anon key.

## New Tables
- `orders`
  - `id` (uuid, primary key)
  - `order_id` (text, human-readable order number like "240915XXXX")
  - `product_name` (text)
  - `product_image` (text, URL)
  - `price` (numeric, item price in THB)
  - `quantity` (int, default 1)
  - `delivery_method` (text, e.g. "Standard Delivery")
  - `payment_method` (text, e.g. "Cash on Delivery" or "Bank Transfer")
  - `status` (text, delivery state machine value)
  - `estimated_delivery` (text, human-readable ETA)
  - `tracking_events` (jsonb, array of timeline events)
  - `failed_attempts` (int, default 0)
  - `remaining_attempts` (int, default 3)
  - `failure_reason` (text, nullable)
  - `preferences` (jsonb, delivery preferences object)
  - `address` (jsonb, address object with confirmation flag)
  - `cod` (jsonb, COD object with amount and confirmation flag)
  - `recovery` (jsonb, recovery action object)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

## Status state machine
ORDERED -> SHIPPED -> OUT_FOR_DELIVERY -> DELIVERY_RISK_DETECTED ->
PREVENTION_COMPLETED -> DELIVERY_ATTEMPT -> FAILED -> RECOVERY_REQUIRED ->
RESCHEDULED -> OUT_FOR_DELIVERY -> DELIVERED

## Security
- RLS enabled on `orders`.
- Anon + authenticated have full CRUD (single-tenant prototype, intentionally public).
*/

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text NOT NULL,
  product_name text NOT NULL,
  product_image text NOT NULL DEFAULT '',
  price numeric NOT NULL DEFAULT 0,
  quantity int NOT NULL DEFAULT 1,
  delivery_method text NOT NULL DEFAULT 'Standard Delivery',
  payment_method text NOT NULL DEFAULT 'Cash on Delivery',
  status text NOT NULL DEFAULT 'ORDERED',
  estimated_delivery text NOT NULL DEFAULT '',
  tracking_events jsonb NOT NULL DEFAULT '[]'::jsonb,
  failed_attempts int NOT NULL DEFAULT 0,
  remaining_attempts int NOT NULL DEFAULT 3,
  failure_reason text,
  preferences jsonb NOT NULL DEFAULT '{}'::jsonb,
  address jsonb NOT NULL DEFAULT '{}'::jsonb,
  cod jsonb NOT NULL DEFAULT '{}'::jsonb,
  recovery jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_orders" ON orders;
CREATE POLICY "anon_select_orders" ON orders FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_orders" ON orders;
CREATE POLICY "anon_update_orders" ON orders FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_orders" ON orders;
CREATE POLICY "anon_delete_orders" ON orders FOR DELETE
  TO anon, authenticated USING (true);

-- updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS orders_updated_at ON orders;
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Seed data: 3 sample orders representing different states
INSERT INTO orders (order_id, product_name, product_image, price, quantity, delivery_method, payment_method, status, estimated_delivery, tracking_events, failed_attempts, remaining_attempts, failure_reason, preferences, address, cod, recovery)
VALUES
(
  '240915A8B92',
  'JBL Tune 230TWS Wireless Earbuds',
  'https://images.pexels.com/photos/33298190/pexels-photo-33298190.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  1299.00,
  1,
  'Standard Delivery',
  'Cash on Delivery',
  'OUT_FOR_DELIVERY',
  'Sep 27 - Sep 28',
  '[{"label":"Order placed","time":"Sep 24, 10:32","completed":true},{"label":"Order shipped","time":"Sep 25, 14:20","completed":true},{"label":"Out for delivery","time":"Sep 27, 08:15","completed":true},{"label":"Delivered","time":"Pending","completed":false}]'::jsonb,
  0,
  3,
  NULL,
  '{"availability":"","preferredWindow":"","receiverName":"","receiverPhone":"","instructions":""}'::jsonb,
  '{"recipientName":"Somchai Jaidee","phone":"081-234-5678","address":"123 Sukhumvit Rd, Khlong Toei, Bangkok 10110","addressConfirmed":false}'::jsonb,
  '{"isCOD":true,"amount":1299.00,"codConfirmed":false}'::jsonb,
  '{}'::jsonb
),
(
  '240914B3C71',
  'Anker PowerCore 10000mAh Portable Charger',
  'https://images.pexels.com/photos/38649173/pexels-photo-38649173.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  590.00,
  1,
  'Express Delivery',
  'Bank Transfer',
  'SHIPPED',
  'Sep 27 - Sep 28',
  '[{"label":"Order placed","time":"Sep 25, 09:15","completed":true},{"label":"Order shipped","time":"Sep 26, 11:00","completed":true},{"label":"Out for delivery","time":"Pending","completed":false},{"label":"Delivered","time":"Pending","completed":false}]'::jsonb,
  0,
  3,
  NULL,
  '{"availability":"","preferredWindow":"","receiverName":"","receiverPhone":"","instructions":""}'::jsonb,
  '{"recipientName":"Nattaya Wong","phone":"089-876-5432","address":"45 Silom Rd, Bang Rak, Bangkok 10500","addressConfirmed":true}'::jsonb,
  '{"isCOD":false,"amount":0,"codConfirmed":true}'::jsonb,
  '{}'::jsonb
),
(
  '240913C5D34',
  'Snail White 99% Niacinamide Serum',
  'https://images.pexels.com/photos/39281912/pexels-photo-39281912.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  349.00,
  2,
  'Standard Delivery',
  'Cash on Delivery',
  'DELIVERED',
  'Sep 25 - Sep 26',
  '[{"label":"Order placed","time":"Sep 22, 16:45","completed":true},{"label":"Order shipped","time":"Sep 23, 09:30","completed":true},{"label":"Out for delivery","time":"Sep 25, 08:00","completed":true},{"label":"Delivered","time":"Sep 25, 14:22","completed":true}]'::jsonb,
  0,
  3,
  NULL,
  '{"availability":"available","preferredWindow":"afternoon","receiverName":"Nattaya Wong","receiverPhone":"089-876-5432","instructions":"Please call before delivery."}'::jsonb,
  '{"recipientName":"Nattaya Wong","phone":"089-876-5432","address":"45 Silom Rd, Bang Rak, Bangkok 10500","addressConfirmed":true}'::jsonb,
  '{"isCOD":true,"amount":698.00,"codConfirmed":true}'::jsonb,
  '{}'::jsonb
)
ON CONFLICT DO NOTHING;
