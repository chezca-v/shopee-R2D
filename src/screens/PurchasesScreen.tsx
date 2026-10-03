import { useState } from 'react';
import { ShopeeHeader } from '@/components/ShopeeHeader';
import { OrderCard } from '@/components/OrderCard';
import type { Order, Screen } from '@/types';
import { statusToTab } from '@/lib/format';

interface PurchasesScreenProps {
  orders: Order[];
  loading: boolean;
  onNavigate: (screen: Screen) => void;
}

type Tab = 'all' | 'toShip' | 'toReceive' | 'completed';

const TABS: { key: Tab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'toShip', label: 'To Ship' },
  { key: 'toReceive', label: 'To Receive' },
  { key: 'completed', label: 'Completed' },
];

export function PurchasesScreen({ orders, loading, onNavigate }: PurchasesScreenProps) {
  const [tab, setTab] = useState<Tab>('all');

  const filtered = orders.filter((o) => {
    if (tab === 'all') return true;
    if (tab === 'completed') return o.status === 'DELIVERED';
    if (tab === 'toShip') return o.status === 'ORDERED';
    if (tab === 'toReceive') {
      const t = statusToTab(o.status);
      return t === 'toReceive';
    }
    return true;
  });

  return (
    <>
      <ShopeeHeader title="My Purchases" />
      {/* Tabs */}
      <div className="sticky top-[52px] z-20 bg-white flex items-stretch border-b border-neutral-200">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="flex-1 py-3 text-sm relative"
            style={{
              color: tab === t.key ? '#EE4D2D' : '#222222',
              fontWeight: tab === t.key ? 500 : 400,
            }}
          >
            {t.label}
            {tab === t.key && (
              <span
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                style={{ background: '#EE4D2D' }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto bg-shopee-gray pb-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-shopee-text-secondary text-sm">Loading orders...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-shopee-text-secondary text-sm">No orders in this tab</p>
          </div>
        ) : (
          <div className="pt-2 px-2">
            {filtered.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onClick={() =>
                  onNavigate({ name: 'orderDetails', orderId: order.id })
                }
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
