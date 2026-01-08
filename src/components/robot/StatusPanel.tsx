import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Battery, 
  Bluetooth, 
  Wifi, 
  Signal, 
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Info,
  MapPin,
  Bot,
  Hand,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { RobotState, StatusMessage } from '@/types/robot';
import { StatusIndicator } from './StatusIndicator';

interface StatusPanelProps {
  state: RobotState;
  messages: StatusMessage[];
}

const messageIcons: Record<string, React.ReactNode> = {
  info: <Info className="w-3.5 h-3.5 text-primary" />,
  success: <CheckCircle className="w-3.5 h-3.5 text-success" />,
  warning: <AlertTriangle className="w-3.5 h-3.5 text-warning" />,
  error: <AlertCircle className="w-3.5 h-3.5 text-destructive" />,
};

const messageDotColors: Record<string, string> = {
  info: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-destructive',
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

  const batteryBgColor = 
    batteryLevel > 60 ? 'bg-success' : 
    batteryLevel > 20 ? 'bg-warning' : 
    'bg-destructive';

  // Group consecutive similar messages
  const groupedMessages = useMemo(() => {
    const grouped: (StatusMessage & { count: number })[] = [];
    let lastMessage = '';
    
    messages.slice(0, 20).forEach((msg) => {
      if (msg.message === lastMessage && grouped.length > 0) {
        grouped[grouped.length - 1].count++;
      } else {
        grouped.push({ ...msg, count: 1 });
        lastMessage = msg.message;
      }
    });
    
    return grouped.slice(0, 15);
  }, [messages]);

  const getStatusLabel = () => {
    switch (status) {
      case 'idle': return { text: 'Robot is ready', color: 'text-success' };
      case 'moving': return { text: 'Navigating...', color: 'text-primary' };
      case 'obstacle_detected': return { text: 'Obstacle detected', color: 'text-warning' };
      case 'emergency_stop': return { text: 'Emergency stop', color: 'text-destructive' };
      case 'task_completed': return { text: 'Task completed', color: 'text-success' };
      default: return { text: 'Unknown', color: 'text-muted-foreground' };
    }
  };

  const statusLabel = getStatusLabel();

  return (
    <div className="flex flex-col h-full p-4 space-y-4 overflow-hidden">
      {/* Robot Status Card */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-4">
          {/* Robot Icon with Status */}
          <div className={`relative w-14 h-14 rounded-xl flex items-center justify-center ${
            status === 'moving' ? 'bg-primary/20' : 
            status === 'obstacle_detected' ? 'bg-warning/20' :
            status === 'emergency_stop' ? 'bg-destructive/20' :
            'bg-secondary'
          }`}>
            <Bot className={`w-7 h-7 ${
              status === 'moving' ? 'text-primary' : 
              status === 'obstacle_detected' ? 'text-warning' :
              status === 'emergency_stop' ? 'text-destructive' :
              'text-muted-foreground'
            }`} />
            {status === 'moving' && (
              <motion.div 
                className="absolute -right-1 -top-1 w-3 h-3 rounded-full bg-primary"
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold">HomeBot-001</h2>
              <div className={`px-2 py-0.5 rounded text-xs font-medium ${
                mode === 'manual' ? 'bg-warning/20 text-warning' : 'bg-primary/20 text-primary'
              }`}>
                {mode === 'manual' ? (
                  <span className="flex items-center gap-1">
                    <Hand className="w-3 h-3" /> Manual
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Auto
                  </span>
                )}
              </div>
            </div>
            <p className={`text-sm ${statusLabel.color}`}>{statusLabel.text}</p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Location:</span>
          <span className="text-sm font-medium capitalize">
            {currentRoom?.replace('-', ' ') || 'Unknown'}
          </span>
        </div>
      </div>

      {/* Connection Status Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card p-3">
          <div className="flex items-center justify-between mb-2">
            <Bluetooth className={`w-4 h-4 ${
              bluetoothStatus === 'connected' ? 'text-primary' : 'text-muted-foreground'
            }`} />
            <StatusIndicator status={bluetoothStatus} label={bluetoothStatus} />
          </div>
          <p className="text-xs text-muted-foreground">Bluetooth</p>
          <p className="text-sm font-medium capitalize">{bluetoothStatus}</p>
        </div>

        <div className="glass-card p-3">
          <div className="flex items-center justify-between mb-2">
            <Wifi className={`w-4 h-4 ${
              wifiStatus === 'connected' ? 'text-primary' : 'text-muted-foreground'
            }`} />
            <StatusIndicator status={wifiStatus} label={wifiStatus} />
          </div>
          <p className="text-xs text-muted-foreground">Camera</p>
          <p className="text-sm font-medium capitalize">{wifiStatus}</p>
        </div>

        <div className="glass-card p-3">
          <div className="flex items-center justify-between mb-2">
            <Battery className={`w-4 h-4 ${batteryColor}`} />
            <span className="text-xs font-mono tabular-nums">{batteryLevel}%</span>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${batteryBgColor}`}
              initial={{ width: 0 }}
              animate={{ width: `${batteryLevel}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div className="glass-card p-3">
          <div className="flex items-center justify-between mb-2">
            <Signal className="w-4 h-4 text-primary" />
            <span className="text-xs font-mono tabular-nums">{signalStrength}%</span>
          </div>
          <div className="flex items-center gap-0.5">
            {[20, 40, 60, 80, 100].map((threshold, i) => (
              <div
                key={i}
                className={`w-1.5 rounded-sm ${
                  signalStrength >= threshold ? 'bg-primary' : 'bg-secondary'
                }`}
                style={{ height: `${6 + i * 2}px` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Activity Timeline - Clean and minimal */}
      <div className="flex-1 glass-card p-4 overflow-hidden flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium">Activity</h3>
          <span className="text-xs text-muted-foreground">{messages.length} events</span>
        </div>
        
        <div className="flex-1 overflow-auto space-y-1 min-h-0">
          {groupedMessages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center">
              <p className="text-sm text-muted-foreground/70">No activity yet</p>
            </div>
          ) : (
            groupedMessages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
                className="flex items-center gap-2 py-2 px-2 rounded-lg hover:bg-secondary/30 transition-colors"
              >
                <div className={`w-1.5 h-1.5 rounded-full ${messageDotColors[msg.type]}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{msg.message}</p>
                </div>
                {msg.count > 1 && (
                  <span className="text-xs text-muted-foreground bg-secondary/50 px-1.5 py-0.5 rounded">
                    ×{msg.count}
                  </span>
                )}
                <span className="text-xs text-muted-foreground font-mono tabular-nums">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
