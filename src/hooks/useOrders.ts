import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Order } from '@/types';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (!mounted) return;
      if (error) {
        console.error('Failed to load orders:', error.message);
        setLoading(false);
        return;
      }
      setOrders(data as Order[]);
      setLoading(false);
    }

    load();

    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => load(),
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return { orders, loading };
}

export function useOrder(orderId: string | null) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!orderId) {
      setOrder(null);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .maybeSingle();

    if (error) {
      console.error('Failed to load order:', error.message);
      setLoading(false);
      return;
    }
    setOrder(data as Order | null);
    setLoading(false);
  }, [orderId]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    async function init() {
      await load();
    }
    init();

    if (!orderId) return;

    const channel = supabase
      .channel(`order-${orderId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` },
        () => { if (mounted) load(); },
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [orderId, load]);

  const updateOrder = useCallback(
    async (id: string, patch: Partial<Order>) => {
      const { data, error } = await supabase
        .from('orders')
        .update(patch)
        .eq('id', id)
        .select('*')
        .maybeSingle();

      if (error) {
        console.error('Failed to update order:', error.message);
        return null;
      }
      if (data) setOrder(data as Order);
      return data as Order | null;
    },
    [],
  );

  return { order, loading, updateOrder, reload: load };
}
