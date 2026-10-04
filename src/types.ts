export type DeliveryStatus =
  | 'ORDERED'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERY_RISK_DETECTED'
  | 'PREVENTION_COMPLETED'
  | 'DELIVERY_ATTEMPT'
  | 'FAILED'
  | 'RECOVERY_REQUIRED'
  | 'RESCHEDULED'
  | 'DELIVERED';

export type BuyerReliabilityTier =
  | 'TIER_4_ELITE'
  | 'TIER_3_STANDARD'
  | 'TIER_2_VOLATILE'
  | 'TIER_1_RESTRICTED';

export type CodPathway = 'FRICTIONLESS_ROUTE' | 'DIGITAL_PAY_ROUTE' | 'MICRO_HUB_ROUTE';

export type CodFlowStage =
  | 'FRICTIONLESS_CHECKOUT'
  | 'NIGHT_BEFORE_SYNC'
  | 'MORNING_ROUTE_OPTIMIZATION'
  | 'IN_TRANSIT_GAMIFIED_PIVOT'
  | 'ONE_TAP_DIGITAL_PAY'
  | 'RESTRICTED_CHECKOUT'
  | 'PASSIVE_DEFAULT_LOCK'
  | 'MICRO_HUB_PICKUP_SELECTED'
  | 'CERTIFIED_MICRO_HUB_BUFFER'
  | 'SUCCESSFUL_FIRST_ATTEMPT'
  | 'SUCCESSFUL_MICRO_HUB_HANDSHAKE';

export type RtsPath = 'UNOPENED_PRISTINE' | 'WRONG_ITEM_COLOR' | 'DEFECTIVE_RETURN';

export type R4rVerification =
  | 'PENDING'
  | 'VERIFIED_CHANGE_OF_MIND'
  | 'VERIFIED_BUYER_WILLING'
  | 'DISCREPANCY'
  | 'SUSPECTED_TAMPERING'
  | 'DAMAGED_INELIGIBLE';
export type R4rDecision = '' | 'REATTEMPT' | 'LOCAL_RESALE' | 'RETURN';

export type RtsStage =
  | 'AI_RTS_TRIAGE'
  | 'LOCAL_FLASH_DEALS'
  | 'FRESH_WAYBILL'
  | 'LOCAL_BUYER_CLAIMED_RESHIPPED'
  | 'RESCUE_SALE_DISCOUNT'
  | 'HUB_REPACKED_RESEALED'
  | 'LOCAL_BUYER_CLAIMED'
  | 'SHOPEE_ACCEPTS_LIABILITY'
  | 'INSTANT_SELLER_REIMBURSEMENT'
  | 'SELLER_CONTROL_PANEL'
  | 'REDIRECTED_SALE_SUCCESS'
  | 'DEFECTIVE_RESOLUTION_SUCCESS';

export interface TrackingEvent {
  label: string;
  time: string;
  completed: boolean;
}

export interface DeliveryPreferences {
  availability: '' | 'available' | 'someone_else' | 'unavailable';
  preferredWindow: '' | 'morning' | 'afternoon' | 'evening';
  receiverName: string;
  receiverPhone: string;
  instructions: string;
}

export interface AddressInfo {
  recipientName: string;
  phone: string;
  address: string;
  addressConfirmed: boolean;
}

export interface CodInfo {
  isCOD: boolean;
  amount: number;
  codConfirmed: boolean;
}

export interface RecoveryInfo {
  recoveryAction: '' | 'reschedule' | 'update_info' | 'add_instructions' | 'change_receiver';
  rescheduledDate: string;
  rescheduledWindow: '' | 'morning' | 'afternoon' | 'evening';
  recoveryStatus: '' | 'pending' | 'completed';
}

export interface Order {
  id: string;
  order_id: string;
  product_name: string;
  product_image: string;
  price: number;
  quantity: number;
  delivery_method: string;
  payment_method: string;
  status: DeliveryStatus;
  estimated_delivery: string;
  tracking_events: TrackingEvent[];
  failed_attempts: number;
  remaining_attempts: number;
  failure_reason: string | null;
  preferences: DeliveryPreferences;
  address: AddressInfo;
  cod: CodInfo;
  recovery: RecoveryInfo;
  buyer_reliability_tier: BuyerReliabilityTier;
  cod_pathway: CodPathway;
  cod_flow_stage: CodFlowStage;
  rts_path: RtsPath;
  rts_stage: RtsStage;
  r4r_verification: R4rVerification;
  r4r_buyer_willing: boolean;
  r4r_decision: R4rDecision;
  created_at: string;
  updated_at: string;
}

export type Screen =
  | { name: 'purchases' }
  | { name: 'orderDetails'; orderId: string }
  | { name: 'tracking'; orderId: string }
  | { name: 'codFlow'; orderId: string }
  | { name: 'rtsFlow'; orderId: string };

export type BottomTab = 'home' | 'notifications' | 'me' | 'cart';
