import { memo } from 'react';
import { Battery, BatteryCharging, Clock, MapPin, Package } from 'lucide-react';
import { RobotState } from '@/types/robot';
import { motion } from 'framer-motion';

interface RobotDisplayPanelProps {
  state: RobotState;
}

const statusLabels: Record<string, string> = {
  idle: 'IDLE',
  moving: 'MOVING',
  charging: 'CHARGING',
  obstacle_detected: 'OBSTACLE',
  task_completed: 'COMPLETED',
  emergency_stop: 'STOPPED',
  error: 'ERROR',
};

const roomLabels: Record<string, string> = {
  'living-room': 'Living Room',
  'bedroom': 'Bedroom',
  'kitchen': 'Kitchen',
  'store-room': 'Store Room',
};

/**
 * Robot Display Panel - Mirrors what the robot shows on its physical display
 * 
 * Layout:
 * - Top: Time + Battery
 * - Middle: Robot State (large)
 * - Message Area: Operator message
 * - Bottom: Weight + Destination
 */
export const RobotDisplayPanel = memo(function RobotDisplayPanel({
  state,
}: RobotDisplayPanelProps) {
  const { 
    batteryLevel, 
    status, 
    isCharging, 
    loadWeight, 
    maxLoadWeight, 
    displayMessage,
    destinationRoom,
    mode 
  } = state;

  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });

  const isOverweight = loadWeight > maxLoadWeight * 0.9;
  const statusColor = status === 'error' || status === 'emergency_stop' 
    ? 'text-destructive' 
    : isCharging 
      ? 'text-warning' 
      : 'text-primary';

  return (
    <div className="rounded-xl bg-gradient-to-b from-secondary/80 to-secondary/40 border border-border/50 overflow-hidden">
      {/* Screen bezel effect */}
      <div className="m-1 rounded-lg bg-background/95 p-3 space-y-3">
        {/* Top Row: Time + Battery */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-mono">{currentTime}</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            {isCharging ? (
              <motion.div
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="flex items-center gap-1 text-warning"
              >
                <BatteryCharging className="w-4 h-4" />
                <span className="font-mono text-xs">{batteryLevel}%</span>
              </motion.div>
            ) : (
              <div className={`flex items-center gap-1 ${
                batteryLevel <= 20 ? 'text-destructive' : 'text-primary'
              }`}>
                <Battery className="w-4 h-4" />
                <span className="font-mono text-xs">{batteryLevel}%</span>
              </div>
            )}
          </div>
        </div>

        {/* Middle: Robot State (Large) */}
        <div className="py-3 text-center border-y border-border/30">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
            Robot Status
          </p>
          <h2 className={`text-2xl font-bold tracking-wide ${statusColor}`}>
            {isCharging ? 'CHARGING' : statusLabels[status] || 'UNKNOWN'}
          </h2>
          {isCharging && (
            <motion.div 
              className="mt-2 mx-auto w-32 h-1.5 rounded-full bg-secondary overflow-hidden"
            >
              <motion.div
                className="h-full bg-warning rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${batteryLevel}%` }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>
          )}
        </div>

        {/* Message Area */}
        <div className="bg-secondary/50 rounded-lg p-2.5 min-h-[44px]">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
            Display Message
          </p>
          <p className="text-sm font-medium text-foreground">
            {displayMessage || <span className="text-muted-foreground italic">No message</span>}
          </p>
        </div>

        {/* Bottom: Weight + Destination */}
        <div className="flex items-center justify-between gap-3">
          {/* Weight */}
          <div className={`flex-1 rounded-lg p-2 ${
            isOverweight ? 'bg-destructive/10 border border-destructive/30' : 'bg-secondary/50'
          }`}>
            <div className="flex items-center gap-1.5">
              <Package className={`w-3.5 h-3.5 ${isOverweight ? 'text-destructive' : 'text-muted-foreground'}`} />
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Load</span>
            </div>
            <p className={`text-sm font-bold font-mono ${isOverweight ? 'text-destructive' : 'text-foreground'}`}>
              {loadWeight.toFixed(1)} kg
            </p>
          </div>

          {/* Destination */}
          <div className="flex-1 rounded-lg bg-secondary/50 p-2">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Destination</span>
            </div>
            <p className="text-sm font-bold text-foreground">
              {mode === 'auto' && destinationRoom 
                ? roomLabels[destinationRoom] 
                : <span className="text-muted-foreground font-normal">—</span>
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});
