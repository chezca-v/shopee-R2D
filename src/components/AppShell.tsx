import type { ReactNode } from 'react';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-200 flex justify-center">
      <div className="relative w-full max-w-[390px] min-h-screen bg-shopee-gray shadow-2xl overflow-hidden flex flex-col">
        {children}
      </div>
    </div>
  );
}
