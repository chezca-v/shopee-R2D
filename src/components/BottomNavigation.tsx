import { Home, Bell, User, ShoppingCart } from 'lucide-react';
import type { BottomTab } from '@/types';

interface BottomNavigationProps {
  active: BottomTab;
  onTabChange: (tab: BottomTab) => void;
}

const TABS: { key: BottomTab; label: string; icon: typeof Home }[] = [
  { key: 'home', label: 'Home', icon: Home },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'cart', label: 'Cart', icon: ShoppingCart },
  { key: 'me', label: 'Me', icon: User },
];

export function BottomNavigation({ active, onTabChange }: BottomNavigationProps) {
  return (
    <nav className="sticky bottom-0 z-30 bg-white border-t border-neutral-200 flex items-stretch justify-around pb-1 pt-1.5">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className="flex flex-col items-center justify-center gap-0.5 flex-1 py-0.5 active:opacity-60"
          >
            <Icon
              size={22}
              strokeWidth={isActive ? 2.5 : 2}
              color={isActive ? '#EE4D2D' : '#999999'}
            />
            <span
              className="text-[10px] leading-tight"
              style={{ color: isActive ? '#EE4D2D' : '#999999' }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
