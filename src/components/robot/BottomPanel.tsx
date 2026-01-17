import { memo } from 'react';
import { StatusMessage } from '@/types/robot';
import { ActivityLog } from './ActivityLog';

interface BottomPanelProps {
  messages: StatusMessage[];
}

/**
 * RESPONSIVE BOTTOM PANEL - Activity Log
 * 
 * Mobile: Compact height (h-16)
 * Tablet/Desktop: Taller (h-24)
 */
export const BottomPanel = memo(function BottomPanel({
  messages,
}: BottomPanelProps) {
  return (
    <div className="rounded-xl border border-border/40 bg-secondary/20 overflow-hidden">
      {/* Panel Header */}
      <div className="flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 border-b border-border/30 bg-secondary/30">
        <h2 className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Recent Activity
        </h2>
      </div>

      {/* Activity Log - Fixed height with internal scroll */}
      <div className="h-16 sm:h-20 md:h-24 overflow-hidden">
        <ActivityLog messages={messages} maxItems={10} />
      </div>
    </div>
  );
});
