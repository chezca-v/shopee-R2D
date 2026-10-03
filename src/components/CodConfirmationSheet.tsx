import { BottomSheet } from '@/components/BottomSheet';
import { Banknote, CheckCircle2, Info } from 'lucide-react';
import type { Order, CodInfo } from '@/types';
import { formatTHB } from '@/lib/format';

interface CodConfirmationSheetProps {
  open: boolean;
  order: Order;
  onClose: () => void;
  onConfirm: (cod: CodInfo) => void;
}

export function CodConfirmationSheet({
  open,
  order,
  onClose,
  onConfirm,
}: CodConfirmationSheetProps) {
  const cod = order.cod;

  return (
    <BottomSheet
      open={open}
      title="Cash on Delivery"
      subtitle="Please confirm you're ready to pay when your order arrives."
      onClose={onClose}
      footer={
        <button
          disabled={cod.codConfirmed}
          onClick={() => onConfirm({ ...cod, codConfirmed: true })}
          className="shopee-cta w-full py-3 text-sm"
        >
          {cod.codConfirmed ? 'Confirmed' : `I confirm — I'll prepare ${formatTHB(cod.amount)}`}
        </button>
      }
    >
      <div className="space-y-4">
        {/* Amount card */}
        <div className="rounded-lg bg-shopee-orange/5 border border-shopee-orange/20 p-4 text-center">
          <Banknote size={32} color="#EE4D2D" className="mx-auto" />
          <p className="text-2xl font-bold text-shopee-orange mt-2">{formatTHB(cod.amount)}</p>
          <p className="text-xs text-shopee-text-secondary mt-1">
            Please prepare this amount when your order arrives
          </p>
        </div>

        {/* Info */}
        <div className="flex items-start gap-2 rounded-lg bg-neutral-50 p-3">
          <Info size={16} color="#999" className="shrink-0 mt-0.5" />
          <p className="text-xs text-shopee-text-secondary leading-relaxed">
            The courier will collect the cash payment upon delivery. Please have the exact
            amount ready to avoid delays.
          </p>
        </div>

        {cod.codConfirmed && (
          <div className="flex items-center gap-2 rounded-lg bg-shopee-cyan/10 px-3 py-2">
            <CheckCircle2 size={16} color="#26AA99" />
            <span className="text-xs text-shopee-cyan font-medium">
              COD confirmed — payment ready
            </span>
          </div>
        )}
      </div>
    </BottomSheet>
  );
}
