import { ChevronRight } from 'lucide-react';
import type { Order } from '@/types';
import { formatTHB, STATUS_LABELS } from '@/lib/format';

interface OrderCardProps {
  order: Order;
  onClick: () => void;
}

export function OrderCard({ order, onClick }: OrderCardProps) {
  const statusLabel = STATUS_LABELS[order.status] ?? order.status;
  const isIssue = order.status === 'FAILED' || order.status === 'RECOVERY_REQUIRED';

  return (
    <div className="bg-white mb-2" onClick={onClick}>
      {/* Status header bar */}
      <div
        className="flex items-center justify-between px-4 py-2.5 text-sm font-medium"
        style={
          isIssue
            ? { color: '#D0011B', background: '#FFF0F0' }
            : { color: '#26AA99' }
        }
      >
        <span>{statusLabel}</span>
        <ChevronRight size={16} color={isIssue ? '#D0011B' : '#26AA99'} />
      </div>

      {/* Product row */}
      <div className="px-4 pb-3 pt-1 flex gap-3">
        <div className="w-16 h-16 rounded-sm overflow-hidden bg-neutral-100 shrink-0">
          <img
            src={order.product_image}
            alt={order.product_name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-shopee-text-primary line-clamp-2 leading-snug">
            {order.product_name}
          </p>
          <p className="text-xs text-shopee-text-secondary mt-1">x{order.quantity}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-sm text-shopee-text-primary">{formatTHB(order.price)}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-neutral-100">
        <div className="flex items-center gap-1">
          {order.cod.isCOD && (
            <span className="text-[10px] font-medium text-shopee-orange border border-shopee-orange rounded px-1 py-0.5">
              COD
            </span>
          )}
          <span className="text-xs text-shopee-text-secondary">
            {order.payment_method}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-shopee-text-secondary">
            Total: <span className="text-shopee-text-primary font-medium">{formatTHB(order.price * order.quantity)}</span>
          </span>
          {order.status !== 'DELIVERED' && order.status !== 'ORDERED' && (
            <button
              className="shopee-cta text-xs px-3 py-1.5"
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
            >
              Track
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
