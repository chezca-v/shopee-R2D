/*
# Replace visible COD tier routing with neutral pathway state

## Overview
Adds a neutral `cod_pathway` field to the existing `orders` table. The application now
uses this field to select a COD flow instead of exposing buyer reliability tiers or trust
scores in the interface.

## New column on `orders`
- `cod_pathway` (text): FRICTIONLESS_ROUTE, DIGITAL_PAY_ROUTE, or MICRO_HUB_ROUTE.

## Data migration
Existing records are mapped from the previous internal tier values into neutral pathway
values so their current journey remains intact.

## Security
Existing RLS and anon + authenticated CRUD policies remain unchanged.

## Important notes
1. The old internal tier column is retained but is no longer used or displayed by the application.
2. No existing columns or rows are deleted.
*/

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS cod_pathway text NOT NULL DEFAULT 'FRICTIONLESS_ROUTE';

UPDATE orders
SET cod_pathway = CASE buyer_reliability_tier
  WHEN 'TIER_2_VOLATILE' THEN 'DIGITAL_PAY_ROUTE'
  WHEN 'TIER_1_RESTRICTED' THEN 'MICRO_HUB_ROUTE'
  ELSE 'FRICTIONLESS_ROUTE'
END;
