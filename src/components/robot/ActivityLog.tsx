import { memo } from 'react';
import { StatusMessage } from '@/types/robot';

interface ActivityLogProps {
  messages: StatusMessage[];
  maxItems?: number;
}

// ZONE 3: Secondary Information - Activity Log (scrollable)
export const ActivityLog = memo(function ActivityLog({ 
  messages, 
  maxItems = 10 
}: ActivityLogProps) {
  const recentMessages = messages.slice(0, maxItems);

  return (
    <div className="glass-card p-3 flex-shrink-0">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-muted-foreground">Recent Activity</span>
        <span className="text-[10px] text-muted-foreground/60">{messages.length} events</span>
      </div>
      
      <div className="max-h-32 overflow-y-auto space-y-1">
        {recentMessages.length === 0 ? (
          <p className="text-xs text-muted-foreground/50 text-center py-3">
            No activity yet
          </p>
        ) : (
          recentMessages.map((msg) => (
            <div key={msg.id} className="flex items-center gap-2 py-1">
              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                msg.type === 'success' ? 'bg-success' :
                msg.type === 'warning' ? 'bg-warning' :
                msg.type === 'error' ? 'bg-destructive' :
                'bg-primary'
              }`} />
              <span className="text-xs flex-1 truncate text-muted-foreground">
                {msg.message}
              </span>
              <span className="text-[10px] text-muted-foreground/50 font-mono flex-shrink-0">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
});
