import { Sparkles, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';
import type { Order } from '@/types';

interface DeliveryAssistantCardProps {
  order: Order;
  onReview: () => void;
}

export function DeliveryAssistantCard({ order, onReview }: DeliveryAssistantCardProps) {
  const { status, preferences, address, cod } = order;

  if (status === 'DELIVERED') return null;

  // Determine which risks are unresolved
  const risks: string[] = [];
  if (!preferences.availability) risks.push('Availability not set');
  if (!preferences.preferredWindow) risks.push('Delivery window not chosen');
  if (!address.addressConfirmed) risks.push('Address needs confirmation');
  if (cod.isCOD && !cod.codConfirmed) risks.push('COD payment needs preparation');

  // All-set state
  if (
    (status === 'PREVENTION_COMPLETED' ||
      status === 'OUT_FOR_DELIVERY' ||
      status === 'DELIVERY_ATTEMPT' ||
      status === 'RESCHEDULED') &&
    risks.length === 0
  ) {
    return (
      <div className="mx-3 mt-3 rounded-lg bg-white border border-shopee-cyan/30 overflow-hidden">
        <div className="flex items-start gap-2.5 p-3">
          <div className="w-8 h-8 rounded-full bg-shopee-cyan/10 flex items-center justify-center shrink-0">
            <CheckCircle2 size={18} color="#26AA99" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-shopee-text-primary">You're all set</p>
            <p className="text-xs text-shopee-text-secondary mt-0.5 leading-relaxed">
              Your delivery preferences have been saved. The courier has everything needed
              to complete your delivery.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Failed/recovery state — don't show the assistant here, the failed card handles it
  if (status === 'FAILED' || status === 'RECOVERY_REQUIRED') return null;

  // Risk detected state
  const isRiskState = status === 'DELIVERY_RISK_DETECTED' || risks.length > 0;

  return (
    <div
      className="mx-3 mt-3 rounded-lg overflow-hidden"
      style={{
        background: isRiskState ? '#FFF7F0' : 'white',
        border: isRiskState ? '1px solid #FFD4C7' : '1px solid #f0f0f0',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-3 pt-3 pb-1.5">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
          style={{
            background: isRiskState ? 'rgba(238,77,45,0.12)' : 'rgba(38,170,153,0.12)',
          }}
        >
          {isRiskState ? (
            <Sparkles size={16} color="#EE4D2D" />
          ) : (
            <Sparkles size={16} color="#26AA99" />
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-shopee-text-primary flex items-center gap-1">
            AI Delivery Assistant
            <span className="text-[9px] font-normal text-shopee-text-secondary bg-neutral-100 px-1 py-px rounded">
              AI
            </span>
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="px-3 pb-2">
        <p className="text-xs text-shopee-text-primary leading-relaxed">
          {isRiskState
            ? 'We noticed this order may need your attention before delivery.'
            : 'Your delivery is on track. No action needed right now.'}
        </p>

        {isRiskState && risks.length > 0 && (
          <div className="mt-2 space-y-1.5">
            {risks.map((risk) => (
              <div key={risk} className="flex items-center gap-1.5">
                <AlertTriangle size={12} color="#EE4D2D" />
                <span className="text-xs text-shopee-text-primary">{risk}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      {isRiskState && (
        <button
          onClick={onReview}
          className="w-full flex items-center justify-between px-3 py-2.5 mt-1 border-t border-[#FFD4C7] active:bg-[#FFEDE5]"
        >
          <span className="text-sm font-medium text-shopee-orange">Review delivery</span>
          <ChevronRight size={16} color="#EE4D2D" />
        </button>
      )}
    </div>
  );
}
