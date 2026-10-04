import { ShopeeHeader } from '@/components/ShopeeHeader';
import { formatTHB } from '@/lib/format';
import type { Order, Screen } from '@/types';
import { Truck, MessageCircle, Store, ChevronRight, Sparkles, RotateCcw } from 'lucide-react';

interface OrderDetailsScreenProps {
  order: Order;
  onBack: () => void;
  onNavigate: (screen: Screen) => void;
}

export function OrderDetailsScreen({ order, onBack, onNavigate }: OrderDetailsScreenProps) {
  const total = order.price * order.quantity;

  return (
    <>
      <ShopeeHeader title="Order Details" showBack onBack={onBack} />
      <div className="flex-1 overflow-y-auto bg-shopee-gray pb-6">
        {/* Order ID banner */}
        <div className="bg-white px-4 py-3 flex items-center justify-between">
          <span className="text-xs text-shopee-text-secondary">Order ID</span>
          <span className="text-xs text-shopee-text-primary font-medium">{order.order_id}</span>
        </div>

        {/* Product card */}
        <div className="bg-white mt-2 px-4 py-3">
          <div className="flex gap-3">
            <div className="w-20 h-20 rounded-sm overflow-hidden bg-neutral-100 shrink-0">
              <img
                src={order.product_image}
                alt={order.product_name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-shopee-text-primary line-clamp-2 leading-snug">
                {order.product_name}
              </p>
              <p className="text-xs text-shopee-text-secondary mt-1">x{order.quantity}</p>
              <p className="text-sm text-shopee-text-primary mt-1">{formatTHB(order.price)}</p>
            </div>
          </div>

          {/* Order summary */}
          <div className="mt-3 pt-3 border-t border-neutral-100 space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-shopee-text-secondary">Order Total</span>
              <span className="text-shopee-text-primary font-medium">{formatTHB(total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-shopee-text-secondary">Shipping Fee</span>
              <span className="text-shopee-cyan">Free</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-shopee-text-primary font-medium">Total Payment</span>
              <span className="text-shopee-orange font-bold text-base">{formatTHB(total)}</span>
            </div>
          </div>
        </div>

        {/* Delivery info */}
        <div className="bg-white mt-2 px-4 py-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-shopee-text-secondary">Delivery Method</span>
            <span className="text-shopee-text-primary">{order.delivery_method}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-shopee-text-secondary">Payment Method</span>
            <span className="text-shopee-text-primary">{order.payment_method}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-shopee-text-secondary">Estimated Delivery</span>
            <span className="text-shopee-text-primary">{order.estimated_delivery}</span>
          </div>
        </div>

        {/* Recipient info */}
        <div className="bg-white mt-2 px-4 py-3 text-sm">
          <p className="text-shopee-text-secondary text-xs mb-1">Recipient</p>
          <p className="text-shopee-text-primary">{order.address.recipientName}</p>
          <p className="text-shopee-text-secondary text-xs mt-0.5">{order.address.phone}</p>
          <p className="text-shopee-text-secondary text-xs mt-0.5">{order.address.address}</p>
        </div>

        {/* Operational flow entry points */}
        <div className="mt-3 px-3">
          <p className="text-xs text-shopee-text-secondary mb-2 px-1">Operational Flows</p>
          <div className="bg-white rounded-lg overflow-hidden">
            {/* COD Risk Scanning */}
            <button
              className="w-full flex items-center gap-3 px-3 py-3 border-b border-neutral-100 active:bg-neutral-50"
              onClick={() => onNavigate({ name: 'codFlow', orderId: order.id })}
            >
              <div className="w-9 h-9 rounded-full bg-shopee-orange/10 flex items-center justify-center shrink-0">
                <Sparkles size={18} color="#EE4D2D" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-shopee-text-primary">AI Risk Scanning Engine</p>
                <p className="text-xs text-shopee-text-secondary mt-0.5">COD checkout & delivery pathway</p>
              </div>
              <ChevronRight size={16} color="#ccc" />
            </button>

            {/* RTS Triage */}
            <button
              className="w-full flex items-center gap-3 px-3 py-3 active:bg-neutral-50"
              onClick={() => onNavigate({ name: 'rtsFlow', orderId: order.id })}
            >
              <div className="w-9 h-9 rounded-full bg-shopee-cyan/10 flex items-center justify-center shrink-0">
                <RotateCcw size={18} color="#26AA99" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-shopee-text-primary">R4R · Ready for Resale / Return</p>
                <p className="text-xs text-shopee-text-secondary mt-0.5">
                  {order.r4r_verification === 'PENDING' ? 'Delivery failed · parcel verification pending' : `Parcel status · ${(order.r4r_verification ?? 'PENDING').replace(/_/g, ' ').toLowerCase()}`}
                </p>
              </div>
              <ChevronRight size={16} color="#ccc" />
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-3 flex items-center justify-end gap-2 px-4">
          <button className="flex items-center gap-1.5 text-sm text-shopee-text-secondary border border-neutral-300 rounded px-3 py-2 active:bg-neutral-50">
            <MessageCircle size={16} />
            Chat
          </button>
          {order.status !== 'ORDERED' && order.status !== 'DELIVERED' && (
            <button
              className="shopee-cta flex items-center gap-1.5 text-sm px-4 py-2"
              onClick={() => onNavigate({ name: 'tracking', orderId: order.id })}
            >
              <Truck size={16} />
              Track Order
            </button>
          )}
        </div>

        {/* Quick links */}
        <div className="bg-white mt-2">
          {[
            { icon: Store, label: 'Visit Shop' },
            { icon: MessageCircle, label: 'Chat with Seller' },
          ].map((item) => (
            <button
              key={item.label}
              className="w-full flex items-center gap-3 px-4 py-3 border-b border-neutral-100 active:bg-neutral-50"
            >
              <item.icon size={18} color="#999" />
              <span className="text-sm text-shopee-text-primary flex-1 text-left">{item.label}</span>
              <ChevronRight size={16} color="#ccc" />
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
