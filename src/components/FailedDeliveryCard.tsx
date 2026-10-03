import { AlertCircle, Clock, Phone, MapPin, Wrench } from 'lucide-react';
import type { Order } from '@/types';

interface FailedDeliveryCardProps {
  order: Order;
  onFix: () => void;
}

export function FailedDeliveryCard({ order, onFix }: FailedDeliveryCardProps) {
  if (order.status !== 'FAILED' && order.status !== 'RECOVERY_REQUIRED') return null;

  const reasonText = order.failure_reason || 'Buyer unavailable';

  return (
    <div className="mx-3 mt-3 rounded-lg overflow-hidden border border-[#FFD4D4]">
      {/* Top: red banner */}
      <div className="bg-[#D0011B] px-4 py-3 text-white">
        <div className="flex items-center gap-2">
          <AlertCircle size={20} />
          <p className="text-sm font-semibold">Delivery attempt unsuccessful</p>
        </div>
      </div>

      {/* Body */}
      <div className="bg-white px-4 py-4">
        {/* Reason */}
        <div className="mb-3">
          <p className="text-xs text-shopee-text-secondary mb-0.5">Reason</p>
          <p className="text-sm font-medium text-shopee-text-primary">{reasonText}</p>
        </div>

        {/* Attempts */}
        <div className="flex items-center gap-4 mb-3 pb-3 border-b border-neutral-100">
          <div className="flex-1">
            <p className="text-xs text-shopee-text-secondary">Attempts made</p>
            <p className="text-sm font-medium text-shopee-text-primary mt-0.5">
              {order.failed_attempts} of 3
            </p>
          </div>
          <div className="w-px h-8 bg-neutral-200" />
          <div className="flex-1">
            <p className="text-xs text-shopee-text-secondary">Remaining</p>
            <p className="text-sm font-medium text-shopee-red mt-0.5">
              {order.remaining_attempts} attempt{order.remaining_attempts !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Hints based on reason */}
        <div className="space-y-1.5 mb-4">
          {reasonText.toLowerCase().includes('unavailable') && (
            <div className="flex items-center gap-1.5">
              <Clock size={13} color="#999" />
              <span className="text-xs text-shopee-text-secondary">Try a different delivery window</span>
            </div>
          )}
          {reasonText.toLowerCase().includes('address') && (
            <div className="flex items-center gap-1.5">
              <MapPin size={13} color="#999" />
              <span className="text-xs text-shopee-text-secondary">Update your delivery address</span>
            </div>
          )}
          {reasonText.toLowerCase().includes('contact') && (
            <div className="flex items-center gap-1.5">
              <Phone size={13} color="#999" />
              <span className="text-xs text-shopee-text-secondary">Verify your contact number</span>
            </div>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={onFix}
          className="shopee-cta w-full py-3 text-sm flex items-center justify-center gap-2"
        >
          <Wrench size={16} />
          Fix delivery
        </button>
        <p className="text-center text-[11px] text-shopee-text-secondary mt-2">
          Action needed to avoid return to sender
        </p>
      </div>
    </div>
  );
}
