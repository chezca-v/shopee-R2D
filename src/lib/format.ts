export function formatTHB(amount: number): string {
  return '฿' + amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

export const STATUS_LABELS: Record<string, string> = {
  ORDERED: 'To Ship',
  SHIPPED: 'To Receive',
  OUT_FOR_DELIVERY: 'To Receive',
  DELIVERY_RISK_DETECTED: 'To Receive',
  PREVENTION_COMPLETED: 'To Receive',
  DELIVERY_ATTEMPT: 'To Receive',
  FAILED: 'Delivery Issue',
  RECOVERY_REQUIRED: 'Action Needed',
  RESCHEDULED: 'To Receive',
  DELIVERED: 'Completed',
};

export function statusToTab(status: string): 'toShip' | 'toReceive' | 'completed' {
  if (status === 'DELIVERED') return 'completed';
  if (status === 'ORDERED') return 'toShip';
  return 'toReceive';
}

export const WINDOW_LABELS: Record<string, string> = {
  morning: 'Morning (9:00 - 12:00)',
  afternoon: 'Afternoon (13:00 - 17:00)',
  evening: 'Evening (18:00 - 21:00)',
};

export const AVAILABILITY_LABELS: Record<string, string> = {
  available: "I'm available",
  someone_else: 'Someone else can receive it',
  unavailable: "I won't be available",
};
