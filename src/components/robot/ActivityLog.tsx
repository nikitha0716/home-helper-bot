import { memo } from 'react';
import { StatusMessage } from '@/types/robot';

interface ActivityLogProps {
  messages: StatusMessage[];
  maxItems?: number;
}

/**
 * RESPONSIVE Activity Log
 * 
 * Mobile: Compact text, tighter spacing
 * Tablet/Desktop: Normal text sizing
 */
export const ActivityLog = memo(function ActivityLog({ 
  messages, 
  maxItems = 10 
}: ActivityLogProps) {
  const recentMessages = messages.slice(0, maxItems);

  return (
    <div className="glass-card p-2 sm:p-3 h-full flex flex-col">
      <div className="flex items-center justify-between mb-1.5 sm:mb-2 flex-shrink-0">
        <span className="text-[10px] sm:text-xs font-medium text-muted-foreground">Recent Activity</span>
        <span className="text-[8px] sm:text-[10px] text-muted-foreground/60">{messages.length} events</span>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-0.5 sm:space-y-1">
        {recentMessages.length === 0 ? (
          <p className="text-[10px] sm:text-xs text-muted-foreground/50 text-center py-2 sm:py-3">
            No activity yet
          </p>
        ) : (
          recentMessages.map((msg) => (
            <div key={msg.id} className="flex items-center gap-1.5 sm:gap-2 py-0.5 sm:py-1">
              <div className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full flex-shrink-0 ${
                msg.type === 'success' ? 'bg-success' :
                msg.type === 'warning' ? 'bg-warning' :
                msg.type === 'error' ? 'bg-destructive' :
                'bg-primary'
              }`} />
              <span className="text-[10px] sm:text-xs flex-1 truncate text-muted-foreground">
                {msg.message}
              </span>
              <span className="text-[8px] sm:text-[10px] text-muted-foreground/50 font-mono flex-shrink-0">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
});
