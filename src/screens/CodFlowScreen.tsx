import { useState } from 'react';
import { ShopeeHeader } from '@/components/ShopeeHeader';
import { BottomSheet } from '@/components/BottomSheet';
import { GlobalOutcomeBadge, FlowStepIcon } from '@/components/FlowComponents';
import { COD_FLOWS } from '@/lib/flows';
import { formatTHB } from '@/lib/format';
import type { Order, CodFlowStage, Screen } from '@/types';
import { ChevronRight, Sparkles, Coins, Shield, Zap, Store } from 'lucide-react';

interface CodFlowScreenProps {
  order: Order;
  onBack: () => void;
  onNavigate: (screen: Screen) => void;
  onUpdateOrder: (patch: Partial<Order>) => Promise<Order | null>;
}

export function CodFlowScreen({ order, onBack, onUpdateOrder }: CodFlowScreenProps) {
  const [showGamifiedSheet, setShowGamifiedSheet] = useState(false);
  const [showMicroHubSheet, setShowMicroHubSheet] = useState(false);
  const steps = COD_FLOWS[order.cod_pathway];
  const currentIdx = steps.findIndex((s) => s.stage === order.cod_flow_stage);
  const currentStep = steps[currentIdx] ?? steps[0];
  const isTerminal = currentStep?.isTerminal ?? false;

  const advanceTo = async (stage: CodFlowStage) => {
    await onUpdateOrder({ cod_flow_stage: stage });
  };

  const handleAdvance = async () => {
    // Special interactive steps
    if (currentStep.stage === 'IN_TRANSIT_GAMIFIED_PIVOT') {
      setShowGamifiedSheet(true);
      return;
    }
    if (currentStep.stage === 'PASSIVE_DEFAULT_LOCK') {
      setShowMicroHubSheet(true);
      return;
    }
    // Default: advance to next step
    const next = steps[currentIdx + 1];
    if (next) await advanceTo(next.stage);
  };

  const handleGamifiedConvert = async () => {
    setShowGamifiedSheet(false);
    await advanceTo('ONE_TAP_DIGITAL_PAY');
  };

  const handleSelectMicroHub = async () => {
    setShowMicroHubSheet(false);
    await advanceTo('MICRO_HUB_PICKUP_SELECTED');
  };

  return (
    <>
      <ShopeeHeader title="AI Risk Scanning Engine" showBack onBack={onBack} />
      <div className="flex-1 overflow-y-auto bg-shopee-gray pb-6">
        {/* Order context */}
        <div className="bg-white px-4 py-3 flex gap-3 items-center">
          <div className="w-12 h-12 rounded-sm overflow-hidden bg-neutral-100 shrink-0">
            <img src={order.product_image} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-shopee-text-primary line-clamp-1">{order.product_name}</p>
            <p className="text-xs text-shopee-text-secondary mt-0.5">
              {order.order_id} · {formatTHB(order.price * order.quantity)}
            </p>
          </div>
        </div>

        {/* AI Engine banner */}
        <div className="mx-3 mt-3 rounded-lg bg-white p-3 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-shopee-orange/10 flex items-center justify-center shrink-0">
            <Sparkles size={16} color="#EE4D2D" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-shopee-text-primary">COD Risk Scanning</p>
            <p className="text-xs text-shopee-text-secondary">
              Real-time checkout and delivery pathway
            </p>
          </div>
        </div>

        {/* Flow steps */}
        <div className="mx-3 mt-3 rounded-lg bg-white overflow-hidden">
          {steps.map((step, i) => {
            const isCurrent = step.stage === order.cod_flow_stage;
            const isPast = i < currentIdx;
            const isFuture = i > currentIdx;
            const completed = isPast || (isTerminal && isCurrent);

            return (
              <div key={step.stage}>
                <div
                  className="flex gap-3 px-3 py-3"
                  style={{
                    background: isCurrent ? '#FFF7F0' : 'white',
                    opacity: isFuture ? 0.5 : 1,
                  }}
                >
                  {/* Step number / icon */}
                  <div className="flex flex-col items-center shrink-0">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center"
                      style={{
                        background: completed
                          ? 'rgba(38,170,153,0.15)'
                          : isCurrent
                            ? 'rgba(238,77,45,0.12)'
                            : '#F5F5F5',
                      }}
                    >
                      <FlowStepIcon stage={step.stage} completed={completed} />
                    </div>
                    {i < steps.length - 1 && (
                      <div
                        className="w-0.5 flex-1 mt-1"
                        style={{
                          background: completed ? '#26AA99' : '#E0E0E0',
                          minHeight: '24px',
                        }}
                      />
                    )}
                  </div>

                  {/* Step content */}
                  <div className="flex-1 min-w-0 pb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p
                        className="text-sm font-medium"
                        style={{
                          color: completed ? '#26AA99' : isCurrent ? '#EE4D2D' : '#222',
                        }}
                      >
                        {step.label}
                      </p>
                      {step.badge && (
                        <span
                          className="text-[9px] font-medium rounded px-1.5 py-0.5"
                          style={{
                            color: step.stage === 'RESTRICTED_CHECKOUT' ? '#D0011B' : '#EDA500',
                            background:
                              step.stage === 'RESTRICTED_CHECKOUT'
                                ? 'rgba(208,1,27,0.1)'
                                : 'rgba(237,165,0,0.1)',
                          }}
                        >
                          {step.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-shopee-text-secondary mt-1 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Advance button on current step */}
                    {isCurrent && !isTerminal && (
                      <button
                        onClick={handleAdvance}
                        className="shopee-cta mt-2.5 text-xs px-3 py-2 flex items-center gap-1.5"
                      >
                        {step.stage === 'IN_TRANSIT_GAMIFIED_PIVOT' && 'Activate 1-Tap Digital Pay'}
                        {step.stage === 'PASSIVE_DEFAULT_LOCK' && 'Select Micro-Hub Pickup'}
                        {!['IN_TRANSIT_GAMIFIED_PIVOT', 'PASSIVE_DEFAULT_LOCK'].includes(step.stage) &&
                          'Advance to next step'}
                        <ChevronRight size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Global outcome badge */}
        <GlobalOutcomeBadge show={isTerminal} />
      </div>

      {/* Gamified pivot bottom sheet (Tier 2) */}
      <BottomSheet
        open={showGamifiedSheet}
        title="Day 2/3 Push"
        subtitle="Convert to ShopeePay for Coins & Priority Refund Shield"
        onClose={() => setShowGamifiedSheet(false)}
        footer={
          <button onClick={handleGamifiedConvert} className="shopee-cta w-full py-3 text-sm flex items-center justify-center gap-2">
            <Zap size={16} />
            1-Tap Digital Pay Activation
          </button>
        }
      >
        <div className="space-y-3">
          <div className="flex items-start gap-2.5 rounded-lg bg-shopee-orange/5 p-3">
            <Coins size={20} color="#EE4D2D" className="shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-shopee-text-primary">Earn ShopeePay Coins</p>
              <p className="text-xs text-shopee-text-secondary mt-0.5">
                Convert your COD order to digital payment and earn coins on this purchase.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 rounded-lg bg-shopee-cyan/5 p-3">
            <Shield size={20} color="#26AA99" className="shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-shopee-text-primary">Priority Refund Shield</p>
              <p className="text-xs text-shopee-text-secondary mt-0.5">
                Digital payments qualify for priority refund protection — faster than COD returns.
              </p>
            </div>
          </div>
        </div>
      </BottomSheet>

      {/* Micro-hub pickup bottom sheet (Tier 1) */}
      <BottomSheet
        open={showMicroHubSheet}
        title="Select Micro-Hub Pickup"
        subtitle="Choose a certified Sari-Sari micro-hub near you to collect your order."
        onClose={() => setShowMicroHubSheet(false)}
        footer={
          <button onClick={handleSelectMicroHub} className="shopee-cta w-full py-3 text-sm">
            Confirm Micro-Hub Pickup
          </button>
        }
      >
        <div className="space-y-2">
          {[
            { name: 'Mama Lita\'s Sari-Sari Store', distance: '0.4 km', address: '12 Soi Sukhumvit 23' },
            { name: 'Bayan Hub Express', distance: '0.8 km', address: '88 Asoke Montri Rd' },
            { name: 'Community Pickup Point 7', distance: '1.2 km', address: '45 Rama IX Rd' },
          ].map((hub, i) => (
            <button
              key={hub.name}
              onClick={() => setShowMicroHubSheet(false)}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-lg border border-neutral-200 active:bg-neutral-50 text-left"
              style={{ borderColor: i === 0 ? '#EE4D2D' : '#E0E0E0', background: i === 0 ? '#FFF7F0' : 'white' }}
            >
              <div className="w-9 h-9 rounded-full bg-shopee-orange/10 flex items-center justify-center shrink-0">
                <Store size={18} color="#EE4D2D" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-shopee-text-primary">{hub.name}</p>
                <p className="text-xs text-shopee-text-secondary mt-0.5">{hub.address}</p>
              </div>
              <span className="text-xs text-shopee-text-secondary shrink-0">{hub.distance}</span>
            </button>
          ))}
          <p className="text-xs text-shopee-text-secondary mt-2">
            48-hour pickup buffer applies. Order will be held at the micro-hub for 48 hours.
          </p>
        </div>
      </BottomSheet>
    </>
  );
}
