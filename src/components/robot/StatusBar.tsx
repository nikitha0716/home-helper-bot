import { memo } from 'react';
import { Bot, Battery, Signal, MapPin, Navigation } from 'lucide-react';
import { RobotState, RobotStatus } from '@/types/robot';

interface StatusBarProps {
  state: RobotState;
}

const getStatusDisplay = (status: RobotStatus) => {
  switch (status) {
    case 'idle':
      return { text: 'IDLE', color: 'text-success', bg: 'bg-success/20' };
    case 'moving':
      return { text: 'MOVING', color: 'text-primary', bg: 'bg-primary/20' };
    case 'obstacle_detected':
      return { text: 'OBSTACLE', color: 'text-warning', bg: 'bg-warning/20' };
    case 'emergency_stop':
      return { text: 'STOPPED', color: 'text-destructive', bg: 'bg-destructive/20' };
    case 'task_completed':
      return { text: 'COMPLETE', color: 'text-success', bg: 'bg-success/20' };
    case 'error':
      return { text: 'ERROR', color: 'text-destructive', bg: 'bg-destructive/20' };
    default:
      return { text: 'UNKNOWN', color: 'text-muted-foreground', bg: 'bg-secondary' };
  }
};

// ZONE 1: Status Bar - Always visible, fixed position
export const StatusBar = memo(function StatusBar({ state }: StatusBarProps) {
  const { currentRoom, destinationRoom, status, batteryLevel, signalStrength, bluetoothStatus } = state;
  const statusDisplay = getStatusDisplay(status);
  const isConnected = bluetoothStatus === 'connected';

  return (
    <div className="glass-card p-3 flex-shrink-0">
      <div className="flex items-center gap-3">
        {/* Robot Icon with Status */}
        <div className={`relative w-11 h-11 rounded-xl flex items-center justify-center ${statusDisplay.bg}`}>
          <Bot className={`w-5 h-5 ${statusDisplay.color}`} />
          {status === 'moving' && (
            <span className="absolute -right-0.5 -top-0.5 w-2 h-2 rounded-full bg-primary animate-pulse" />
          )}
        </div>
        
        {/* Robot Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">HomeBot</span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wide ${statusDisplay.bg} ${statusDisplay.color}`}>
              {statusDisplay.text}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span className="capitalize">{currentRoom?.replace('-', ' ') || 'Unknown'}</span>
            </span>
            {destinationRoom && (
              <span className="flex items-center gap-1 text-warning">
                <Navigation className="w-3 h-3" />
                <span className="capitalize">{destinationRoom.replace('-', ' ')}</span>
              </span>
            )}
          </div>
        </div>
        
        {/* Indicators */}
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1 text-xs">
            <Battery className={`w-3.5 h-3.5 ${batteryLevel > 20 ? 'text-success' : 'text-destructive'}`} />
            <span className="font-mono tabular-nums w-8 text-right">{batteryLevel}%</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <Signal className={`w-3.5 h-3.5 ${isConnected ? 'text-primary' : 'text-muted-foreground'}`} />
            <span className="font-mono tabular-nums w-8 text-right text-muted-foreground">{signalStrength}%</span>
          </div>
        </div>
      </div>
    </div>
  );
});
