import { useState } from 'react';
import { BottomSheet } from '@/components/BottomSheet';
import { CalendarClock, Pencil, MessageSquare, UserCog, Check } from 'lucide-react';
import type { Order, RecoveryInfo, AddressInfo, DeliveryPreferences } from '@/types';
import { WINDOW_LABELS } from '@/lib/format';

interface RecoveryBottomSheetProps {
  open: boolean;
  order: Order;
  onClose: () => void;
  onRecover: (recovery: RecoveryInfo, extra?: { address?: AddressInfo; preferences?: DeliveryPreferences }) => void;
}

type RecoveryAction = RecoveryInfo['recoveryAction'];

const RECOVERY_OPTIONS: {
  value: RecoveryAction;
  label: string;
  desc: string;
  icon: typeof CalendarClock;
}[] = [
  { value: 'reschedule', label: 'Reschedule Delivery', desc: 'Choose a new delivery date and time window', icon: CalendarClock },
  { value: 'update_info', label: 'Update Delivery Information', desc: 'Fix address or contact number', icon: Pencil },
  { value: 'add_instructions', label: 'Add Delivery Instructions', desc: 'Give the courier additional guidance', icon: MessageSquare },
  { value: 'change_receiver', label: 'Change Receiver', desc: 'Allow another person to receive it', icon: UserCog },
];

