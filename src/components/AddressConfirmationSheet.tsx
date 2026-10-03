import { useState } from 'react';
import { BottomSheet } from '@/components/BottomSheet';
import { MapPin, Phone, User, CheckCircle2, Edit3 } from 'lucide-react';
import type { Order, AddressInfo } from '@/types';

interface AddressConfirmationSheetProps {
  open: boolean;
  order: Order;
  onClose: () => void;
  onConfirm: (addr: AddressInfo) => void;
}

export function AddressConfirmationSheet({
  open,
  order,
  onClose,
  onConfirm,
}: AddressConfirmationSheetProps) {
  const [editing, setEditing] = useState(false);
  const [addr, setAddr] = useState<AddressInfo>(order.address);

  return (
    <BottomSheet
      open={open}
      title="Confirm Delivery Address"
      subtitle="Please verify your delivery information to help prevent a failed delivery."
      onClose={onClose}
      footer={
        <div className="flex gap-2">
          {editing ? (
            <>
              <button
                onClick={() => {
                  setEditing(false);
                  setAddr(order.address);
                }}
                className="flex-1 py-3 text-sm border border-neutral-300 rounded text-shopee-text-primary active:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onConfirm({ ...addr, addressConfirmed: true });
                  setEditing(false);
                }}
                className="shopee-cta flex-1 py-3 text-sm"
              >
                Save & Confirm
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditing(true)}
                className="flex-1 py-3 text-sm border border-neutral-300 rounded text-shopee-text-primary active:bg-neutral-50 flex items-center justify-center gap-1.5"
              >
                <Edit3 size={15} />
                Edit
              </button>
              <button
                onClick={() => onConfirm({ ...addr, addressConfirmed: true })}
                className="shopee-cta flex-1 py-3 text-sm"
              >
                Confirm Address
              </button>
            </>
          )}
        </div>
      }
    >
      {order.address.addressConfirmed && !editing && (
        <div className="flex items-center gap-2 mb-3 rounded-lg bg-shopee-cyan/10 px-3 py-2">
          <CheckCircle2 size={16} color="#26AA99" />
          <span className="text-xs text-shopee-cyan font-medium">Address confirmed</span>
        </div>
      )}

      <div className="space-y-4">
        {/* Recipient */}
        <div>
          <label className="text-xs text-shopee-text-secondary flex items-center gap-1.5 mb-1.5">
            <User size={13} /> Recipient Name
          </label>
          {editing ? (
            <input
              value={addr.recipientName}
              onChange={(e) => setAddr({ ...addr, recipientName: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 text-sm outline-none focus:border-shopee-orange"
            />
          ) : (
            <p className="text-sm text-shopee-text-primary px-3 py-2.5 rounded-lg bg-neutral-50">
              {addr.recipientName}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="text-xs text-shopee-text-secondary flex items-center gap-1.5 mb-1.5">
            <Phone size={13} /> Phone Number
          </label>
          {editing ? (
            <input
              value={addr.phone}
              onChange={(e) => setAddr({ ...addr, phone: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 text-sm outline-none focus:border-shopee-orange"
            />
          ) : (
            <p className="text-sm text-shopee-text-primary px-3 py-2.5 rounded-lg bg-neutral-50">
              {addr.phone}
            </p>
          )}
        </div>

        {/* Address */}
        <div>
          <label className="text-xs text-shopee-text-secondary flex items-center gap-1.5 mb-1.5">
            <MapPin size={13} /> Delivery Address
          </label>
          {editing ? (
            <textarea
              value={addr.address}
              onChange={(e) => setAddr({ ...addr, address: e.target.value })}
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 text-sm outline-none focus:border-shopee-orange resize-none"
            />
          ) : (
            <p className="text-sm text-shopee-text-primary px-3 py-2.5 rounded-lg bg-neutral-50 leading-relaxed">
              {addr.address}
            </p>
          )}
        </div>
      </div>
    </BottomSheet>
  );
}
