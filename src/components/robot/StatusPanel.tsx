import { motion } from 'framer-motion';
import { 
  Battery, 
  Bluetooth, 
  Wifi, 
  Signal, 
  Bot,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Info,
  MapPin
} from 'lucide-react';
import { RobotState, StatusMessage } from '@/types/robot';
import { StatusIndicator } from './StatusIndicator';

interface StatusPanelProps {
  state: RobotState;
  messages: StatusMessage[];
}

const messageIcons = {
  info: <Info className="w-4 h-4 text-primary" />,
  success: <CheckCircle className="w-4 h-4 text-success" />,
  warning: <AlertTriangle className="w-4 h-4 text-warning" />,
  error: <AlertCircle className="w-4 h-4 text-destructive" />,
};

const statusLabels = {
  idle: { label: 'Ready', color: 'text-success' },
  moving: { label: 'Moving', color: 'text-warning' },
  obstacle_detected: { label: 'Obstacle!', color: 'text-destructive' },
  task_completed: { label: 'Complete', color: 'text-success' },
  charging: { label: 'Charging', color: 'text-primary' },
  error: { label: 'Error', color: 'text-destructive' },
};

export function StatusPanel({ state, messages }: StatusPanelProps) {
  const { 
    bluetoothStatus, 
    wifiStatus, 
    batteryLevel, 
    signalStrength, 
    status,
    currentRoom,
    mode 
  } = state;

  const batteryColor = 
    batteryLevel > 60 ? 'text-success' : 
    batteryLevel > 20 ? 'text-warning' : 
    'text-destructive';

  return (
    <div className="flex flex-col h-full p-4 space-y-4 overflow-hidden">
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-xl font-semibold">Robot Status</h1>
        <p className="text-sm text-muted-foreground">System monitoring & messages</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Bluetooth */}
        <div className="glass-card p-3 space-y-2">
          <div className="flex items-center gap-2">
            <Bluetooth className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Bluetooth</span>
          </div>
          <StatusIndicator status={bluetoothStatus} label={bluetoothStatus} />
        </div>

        {/* WiFi */}
        <div className="glass-card p-3 space-y-2">
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Camera</span>
          </div>
          <StatusIndicator status={wifiStatus} label={wifiStatus} />
        </div>

        {/* Battery */}
        <div className="glass-card p-3 space-y-2">
          <div className="flex items-center gap-2">
            <Battery className={`w-4 h-4 ${batteryColor}`} />
            <span className="text-xs text-muted-foreground">Battery</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${
                  batteryLevel > 60 ? 'bg-success' : 
                  batteryLevel > 20 ? 'bg-warning' : 
                  'bg-destructive'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${batteryLevel}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="text-xs font-mono">{batteryLevel}%</span>
          </div>
        </div>

        {/* Signal */}
        <div className="glass-card p-3 space-y-2">
          <div className="flex items-center gap-2">
            <Signal className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Signal</span>
          </div>
          <div className="flex items-center gap-1">
            {[20, 40, 60, 80, 100].map((threshold, i) => (
              <div
                key={i}
                className={`h-3 w-1.5 rounded-sm ${
                  signalStrength >= threshold ? 'bg-primary' : 'bg-secondary'
                }`}
                style={{ height: `${8 + i * 3}px` }}
              />
            ))}
            <span className="text-xs font-mono ml-2">{signalStrength}%</span>
          </div>
        </div>
      </div>

      {/* Robot Info Card */}
      <div className="glass-card p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <Bot className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium">HomeBot-001</h3>
            <p className="text-xs text-muted-foreground">Delivery Robot</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            statusLabels[status].color
          } bg-secondary`}>
            {statusLabels[status].label}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/50">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="text-sm font-medium capitalize">
                {currentRoom?.replace('-', ' ') || 'Unknown'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${mode === 'auto' ? 'bg-primary' : 'bg-warning'}`} />
            <div>
              <p className="text-xs text-muted-foreground">Mode</p>
              <p className="text-sm font-medium capitalize">{mode}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Log */}
      <div className="flex-1 glass-card p-4 overflow-hidden flex flex-col">
        <h3 className="font-medium mb-3">Activity Log</h3>
        <div className="flex-1 overflow-auto space-y-2">
          {messages.map((msg, index) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-2 p-2 rounded-lg bg-secondary/30"
            >
              {messageIcons[msg.type]}
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{msg.message}</p>
                <p className="text-xs text-muted-foreground font-mono">
                  {msg.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
