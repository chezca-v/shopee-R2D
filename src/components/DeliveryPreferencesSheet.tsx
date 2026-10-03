import { useState } from 'react';
import { BottomSheet } from '@/components/BottomSheet';
import type { Order, DeliveryPreferences } from '@/types';
import { AVAILABILITY_LABELS, WINDOW_LABELS } from '@/lib/format';

interface DeliveryPreferencesSheetProps {
  open: boolean;
  order: Order;
  onClose: () => void;
  onSave: (prefs: DeliveryPreferences) => void;
}

const AVAILABILITY_OPTIONS: { value: DeliveryPreferences['availability']; label: string }[] = [
  { value: 'available', label: AVAILABILITY_LABELS.available },
  { value: 'someone_else', label: AVAILABILITY_LABELS.someone_else },
  { value: 'unavailable', label: AVAILABILITY_LABELS.unavailable },
];

const WINDOW_OPTIONS: { value: DeliveryPreferences['preferredWindow']; label: string; icon: string }[] = [
  { value: 'morning', label: 'Morning', icon: '9:00 - 12:00' },
  { value: 'afternoon', label: 'Afternoon', icon: '13:00 - 17:00' },
  { value: 'evening', label: 'Evening', icon: '18:00 - 21:00' },
];

export function DeliveryPreferencesSheet({
  open,
  order,
  onClose,
  onSave,
}: DeliveryPreferencesSheetProps) {
  const [prefs, setPrefs] = useState<DeliveryPreferences>(order.preferences);

  const canSave = prefs.availability && prefs.preferredWindow;

  return (
    <BottomSheet
      open={open}
      title="Delivery Preferences"
      subtitle="Help the courier deliver your package successfully by setting your preferences."
      onClose={onClose}
      footer={
        <button
          disabled={!canSave}
          onClick={() => onSave(prefs)}
          className="shopee-cta w-full py-3 text-sm"
        >
          Save Preferences
        </button>
      }
    >
      <div className="space-y-5">
        {/* Availability */}
        <div>
          <p className="text-sm font-medium text-shopee-text-primary mb-2">Availability</p>
          <div className="space-y-2">
            {AVAILABILITY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setPrefs({ ...prefs, availability: opt.value })}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border active:bg-neutral-50"
                style={{
                  borderColor: prefs.availability === opt.value ? '#EE4D2D' : '#E0E0E0',
                  background: prefs.availability === opt.value ? '#FFF7F0' : 'white',
                }}
              >
                <div
                  className="w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center"
                  style={{ borderColor: prefs.availability === opt.value ? '#EE4D2D' : '#ccc' }}
                >
                  {prefs.availability === opt.value && (
                    <div className="w-2 h-2 rounded-full bg-shopee-orange" />
                  )}
                </div>
                <span className="text-sm text-shopee-text-primary">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Preferred window */}
        <div>
          <p className="text-sm font-medium text-shopee-text-primary mb-2">Preferred Delivery Window</p>
          <div className="grid grid-cols-3 gap-2">
            {WINDOW_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setPrefs({ ...prefs, preferredWindow: opt.value })}
                className="rounded-lg border py-2.5 text-center active:opacity-70"
                style={{
                  borderColor: prefs.preferredWindow === opt.value ? '#EE4D2D' : '#E0E0E0',
                  background: prefs.preferredWindow === opt.value ? '#FFF7F0' : 'white',
                }}
              >
                <p
                  className="text-sm font-medium"
                  style={{ color: prefs.preferredWindow === opt.value ? '#EE4D2D' : '#222' }}
                >
                  {opt.label}
                </p>
                <p className="text-[10px] text-shopee-text-secondary mt-0.5">{opt.icon}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Receiver */}
        <div>
          <p className="text-sm font-medium text-shopee-text-primary mb-2">Receiver Details</p>
          <div className="space-y-2">
            <input
              placeholder="Receiver name"
              value={prefs.receiverName}
              onChange={(e) => setPrefs({ ...prefs, receiverName: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 text-sm outline-none focus:border-shopee-orange"
            />
            <input
              placeholder="Contact number (e.g. 08X-XXX-XXXX)"
              value={prefs.receiverPhone}
              onChange={(e) => setPrefs({ ...prefs, receiverPhone: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 text-sm outline-none focus:border-shopee-orange"
            />
          </div>
        </div>

        {/* Instructions */}
        <div>
          <p className="text-sm font-medium text-shopee-text-primary mb-2">Delivery Instructions</p>
          <textarea
            placeholder="e.g. Please call before delivery. Leave at the front desk."
            value={prefs.instructions}
            onChange={(e) => setPrefs({ ...prefs, instructions: e.target.value })}
            rows={3}
            className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 text-sm outline-none focus:border-shopee-orange resize-none"
          />
        </div>
      </div>
    </BottomSheet>
  );
}
