import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface BottomSheetProps {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

export function BottomSheet({ open, title, subtitle, onClose, children, footer }: BottomSheetProps) {
  if (!open) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 animate-fade-in"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative bg-white rounded-t-xl animate-slide-up max-h-[85%] flex flex-col">
        {/* Handle */}
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 rounded-full bg-neutral-300" />
        </div>

        {/* Header */}
        <div className="px-4 pt-1 pb-3 flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-base font-semibold text-shopee-text-primary">{title}</h2>
            {subtitle && (
              <p className="text-xs text-shopee-text-secondary mt-1 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
          <button onClick={onClose} className="-mr-1 p-1 active:opacity-60">
            <X size={20} color="#999" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 scrollbar-hide">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-4 py-3 border-t border-neutral-100 bg-white rounded-b-xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
