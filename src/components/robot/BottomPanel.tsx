import { memo } from 'react';
import { StatusMessage } from '@/types/robot';
import { ActivityLog } from './ActivityLog';

interface BottomPanelProps {
  messages: StatusMessage[];
}

/**
 * BOTTOM PANEL - Activity Log
 * 
 * Fixed height with vertical scrolling
 * Never pushes other elements or causes overlap
 */
export const BottomPanel = memo(function BottomPanel({
  messages,
}: BottomPanelProps) {
  return (
    <div className="rounded-xl border border-border/40 bg-secondary/20 overflow-hidden">
      {/* Panel Header */}
      <div className="flex-shrink-0 px-4 py-2 border-b border-border/30 bg-secondary/30">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Recent Activity
        </h2>
      </div>

      {/* Activity Log - Fixed height with internal scroll */}
      <div className="h-24 overflow-hidden">
        <ActivityLog messages={messages} maxItems={10} />
      </div>
    </div>
  );
});
