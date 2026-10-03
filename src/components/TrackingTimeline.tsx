import { Check } from 'lucide-react';
import type { TrackingEvent } from '@/types';

export function TrackingTimeline({ events }: { events: TrackingEvent[] }) {
  return (
    <div className="px-4 py-4">
      {events.map((event, i) => (
        <div key={i} className="flex gap-3">
          {/* Line + dot */}
          <div className="flex flex-col items-center">
            <div
              className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5"
              style={{
                background: event.completed ? '#26AA99' : '#E0E0E0',
              }}
            >
              {event.completed && <Check size={10} color="white" strokeWidth={3} />}
            </div>
            {i < events.length - 1 && (
              <div
                className="w-0.5 flex-1 my-1"
                style={{
                  background: event.completed ? '#26AA99' : '#E0E0E0',
                  minHeight: '32px',
                }}
              />
            )}
          </div>
          {/* Text */}
          <div className={`flex-1 ${i < events.length - 1 ? 'pb-6' : ''}`}>
            <p
              className="text-sm leading-snug"
              style={{
                color: event.completed ? '#222222' : '#999999',
                fontWeight: event.completed ? 500 : 400,
              }}
            >
              {event.label}
            </p>
            <p className="text-xs text-shopee-text-secondary mt-0.5">{event.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
