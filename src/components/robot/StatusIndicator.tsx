import { motion } from 'framer-motion';
import { ConnectionStatus } from '@/types/robot';

interface StatusIndicatorProps {
  status: ConnectionStatus;
  label: string;
  showLabel?: boolean;
}

const statusConfig = {
  disconnected: { color: 'bg-muted-foreground', glow: '' },
  connecting: { color: 'bg-warning', glow: 'glow-warning' },
  connected: { color: 'bg-success', glow: 'glow-success' },
  error: { color: 'bg-destructive', glow: 'glow-destructive' },
};

export function StatusIndicator({ status, label, showLabel = true }: StatusIndicatorProps) {
  const config = statusConfig[status];
  
  return (
    <div className="flex items-center gap-2">
      <motion.div
        className={`w-2.5 h-2.5 rounded-full ${config.color} ${config.glow}`}
        animate={status === 'connecting' ? { opacity: [1, 0.5, 1] } : {}}
        transition={{ duration: 1, repeat: Infinity }}
      />
      {showLabel && (
        <span className="text-xs text-muted-foreground capitalize">{label}</span>
      )}
    </div>
  );
}
