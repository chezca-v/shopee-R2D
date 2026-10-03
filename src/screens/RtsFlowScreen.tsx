import { useState } from 'react';
import { ShopeeHeader } from '@/components/ShopeeHeader';
import { BottomSheet } from '@/components/BottomSheet';
import { GlobalOutcomeBadge, FlowStepIcon } from '@/components/FlowComponents';
import { RTS_FLOWS, RTS_PATH_LABELS } from '@/lib/flows';
import { formatTHB } from '@/lib/format';
import type { Order, RtsPath, RtsStage, Screen } from '@/types';
import { ChevronRight, Sparkles, Package, RotateCcw, AlertTriangle, Truck, Droplet, Building2 } from 'lucide-react';

interface RtsFlowScreenProps {
  order: Order;
  onBack: () => void;
  onNavigate: (screen: Screen) => void;
  onUpdateOrder: (patch: Partial<Order>) => void;
}

const PATH_ICONS: Record<RtsPath, typeof Package> = {
  UNOPENED_PRISTINE: Package,
  WRONG_ITEM_COLOR: RotateCcw,
  DEFECTIVE_RETURN: AlertTriangle,
};

export function RtsFlowScreen({ order, onBack, onUpdateOrder }: RtsFlowScreenProps) {
  const [selectedPath, setSelectedPath] = useState<RtsPath>(order.rts_path);
  const [showSellerChoiceSheet, setShowSellerChoiceSheet] = useState(false);

  const steps = RTS_FLOWS[selectedPath];
  const currentIdx = steps.findIndex((s) => s.stage === order.rts_stage);
  const currentStep = steps[currentIdx] ?? steps[0];
  const isTerminal = currentStep?.isTerminal ?? false;
  const pathChanged = selectedPath !== order.rts_path;

  const selectPath = (path: RtsPath) => {
    setSelectedPath(path);
    onUpdateOrder({ rts_path: path, rts_stage: 'AI_RTS_TRIAGE' });
  };

  const handleAdvance = async () => {
    if (currentStep.stage === 'SELLER_CONTROL_PANEL') {
      setShowSellerChoiceSheet(true);
      return;
    }
    const next = steps[currentIdx + 1];
    if (next) onUpdateOrder({ rts_stage: next.stage });
  };

  const handleSellerChoice = async (choice: 'ship_back' | 'liquidate') => {
    setShowSellerChoiceSheet(false);
    onUpdateOrder({ rts_stage: 'DEFECTIVE_RESOLUTION_SUCCESS' });
  };

  return (
    <>
      <ShopeeHeader title="AI RTS Triage & Diagnostics" showBack onBack={onBack} />
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

        {/* AI Triage banner */}
        <div className="mx-3 mt-3 rounded-lg bg-white p-3 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-shopee-orange/10 flex items-center justify-center shrink-0">
            <Sparkles size={16} color="#EE4D2D" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-shopee-text-primary">Hub Rejection Detected</p>
            <p className="text-xs text-shopee-text-secondary">
              Package returned to sender. AI is triaging for resale or resolution.
            </p>
          </div>
        </div>

        {/* Path selector */}
        <div className="mx-3 mt-3">
          <p className="text-xs text-shopee-text-secondary mb-2 px-1">Select Triage Path</p>
          <div className="space-y-2">
            {(Object.keys(RTS_FLOWS) as RtsPath[]).map((path) => {
              const Icon = PATH_ICONS[path];
              const isSelected = selectedPath === path;
              return (
                <button
                  key={path}
                  onClick={() => selectPath(path)}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-lg border text-left active:bg-neutral-50"
                  style={{
                    borderColor: isSelected ? '#EE4D2D' : '#E0E0E0',
                    background: isSelected ? '#FFF7F0' : 'white',
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: isSelected ? 'rgba(238,77,45,0.12)' : '#F5F5F5',
                    }}
                  >
                    <Icon size={18} color={isSelected ? '#EE4D2D' : '#999'} />
                  </div>
                  <span
                    className="text-sm font-medium flex-1"
                    style={{ color: isSelected ? '#EE4D2D' : '#222' }}
                  >
                    {RTS_PATH_LABELS[path]}
                  </span>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full border-2 border-shopee-orange flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-shopee-orange" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Flow steps for selected path */}
        <div className="mx-3 mt-3 rounded-lg bg-white overflow-hidden">
          <div className="px-3 py-2.5 border-b border-neutral-100">
            <p className="text-sm font-medium text-shopee-text-primary">
              {RTS_PATH_LABELS[selectedPath]}
            </p>
          </div>
          {steps.map((step, i) => {
            const isCurrent = step.stage === order.rts_stage && !pathChanged;
            const isPast = i < currentIdx && !pathChanged;
            const isFuture = i > currentIdx || pathChanged;
            const completed = isPast || (isTerminal && isCurrent);

            return (
              <div key={step.stage} className="flex gap-3 px-3 py-3" style={{
                background: isCurrent ? '#FFF7F0' : 'white',
                opacity: isFuture ? 0.5 : 1,
              }}>
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
                        style={{ color: '#EDA500', background: 'rgba(237,165,0,0.1)' }}
                      >
                        {step.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-shopee-text-secondary mt-1 leading-relaxed">
                    {step.description}
                  </p>
                  {isCurrent && !isTerminal && (
                    <button
                      onClick={handleAdvance}
                      className="shopee-cta mt-2.5 text-xs px-3 py-2 flex items-center gap-1.5"
                    >
                      {step.stage === 'SELLER_CONTROL_PANEL' ? 'Open Seller Control Panel' : 'Advance to next step'}
                      <ChevronRight size={14} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Global outcome badge */}
        <GlobalOutcomeBadge show={isTerminal && !pathChanged} />
      </div>

      {/* Seller control panel bottom sheet (Path 3) */}
      <BottomSheet
        open={showSellerChoiceSheet}
        title="Seller Control Panel"
        subtitle="Choose how to handle the defective return."
        onClose={() => setShowSellerChoiceSheet(false)}
      >
        <div className="space-y-2">
          <button
            onClick={() => handleSellerChoice('ship_back')}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-lg border border-neutral-200 active:bg-neutral-50 text-left"
          >
            <div className="w-9 h-9 rounded-full bg-shopee-blue/10 flex items-center justify-center shrink-0">
              <Truck size={18} color="#0046AB" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-shopee-text-primary">1. Ship back to base</p>
              <p className="text-xs text-shopee-text-secondary mt-0.5">
                Return the item to your warehouse for inspection or refurbishment.
              </p>
            </div>
            <ChevronRight size={16} color="#ccc" />
          </button>
          <button
            onClick={() => handleSellerChoice('liquidate')}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-lg border border-neutral-200 active:bg-neutral-50 text-left"
          >
            <div className="w-9 h-9 rounded-full bg-shopee-red/10 flex items-center justify-center shrink-0">
              <Droplet size={18} color="#D0011B" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-shopee-text-primary">2. Drop/Liquidate at hub</p>
              <p className="text-xs text-shopee-text-secondary mt-0.5">
                Liquidate the defective item at the hub. No return shipping needed.
              </p>
            </div>
            <ChevronRight size={16} color="#ccc" />
          </button>
          <div className="flex items-start gap-2 rounded-lg bg-shopee-cyan/5 p-3 mt-2">
            <Building2 size={16} color="#26AA99" className="shrink-0 mt-0.5" />
            <p className="text-xs text-shopee-text-secondary leading-relaxed">
              Seller has already been reimbursed via escrow protection. This choice only affects
              the physical item disposition.
            </p>
          </div>
        </div>
      </BottomSheet>
    </>
  );
}
