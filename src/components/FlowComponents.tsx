import { CheckCircle2, Lock, Zap, Coins, ShieldCheck, Store, Home } from 'lucide-react';
interface OutcomeBadgeProps {
  show: boolean;
}

export function GlobalOutcomeBadge({ show }: OutcomeBadgeProps) {
  if (!show) return null;
  return (
    <div
      className="mx-3 mt-3 rounded-xl p-4 text-center animate-fade-in"
      style={{ background: 'linear-gradient(135deg, #26AA99 0%, #1a8e7e 100%)' }}
    >
      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-2">
        <CheckCircle2 size={28} color="white" />
      </div>
      <p className="text-white font-bold text-sm leading-relaxed">
        Revenue Secured, Seller Paid, Courier Earns, Platform Commission Retained
      </p>
    </div>
  );
}

interface FlowStepIconProps {
  stage: string;
  completed: boolean;
}

export function FlowStepIcon({ stage, completed }: FlowStepIconProps) {
  const iconMap: Record<string, typeof CheckCircle2> = {
    FRICTIONLESS_CHECKOUT: Zap,
    NIGHT_BEFORE_SYNC: CheckCircle2,
    MORNING_ROUTE_OPTIMIZATION: CheckCircle2,
    IN_TRANSIT_GAMIFIED_PIVOT: Coins,
    ONE_TAP_DIGITAL_PAY: Zap,
    RESTRICTED_CHECKOUT: Lock,
    PASSIVE_DEFAULT_LOCK: Lock,
    MICRO_HUB_PICKUP_SELECTED: Store,
    CERTIFIED_MICRO_HUB_BUFFER: Store,
    SUCCESSFUL_FIRST_ATTEMPT: Home,
    SUCCESSFUL_MICRO_HUB_HANDSHAKE: Home,
    AI_RTS_TRIAGE: ShieldCheck,
    LOCAL_FLASH_DEALS: Zap,
    FRESH_WAYBILL: CheckCircle2,
    LOCAL_BUYER_CLAIMED_RESHIPPED: CheckCircle2,
    RESCUE_SALE_DISCOUNT: Zap,
    HUB_REPACKED_RESEALED: CheckCircle2,
    LOCAL_BUYER_CLAIMED: CheckCircle2,
    SHOPEE_ACCEPTS_LIABILITY: ShieldCheck,
    INSTANT_SELLER_REIMBURSEMENT: CheckCircle2,
    SELLER_CONTROL_PANEL: ShieldCheck,
    REDIRECTED_SALE_SUCCESS: CheckCircle2,
    DEFECTIVE_RESOLUTION_SUCCESS: CheckCircle2,
  };
  const Icon = iconMap[stage] ?? CheckCircle2;
  return <Icon size={16} color={completed ? '#26AA99' : '#999'} />;
}
