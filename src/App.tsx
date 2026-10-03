import { useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { BottomNavigation } from '@/components/BottomNavigation';
import { DemoControls } from '@/components/DemoControls';
import { PurchasesScreen } from '@/screens/PurchasesScreen';
import { OrderDetailsScreen } from '@/screens/OrderDetailsScreen';
import { TrackingScreen } from '@/screens/TrackingScreen';
import { CodFlowScreen } from '@/screens/CodFlowScreen';
import { RtsFlowScreen } from '@/screens/RtsFlowScreen';
import { useOrders, useOrder } from '@/hooks/useOrders';
import type { Screen, BottomTab, Order } from '@/types';

export default function App() {
  const { orders, loading } = useOrders();
  const [screen, setScreen] = useState<Screen>({ name: 'purchases' });
  const [tab, setTab] = useState<BottomTab>('me');

  const activeOrderId =
    screen.name === 'orderDetails' ||
    screen.name === 'tracking' ||
    screen.name === 'codFlow' ||
    screen.name === 'rtsFlow'
      ? screen.orderId
      : null;

  const { order, updateOrder } = useOrder(activeOrderId);

  const handleTabChange = (newTab: BottomTab) => {
    setTab(newTab);
    setScreen({ name: 'purchases' });
  };

  const handleUpdateOrder = async (patch: Partial<Order>) => {
    if (!activeOrderId) return null;
    return updateOrder(activeOrderId, patch);
  };

  return (
    <AppShell>
      {/* Screen content */}
      {screen.name === 'purchases' && (
        <PurchasesScreen
          orders={orders}
          loading={loading}
          onNavigate={setScreen}
        />
      )}

      {screen.name === 'orderDetails' && order && (
        <OrderDetailsScreen
          order={order}
          onBack={() => setScreen({ name: 'purchases' })}
          onNavigate={setScreen}
        />
      )}

      {screen.name === 'tracking' && order && (
        <TrackingScreen
          order={order}
          onBack={() =>
            setScreen({ name: 'orderDetails', orderId: order.id })
          }
          onNavigate={setScreen}
          onUpdateOrder={handleUpdateOrder}
        />
      )}

      {screen.name === 'codFlow' && order && (
        <CodFlowScreen
          order={order}
          onBack={() => setScreen({ name: 'orderDetails', orderId: order.id })}
          onNavigate={setScreen}
          onUpdateOrder={handleUpdateOrder}
        />
      )}

      {screen.name === 'rtsFlow' && order && (
        <RtsFlowScreen
          order={order}
          onBack={() => setScreen({ name: 'orderDetails', orderId: order.id })}
          onNavigate={setScreen}
          onUpdateOrder={handleUpdateOrder}
        />
      )}

      {/* Bottom navigation — hidden during tracking for focus */}
      {screen.name !== 'tracking' && screen.name !== 'codFlow' && screen.name !== 'rtsFlow' && (
        <BottomNavigation active={tab} onTabChange={handleTabChange} />
      )}

      {/* Demo controls — only when viewing a specific order */}
      {order && (
        screen.name === 'tracking' ||
        screen.name === 'orderDetails' ||
        screen.name === 'codFlow' ||
        screen.name === 'rtsFlow'
      ) && <DemoControls order={order} onTransition={handleUpdateOrder} />}

      {/* Loading state for single order */}
      {activeOrderId && !order && loading && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-shopee-text-secondary">Loading order...</p>
        </div>
      )}
    </AppShell>
  );
}
