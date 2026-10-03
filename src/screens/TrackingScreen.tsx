import { useState } from 'react';
import { ShopeeHeader } from '@/components/ShopeeHeader';
import { TrackingTimeline } from '@/components/TrackingTimeline';
import { DeliveryAssistantCard } from '@/components/DeliveryAssistantCard';
import { FailedDeliveryCard } from '@/components/FailedDeliveryCard';
import { DeliveryPreferencesSheet } from '@/components/DeliveryPreferencesSheet';
import { AddressConfirmationSheet } from '@/components/AddressConfirmationSheet';
import { CodConfirmationSheet } from '@/components/CodConfirmationSheet';
import { RecoveryBottomSheet } from '@/components/RecoveryBottomSheet';
import { CheckCircle2, ChevronRight, Truck, ShieldCheck, MapPin, Banknote, Clock } from 'lucide-react';
import type { Order, Screen, DeliveryPreferences, AddressInfo, CodInfo, RecoveryInfo, TrackingEvent } from '@/types';
import { formatTHB, WINDOW_LABELS, AVAILABILITY_LABELS } from '@/lib/format';

interface TrackingScreenProps {
  order: Order;
  onBack: () => void;
  onNavigate: (screen: Screen) => void;
  onUpdateOrder: (patch: Partial<Order>) => Promise<Order | null>;
}

type SheetType = 'preferences' | 'address' | 'cod' | 'recovery' | null;

