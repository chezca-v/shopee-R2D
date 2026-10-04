import { useEffect, useRef, useState } from "react";
import { FlaskConical, X, ChevronRight, RotateCcw } from "lucide-react";
import type {
  Order,
  CodPathway,
  CodFlowStage,
  RtsPath,
  RtsStage,
} from "@/types";
import {
  COD_FLOWS,
  COD_PATH_LABELS,
  RTS_FLOWS,
  RTS_PATH_LABELS,
} from "@/lib/flows";

interface DemoControlsProps {
  order: Order;
  onTransition: (patch: Partial<Order>) => void;
}

export function DemoControls({ order, onTransition }: DemoControlsProps) {
  const [open, setOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragState = useRef<{
    pointerId: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);

  useEffect(() => {
    const initialX = Math.max(18, window.innerWidth - 54);
    const initialY = Math.max(18, window.innerHeight - 92);
    setPosition({ x: initialX, y: initialY });
  }, []);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (!dragState.current || event.pointerId !== dragState.current.pointerId)
        return;

      const nextX = Math.min(
        Math.max(event.clientX - dragState.current.offsetX, 18),
        window.innerWidth - 18,
      );
      const nextY = Math.min(
        Math.max(event.clientY - dragState.current.offsetY, 18),
        window.innerHeight - 18,
      );

      setPosition({ x: nextX, y: nextY });
    };

    const handlePointerUp = (event: PointerEvent) => {
      if (
        dragState.current &&
        event.pointerId === dragState.current.pointerId
      ) {
        dragState.current = null;
      }
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  const setCodPathway = (pathway: CodPathway) => {
    const firstStage = COD_FLOWS[pathway][0].stage;
    onTransition({ cod_pathway: pathway, cod_flow_stage: firstStage });
    setOpen(false);
  };

  const setCodStage = (stage: CodFlowStage) => {
    onTransition({ cod_flow_stage: stage });
    setOpen(false);
  };

  const setRtsPath = (path: RtsPath) => {
    onTransition({ rts_path: path, rts_stage: "AI_RTS_TRIAGE" });
    setOpen(false);
  };

  const setRtsStage = (stage: RtsStage) => {
    onTransition({ rts_stage: stage });
    setOpen(false);
  };

  const resetFlows = () => {
    const codPathway: CodPathway =
      order.buyer_reliability_tier === "TIER_2_VOLATILE"
        ? "DIGITAL_PAY_ROUTE"
        : order.buyer_reliability_tier === "TIER_1_RESTRICTED"
          ? "MICRO_HUB_ROUTE"
          : "FRICTIONLESS_ROUTE";

    onTransition({
      cod_pathway: codPathway,
      cod_flow_stage: COD_FLOWS[codPathway][0].stage,
      rts_path: "UNOPENED_PRISTINE",
      rts_stage: "AI_RTS_TRIAGE",
    });
    setOpen(false);
  };

  const resetDeliveryPreferences = () => {
    onTransition({
      preferences: {
        availability: "",
        preferredWindow: "",
        receiverName: "",
        receiverPhone: "",
        instructions: "",
      },
    });
    setOpen(false);
  };

  const handleDragStart = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 && event.pointerType === "mouse") return;
    dragState.current = {
      pointerId: event.pointerId,
      offsetX: event.clientX - position.x,
      offsetY: event.clientY - position.y,
    };
  };

  const codSteps = COD_FLOWS[order.cod_pathway];
  const rtsSteps = RTS_FLOWS[order.rts_path];

  return (
    <>
      {!isHidden && (
        <div
          className="fixed z-40"
          style={{
            left: position.x,
            top: position.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div
            className="relative w-10 h-10 rounded-full bg-neutral-800 text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform cursor-grab active:cursor-grabbing"
            onPointerDown={handleDragStart}
            onClick={() => setOpen(true)}
            title="Demo Controls"
          >
            <FlaskConical size={18} />
            <button
              type="button"
              aria-label="Hide demo controls"
              className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-white bg-neutral-700 text-[8px] leading-none text-white shadow-sm"
              onClick={(event) => {
                event.stopPropagation();
                setIsHidden(true);
              }}
            >
              <X size={8} />
            </button>
          </div>
        </div>
      )}

      {isHidden && (
        <button
          type="button"
          onClick={() => setIsHidden(false)}
          className="fixed left-3 top-20 z-40 rounded-full bg-neutral-800 px-2.5 py-1.5 text-[10px] font-medium text-white shadow-lg"
        >
          Show demo
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/40 animate-fade-in"
            onClick={() => setOpen(false)}
          />
          <div className="relative bg-white rounded-t-xl animate-slide-up w-full max-w-[390px] max-h-[80%] flex flex-col">
            <div className="flex items-center justify-between px-4 pt-3 pb-2">
              <div className="flex items-center gap-2">
                <FlaskConical size={16} color="#666" />
                <h2 className="text-sm font-semibold text-shopee-text-primary">
                  Demo Controls
                </h2>
              </div>
              <button onClick={() => setOpen(false)} className="p-1">
                <X size={18} color="#999" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-4 scrollbar-hide space-y-4">
              {/* Neutral COD pathway selector */}
              <div>
                <p className="text-xs font-medium text-shopee-text-secondary mb-1.5 uppercase tracking-wide">
                  COD Pathway
                </p>
                <p className="text-[10px] text-shopee-text-tertiary mb-2">
                  Current: {COD_PATH_LABELS[order.cod_pathway]}
                </p>
                <div className="space-y-1">
                  {(Object.keys(COD_FLOWS) as CodPathway[]).map((pathway) => (
                    <button
                      key={pathway}
                      onClick={() => setCodPathway(pathway)}
                      disabled={order.cod_pathway === pathway}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border border-neutral-200 active:bg-neutral-50 disabled:opacity-40 text-left"
                    >
                      <div className="flex-1">
                        <p className="text-sm text-shopee-text-primary">
                          {COD_PATH_LABELS[pathway]}
                        </p>
                      </div>
                      <ChevronRight size={16} color="#ccc" />
                    </button>
                  ))}
                </div>
              </div>

              {/* COD pathway stage */}
              <div>
                <p className="text-xs font-medium text-shopee-text-secondary mb-1.5 uppercase tracking-wide">
                  COD Flow Stage
                </p>
                <p className="text-[10px] text-shopee-text-tertiary mb-2">
                  Current:{" "}
                  {codSteps.find((s) => s.stage === order.cod_flow_stage)
                    ?.label ?? order.cod_flow_stage}
                </p>
                <div className="space-y-1">
                  {codSteps.map((step) => (
                    <button
                      key={step.stage}
                      onClick={() => setCodStage(step.stage)}
                      disabled={order.cod_flow_stage === step.stage}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border border-neutral-200 active:bg-neutral-50 disabled:opacity-40 text-left"
                    >
                      <div className="flex-1">
                        <p className="text-sm text-shopee-text-primary">
                          {step.label}
                        </p>
                        <p className="text-xs text-shopee-text-secondary mt-0.5 line-clamp-1">
                          {step.description}
                        </p>
                      </div>
                      <ChevronRight size={16} color="#ccc" />
                    </button>
                  ))}
                </div>
              </div>

              {/* RTS path selector */}
              <div>
                <p className="text-xs font-medium text-shopee-text-secondary mb-1.5 uppercase tracking-wide">
                  RTS Triage Path
                </p>
                <p className="text-[10px] text-shopee-text-tertiary mb-2">
                  Current: {RTS_PATH_LABELS[order.rts_path]}
                </p>
                <div className="space-y-1">
                  {(Object.keys(RTS_FLOWS) as RtsPath[]).map((path) => (
                    <button
                      key={path}
                      onClick={() => setRtsPath(path)}
                      disabled={order.rts_path === path}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border border-neutral-200 active:bg-neutral-50 disabled:opacity-40 text-left"
                    >
                      <div className="flex-1">
                        <p className="text-sm text-shopee-text-primary">
                          {RTS_PATH_LABELS[path]}
                        </p>
                      </div>
                      <ChevronRight size={16} color="#ccc" />
                    </button>
                  ))}
                </div>
              </div>

              {/* RTS stage */}
              <div>
                <p className="text-xs font-medium text-shopee-text-secondary mb-1.5 uppercase tracking-wide">
                  RTS Flow Stage
                </p>
                <p className="text-[10px] text-shopee-text-tertiary mb-2">
                  Current:{" "}
                  {rtsSteps.find((s) => s.stage === order.rts_stage)?.label ??
                    order.rts_stage}
                </p>
                <div className="space-y-1">
                  {rtsSteps.map((step) => (
                    <button
                      key={step.stage}
                      onClick={() => setRtsStage(step.stage)}
                      disabled={order.rts_stage === step.stage}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border border-neutral-200 active:bg-neutral-50 disabled:opacity-40 text-left"
                    >
                      <div className="flex-1">
                        <p className="text-sm text-shopee-text-primary">
                          {step.label}
                        </p>
                        <p className="text-xs text-shopee-text-secondary mt-0.5 line-clamp-1">
                          {step.description}
                        </p>
                      </div>
                      <ChevronRight size={16} color="#ccc" />
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={resetFlows}
                className="w-full flex items-center justify-center gap-2 rounded-lg border border-neutral-200 py-2.5 text-sm font-medium text-shopee-text-primary active:bg-neutral-50"
              >
                <RotateCcw size={15} />
                Reset flows
              </button>

              <button
                type="button"
                onClick={resetDeliveryPreferences}
                className="w-full flex items-center justify-center gap-2 rounded-lg border border-neutral-200 py-2.5 text-sm font-medium text-shopee-text-primary active:bg-neutral-50"
              >
                <RotateCcw size={15} />
                Reset delivery preferences
              </button>

              <p className="text-[10px] text-shopee-text-tertiary text-center pt-2">
                For demo purposes only — not a Shopee feature
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
