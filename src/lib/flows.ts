import type {
  CodPathway,
  CodFlowStage,
  RtsPath,
  RtsStage,
} from '@/types';

export interface CodFlowStep {
  stage: CodFlowStage;
  label: string;
  description: string;
  badge?: string;
  isTerminal?: boolean;
}

export interface RtsFlowStep {
  stage: RtsStage;
  label: string;
  description: string;
  badge?: string;
  isTerminal?: boolean;
}

export const COD_PATH_LABELS: Record<CodPathway, string> = {
  FRICTIONLESS_ROUTE: 'Frictionless Checkout Route',
  DIGITAL_PAY_ROUTE: 'In-Transit Digital Pay Route',
  MICRO_HUB_ROUTE: 'Restricted Micro-Hub Route',
};

export const RTS_PATH_LABELS: Record<RtsPath, string> = {
  UNOPENED_PRISTINE: 'Path 1 — Unopened & Pristine',
  WRONG_ITEM_COLOR: 'Path 2 — Wrong Item / Color',
  DEFECTIVE_RETURN: 'Path 3 — Defective Return',
};

// COD checkout & risk scanning flows without visible tiering or trust scoring
export const COD_FLOWS: Record<CodPathway, CodFlowStep[]> = {
  FRICTIONLESS_ROUTE: [
    { stage: 'FRICTIONLESS_CHECKOUT', label: 'Frictionless Checkout', description: 'Order placed with checkout kept simple.' },
    { stage: 'NIGHT_BEFORE_SYNC', label: 'Night-Before Sync (Auto-confirmation)', description: 'AI auto-confirms buyer availability and delivery readiness the night before.' },
    { stage: 'MORNING_ROUTE_OPTIMIZATION', label: 'Morning AI Route Optimization (Pre-sorted Batch)', description: 'Order pre-sorted into the courier\'s optimized morning delivery batch.' },
    { stage: 'SUCCESSFUL_FIRST_ATTEMPT', label: 'Successful First Attempt Doorstep Delivery', description: 'Delivered on the first attempt.', isTerminal: true },
  ],
  DIGITAL_PAY_ROUTE: [
    { stage: 'FRICTIONLESS_CHECKOUT', label: 'Frictionless Checkout', description: 'Order placed with checkout kept simple.' },
    {
      stage: 'IN_TRANSIT_GAMIFIED_PIVOT',
      label: 'In-Transit Gamified Pivot',
      description: 'Day 2/3 Push: Convert to ShopeePay for Coins & Priority Refund Shield',
      badge: 'Day 2/3 Push',
    },
    { stage: 'ONE_TAP_DIGITAL_PAY', label: '1-Tap Digital Pay Activation', description: 'ShopeePay activated with one tap. Coins and refund shield unlocked.' },
    { stage: 'SUCCESSFUL_FIRST_ATTEMPT', label: 'Successful First Attempt Doorstep Delivery', description: 'Digital payment confirmed — delivered on first attempt.', isTerminal: true },
  ],
  MICRO_HUB_ROUTE: [
    {
      stage: 'RESTRICTED_CHECKOUT',
      label: 'Restricted Checkout',
      description: 'COD Disabled: Verify via Micro-Hub Only',
      badge: 'COD Disabled',
    },
    { stage: 'PASSIVE_DEFAULT_LOCK', label: 'Passive Default Lock (If unverified)', description: 'Order held until micro-hub pickup is chosen.' },
    { stage: 'MICRO_HUB_PICKUP_SELECTED', label: 'User Selects Micro-Hub Pickup', description: 'Buyer chooses certified Sari-Sari micro-hub pickup location.' },
    { stage: 'CERTIFIED_MICRO_HUB_BUFFER', label: 'Default to Certified Sari-Sari Micro-Hub (48hr Buffer)', description: 'Order routed to a certified micro-hub with a 48-hour pickup buffer.' },
    { stage: 'SUCCESSFUL_MICRO_HUB_HANDSHAKE', label: 'Successful Micro-Hub Handshake', description: 'Buyer collects package at micro-hub. Handshake complete.', isTerminal: true },
  ],
};

// RTS triage & hub diagnostics flows per path
export const RTS_FLOWS: Record<RtsPath, RtsFlowStep[]> = {
  UNOPENED_PRISTINE: [
    { stage: 'AI_RTS_TRIAGE', label: 'AI RTS Triage & Diagnostics', description: 'Hub rejects RTS package. AI inspects and triages.' },
    { stage: 'LOCAL_FLASH_DEALS', label: 'AI Lists as Same-City Flash Deals (Local Promo Feed)', description: 'Unopened & pristine — AI relists as a local flash deal.' },
    { stage: 'FRESH_WAYBILL', label: 'Fresh Waybill Printed Over Original', description: 'Hub prints a fresh waybill over the original RTS label.' },
    { stage: 'LOCAL_BUYER_CLAIMED_RESHIPPED', label: 'Local Buyer Claims Deal, Reshipped', description: 'A local buyer claims the flash deal. Package reshipped.' },
    { stage: 'REDIRECTED_SALE_SUCCESS', label: 'Redirected Sale Success', description: 'Sale redirected successfully — no revenue lost.', isTerminal: true },
  ],
  WRONG_ITEM_COLOR: [
    { stage: 'AI_RTS_TRIAGE', label: 'AI RTS Triage & Diagnostics', description: 'Hub rejects RTS package. AI inspects and triages.' },
    {
      stage: 'RESCUE_SALE_DISCOUNT',
      label: 'Rescue Sale via Discount',
      description: 'Seller Dashboard: Rescue Sale via Discount (30% OFF)',
      badge: '30% OFF',
    },
    { stage: 'HUB_REPACKED_RESEALED', label: 'Hub Repacks & Re-seals', description: 'Hub repacks and re-seals the item for resale.' },
    { stage: 'LOCAL_BUYER_CLAIMED', label: 'Local Buyer Claims Deal', description: 'A local buyer claims the discounted rescue deal.' },
    { stage: 'REDIRECTED_SALE_SUCCESS', label: 'Redirected Sale Success', description: 'Sale redirected successfully — revenue retained.', isTerminal: true },
  ],
  DEFECTIVE_RETURN: [
    { stage: 'AI_RTS_TRIAGE', label: 'AI RTS Triage & Diagnostics', description: 'Hub rejects RTS package. AI inspects and triages.' },
    { stage: 'SHOPEE_ACCEPTS_LIABILITY', label: 'Shopee Accepts Liability', description: 'Defective return — Shopee accepts liability for the item.' },
    { stage: 'INSTANT_SELLER_REIMBURSEMENT', label: 'Instant Seller Reimbursement (Via Escrow Protection)', description: 'Seller reimbursed instantly via escrow protection.' },
    {
      stage: 'SELLER_CONTROL_PANEL',
      label: 'Seller Control Panel',
      description: '1. Ship back to base OR 2. Drop/Liquidate at hub',
      badge: 'Seller Choice',
    },
    { stage: 'DEFECTIVE_RESOLUTION_SUCCESS', label: 'Defective Resolution Success', description: 'Defective return resolved — seller paid, buyer refunded.', isTerminal: true },
  ],
};

export const GLOBAL_OUTCOME_BADGE =
  'Revenue Secured, Seller Paid, Courier Earns, Platform Commission Retained';