export function TrackingScreen({ order, onBack, onUpdateOrder }: TrackingScreenProps) {
  const [sheet, setSheet] = useState<SheetType>(null);
  const [savedToast, setSavedToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setSavedToast(msg);
    setTimeout(() => setSavedToast(null), 2500);
  };

  const allRisksResolved =
    order.preferences.availability &&
    order.preferences.preferredWindow &&
    order.address.addressConfirmed &&
    (!order.cod.isCOD || order.cod.codConfirmed);

  const handleSavePreferences = async (prefs: DeliveryPreferences) => {
    const patch: Partial<Order> = { preferences: prefs };
    if (allRisksResolvedWith(prefs, order.address, order.cod)) {
      patch.status = 'PREVENTION_COMPLETED';
    }
    await onUpdateOrder(patch);
    setSheet(null);
    showToast('Delivery preferences saved');
  };

  const handleConfirmAddress = async (addr: AddressInfo) => {
    const patch: Partial<Order> = { address: addr };
    if (allRisksResolvedWith(order.preferences, addr, order.cod)) {
      patch.status = 'PREVENTION_COMPLETED';
    }
    await onUpdateOrder(patch);
    setSheet(null);
    showToast('Address confirmed');
  };

  const handleConfirmCod = async (cod: CodInfo) => {
    const patch: Partial<Order> = { cod };
    if (allRisksResolvedWith(order.preferences, order.address, cod)) {
      patch.status = 'PREVENTION_COMPLETED';
    }
    await onUpdateOrder(patch);
    setSheet(null);
    showToast('COD payment confirmed');
  };

  const handleRecovery = async (
    recovery: RecoveryInfo,
    extra?: { address?: AddressInfo; preferences?: DeliveryPreferences },
  ) => {
    const patch: Partial<Order> = {
      recovery,
      status: 'RESCHEDULED',
      remaining_attempts: order.remaining_attempts,
    };
    if (extra?.address) patch.address = extra.address;
    if (extra?.preferences) patch.preferences = extra.preferences;

    // Update tracking events
    const newEvent: TrackingEvent = {
      label: 'Delivery rescheduled',
      time: 'Updated just now',
      completed: true,
    };
    const updatedEvents = markTimelineTo(order.tracking_events, 'Delivery rescheduled');
    patch.tracking_events = [...updatedEvents, newEvent];

    await onUpdateOrder(patch);
    setSheet(null);
    showToast('Delivery recovery submitted — back on track!');
  };

  const preventionItems = [
    {
      key: 'preferences',
      label: 'Delivery Preferences',
      desc: order.preferences.availability
        ? `${AVAILABILITY_LABELS[order.preferences.availability]} · ${WINDOW_LABELS[order.preferences.preferredWindow] || ''}`
        : 'Set availability & window',
      done: !!(order.preferences.availability && order.preferences.preferredWindow),
      icon: Clock,
      onClick: () => setSheet('preferences'),
    },
    {
      key: 'address',
      label: 'Address Confirmation',
      desc: order.address.addressConfirmed ? 'Address verified' : 'Verify your address',
      done: order.address.addressConfirmed,
      icon: MapPin,
      onClick: () => setSheet('address'),
    },
    ...(order.cod.isCOD
      ? [{
          key: 'cod',
          label: 'COD Confirmation',
          desc: order.cod.codConfirmed ? 'Payment ready' : `Prepare ${formatTHB(order.cod.amount)}`,
          done: order.cod.codConfirmed,
          icon: Banknote,
          onClick: () => setSheet('cod'),
        }]
      : []),
  ];

  const isRiskState =
    order.status === 'DELIVERY_RISK_DETECTED' || !allRisksResolved;
  const isFailed = order.status === 'FAILED' || order.status === 'RECOVERY_REQUIRED';

  return (
    <>
      <ShopeeHeader title="Order Tracking" showBack onBack={onBack} />
      <div className="flex-1 overflow-y-auto bg-shopee-gray pb-6">
        {/* Order mini-card */}
        <div className="bg-white px-4 py-3 flex gap-3">
          <div className="w-12 h-12 rounded-sm overflow-hidden bg-neutral-100 shrink-0">
            <img src={order.product_image} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-shopee-text-primary line-clamp-1">{order.product_name}</p>
            <p className="text-xs text-shopee-text-secondary mt-0.5">
              Order {order.order_id} · {formatTHB(order.price * order.quantity)}
            </p>
          </div>
        </div>

        {/* Delivery Assistant */}
        <DeliveryAssistantCard
          order={order}
          onReview={() => setSheet('preferences')}
        />

        {/* Failed Delivery Card */}
        <FailedDeliveryCard order={order} onFix={() => setSheet('recovery')} />

        {/* Prevention checklist — shown when risk detected or items incomplete */}
        {(isRiskState && !isFailed) && (
          <div className="mx-3 mt-3 rounded-lg bg-white overflow-hidden">
            <div className="px-3 py-2.5 border-b border-neutral-100 flex items-center gap-2">
              <ShieldCheck size={16} color="#EE4D2D" />
              <p className="text-sm font-medium text-shopee-text-primary">Review Delivery</p>
            </div>
            {preventionItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={item.onClick}
                  className="w-full flex items-center gap-3 px-3 py-3 border-b border-neutral-100 active:bg-neutral-50 last:border-0"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: item.done ? 'rgba(38,170,153,0.12)' : '#F5F5F5',
                    }}
                  >
                    {item.done ? (
                      <CheckCircle2 size={16} color="#26AA99" />
                    ) : (
                      <Icon size={16} color="#999" />
                    )}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm text-shopee-text-primary">{item.label}</p>
                    <p
                      className="text-xs truncate"
                      style={{ color: item.done ? '#26AA99' : '#999' }}
                    >
                      {item.desc}
                    </p>
                  </div>
                  {!item.done && <ChevronRight size={16} color="#ccc" />}
                </button>
              );
            })}
          </div>
        )}

        {/* Tracking timeline */}
        <div className="bg-white mt-2">
          <div className="px-4 pt-3 pb-1 flex items-center gap-2">
            <Truck size={16} color="#26AA99" />
            <p className="text-sm font-medium text-shopee-text-primary">Delivery Status</p>
          </div>
          <TrackingTimeline events={order.tracking_events} />
        </div>

        {/* Delivery details */}
        <div className="bg-white mt-2 px-4 py-3 text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-shopee-text-secondary">Delivery Method</span>
            <span className="text-shopee-text-primary">{order.delivery_method}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-shopee-text-secondary">Estimated Delivery</span>
            <span className="text-shopee-text-primary">{order.estimated_delivery}</span>
          </div>
          {order.preferences.instructions && (
            <div className="flex justify-between gap-4">
              <span className="text-shopee-text-secondary shrink-0">Instructions</span>
              <span className="text-shopee-text-primary text-right">{order.preferences.instructions}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Sheets */}
      <DeliveryPreferencesSheet
        open={sheet === 'preferences'}
        order={order}
        onClose={() => setSheet(null)}
        onSave={handleSavePreferences}
      />
      <AddressConfirmationSheet
        open={sheet === 'address'}
        order={order}
        onClose={() => setSheet(null)}
        onConfirm={handleConfirmAddress}
      />
      <CodConfirmationSheet
        open={sheet === 'cod'}
        order={order}
        onClose={() => setSheet(null)}
        onConfirm={handleConfirmCod}
      />
      <RecoveryBottomSheet
        open={sheet === 'recovery'}
        order={order}
        onClose={() => setSheet(null)}
        onRecover={handleRecovery}
      />

      {/* Toast */}
      {savedToast && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-50 bg-black/80 text-white text-xs px-4 py-2.5 rounded-lg animate-fade-in max-w-[300px] text-center">
          {savedToast}
        </div>
      )}
    </>
  );
}

function allRisksResolvedWith(
  prefs: DeliveryPreferences,
  addr: AddressInfo,
  cod: CodInfo,
): boolean {
  return !!(prefs.availability && prefs.preferredWindow && addr.addressConfirmed && (!cod.isCOD || cod.codConfirmed));
}

function markTimelineTo(events: TrackingEvent[], upToLabel: string): TrackingEvent[] {
  // Keep existing events unchanged; caller appends new event
  return [...events];
}