export function RecoveryBottomSheet({ open, order, onClose, onRecover }: RecoveryBottomSheetProps) {
  const [action, setAction] = useState<RecoveryAction>('');
  const [window, setWindow] = useState<RecoveryInfo['rescheduledWindow']>('');
  const [instructions, setInstructions] = useState(order.preferences.instructions || '');
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [address, setAddress] = useState(order.address.address);
  const [phone, setPhone] = useState(order.address.phone);

  const reason = (order.failure_reason || '').toLowerCase();
  const availableOptions = RECOVERY_OPTIONS.filter((o) => {
    if (reason.includes('unavailable')) return o.value === 'reschedule' || o.value === 'change_receiver';
    if (reason.includes('address')) return o.value === 'update_info' || o.value === 'add_instructions';
    if (reason.includes('contact')) return o.value === 'update_info';
    return true;
  });

  const canSubmit = (): boolean => {
    if (!action) return false;
    if (action === 'reschedule') return !!window;
    if (action === 'add_instructions') return instructions.trim().length > 0;
    if (action === 'change_receiver') return Boolean(receiverName.trim() && receiverPhone.trim());
    if (action === 'update_info') return address.trim().length > 0 || phone.trim().length > 0;
    return false;
  };

  const handleSubmit = () => {
    if (!canSubmit()) return;
    const recovery: RecoveryInfo = {
      recoveryAction: action,
      rescheduledDate: action === 'reschedule' ? 'Tomorrow' : '',
      rescheduledWindow: action === 'reschedule' ? window : '',
      recoveryStatus: 'completed',
    };

    const extra: { address?: typeof order.address; preferences?: typeof order.preferences } = {};

    if (action === 'update_info') {
      extra.address = { ...order.address, address, phone, addressConfirmed: true };
    }
    if (action === 'add_instructions') {
      extra.preferences = { ...order.preferences, instructions };
    }
    if (action === 'change_receiver') {
      extra.preferences = {
        ...order.preferences,
        receiverName,
        receiverPhone,
        availability: 'someone_else',
      };
    }

    onRecover(recovery, extra);
  };

  return (
    <BottomSheet
      open={open}
      title="Let's get your delivery back on track"
      subtitle="Choose an option below to help complete your delivery."
      onClose={onClose}
      footer={
        <button
          disabled={!canSubmit()}
          onClick={handleSubmit}
          className="shopee-cta w-full py-3 text-sm"
        >
          Confirm Recovery
        </button>
      }
    >
      {/* Recovery options */}
      <div className="space-y-2">
        {availableOptions.map((opt) => {
          const Icon = opt.icon;
          const selected = action === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => setAction(opt.value)}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-lg border text-left active:bg-neutral-50"
              style={{
                borderColor: selected ? '#EE4D2D' : '#E0E0E0',
                background: selected ? '#FFF7F0' : 'white',
              }}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: selected ? 'rgba(238,77,45,0.12)' : '#F5F5F5',
                }}
              >
                <Icon size={18} color={selected ? '#EE4D2D' : '#999'} />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-medium"
                  style={{ color: selected ? '#EE4D2D' : '#222' }}
                >
                  {opt.label}
                </p>
                <p className="text-xs text-shopee-text-secondary mt-0.5">{opt.desc}</p>
              </div>
              <div
                className="w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center"
                style={{ borderColor: selected ? '#EE4D2D' : '#ccc' }}
              >
                {selected && <Check size={12} color="#EE4D2D" strokeWidth={3} />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Action-specific form */}
      {action === 'reschedule' && (
        <div className="mt-4 pt-4 border-t border-neutral-100">
          <p className="text-sm font-medium text-shopee-text-primary mb-2">Choose a delivery window</p>
          <div className="space-y-2">
            {(['morning', 'afternoon', 'evening'] as const).map((w) => (
              <button
                key={w}
                onClick={() => setWindow(w)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border active:bg-neutral-50"
                style={{
                  borderColor: window === w ? '#EE4D2D' : '#E0E0E0',
                  background: window === w ? '#FFF7F0' : 'white',
                }}
              >
                <span
                  className="text-sm"
                  style={{ color: window === w ? '#EE4D2D' : '#222' }}
                >
                  {WINDOW_LABELS[w]}
                </span>
                {window === w && <Check size={16} color="#EE4D2D" />}
              </button>
            ))}
          </div>
          <p className="text-xs text-shopee-text-secondary mt-2">
            Rescheduled for tomorrow. The courier will attempt delivery in your chosen window.
          </p>
        </div>
      )}

      {action === 'update_info' && (
        <div className="mt-4 pt-4 border-t border-neutral-100 space-y-3">
          <div>
            <label className="text-xs text-shopee-text-secondary mb-1.5 block">Phone Number</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="08X-XXX-XXXX"
              className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 text-sm outline-none focus:border-shopee-orange"
            />
          </div>
          <div>
            <label className="text-xs text-shopee-text-secondary mb-1.5 block">Delivery Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 text-sm outline-none focus:border-shopee-orange resize-none"
            />
          </div>
        </div>
      )}

      {action === 'add_instructions' && (
        <div className="mt-4 pt-4 border-t border-neutral-100">
          <label className="text-xs text-shopee-text-secondary mb-1.5 block">Delivery Instructions</label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="e.g. Please call 10 minutes before arrival. The building entrance is on the side street."
            rows={4}
            className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 text-sm outline-none focus:border-shopee-orange resize-none"
          />
        </div>
      )}

      {action === 'change_receiver' && (
        <div className="mt-4 pt-4 border-t border-neutral-100 space-y-3">
          <div>
            <label className="text-xs text-shopee-text-secondary mb-1.5 block">New Receiver Name</label>
            <input
              value={receiverName}
              onChange={(e) => setReceiverName(e.target.value)}
              placeholder="e.g. Jane Doe"
              className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 text-sm outline-none focus:border-shopee-orange"
            />
          </div>
          <div>
            <label className="text-xs text-shopee-text-secondary mb-1.5 block">Contact Number</label>
            <input
              value={receiverPhone}
              onChange={(e) => setReceiverPhone(e.target.value)}
              placeholder="08X-XXX-XXXX"
              className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 text-sm outline-none focus:border-shopee-orange"
            />
          </div>
          <p className="text-xs text-shopee-text-secondary">
            This person will be authorized to receive the package on your behalf.
          </p>
        </div>
      )}
    </BottomSheet>
  );
}
