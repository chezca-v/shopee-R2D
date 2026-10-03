/*
# Add operational flow state for COD risk scanning and RTS diagnostics

## Overview
Adds persistent fields to the existing single-tenant `orders` table so the prototype
can render and advance the exact operational pathways from the provided flowcharts.
The existing delivery, address, COD, and tracking data remains unchanged.

## New columns on `orders`
- `buyer_reliability_tier` (text): TIER_4_ELITE, TIER_3_STANDARD, TIER_2_VOLATILE, or TIER_1_RESTRICTED.
- `cod_flow_stage` (text): current step in the COD checkout and risk scanning pathway.
- `rts_path` (text): UNOPENED_PRISTINE, WRONG_ITEM_COLOR, or DEFECTIVE_RETURN.
- `rts_stage` (text): current step in the AI RTS triage and diagnostics pathway.

## Security
- Existing RLS remains enabled.
- Existing anon + authenticated CRUD policies continue to cover the new columns for this no-auth prototype.

## Important notes
1. No existing columns or rows are removed.
2. Defaults keep existing orders readable while allowing the UI to advance the new flows.
*/

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS buyer_reliability_tier text NOT NULL DEFAULT 'TIER_3_STANDARD',
  ADD COLUMN IF NOT EXISTS cod_flow_stage text NOT NULL DEFAULT 'FRICTIONLESS_CHECKOUT',
  ADD COLUMN IF NOT EXISTS rts_path text NOT NULL DEFAULT 'UNOPENED_PRISTINE',
  ADD COLUMN IF NOT EXISTS rts_stage text NOT NULL DEFAULT 'AI_RTS_TRIAGE';

UPDATE orders
SET buyer_reliability_tier = CASE
  WHEN order_id = '240915A8B92' THEN 'TIER_2_VOLATILE'
  WHEN order_id = '240914B3C71' THEN 'TIER_4_ELITE'
  ELSE 'TIER_3_STANDARD'
END
WHERE buyer_reliability_tier = 'TIER_3_STANDARD';

UPDATE orders
SET cod_flow_stage = 'FRICTIONLESS_CHECKOUT'
WHERE cod_flow_stage = 'FRICTIONLESS_CHECKOUT';

UPDATE orders
SET rts_path = 'UNOPENED_PRISTINE', rts_stage = 'AI_RTS_TRIAGE'
WHERE rts_path = 'UNOPENED_PRISTINE' AND rts_stage = 'AI_RTS_TRIAGE';
