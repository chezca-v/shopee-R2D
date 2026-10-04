-- R4R demo state: a failed attempt never implies parcel verification.
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS r4r_verification text NOT NULL DEFAULT 'PENDING',
  ADD COLUMN IF NOT EXISTS r4r_buyer_willing boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS r4r_decision text NOT NULL DEFAULT '';
