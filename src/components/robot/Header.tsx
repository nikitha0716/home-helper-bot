import { motion } from 'framer-motion';
import { Battery, Bluetooth, BluetoothOff, Wifi, WifiOff, Bot, FlaskConical } from 'lucide-react';
import { ConnectionStatus } from '@/types/robot';
import { ConnectionPriorityBadge } from './ConnectionPriorityBadge';

interface HeaderProps {
  bluetoothStatus: ConnectionStatus;
  wifiStatus: ConnectionStatus;
  batteryLevel: number;
  isSimulation?: boolean;
  onToggleSimulation?: () => void;
}

export function Header({ 
  bluetoothStatus, 
  wifiStatus, 
  batteryLevel,
  isSimulation = true,
  onToggleSimulation 
}: HeaderProps) {
  const batteryColor = 
    batteryLevel > 60 ? 'text-success' : 
    batteryLevel > 20 ? 'text-warning' : 
    'text-destructive';

  return (
    <header className="glass-card border-b border-border/50 px-4 py-3 safe-area-top space-y-2">
      {/* Top Row */}
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <motion.div 
            className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bot className="w-5 h-5 text-primary-foreground" />
          </motion.div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">HomeBot</span>
            {isSimulation && (
              <motion.button
                onClick={onToggleSimulation}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-warning/20 border border-warning/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <FlaskConical className="w-3 h-3 text-warning" />
                <span className="text-xs font-medium text-warning">SIM</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Status Icons */}
        <div className="flex items-center gap-3">
          {/* Bluetooth */}
          <motion.div 
            className="flex items-center gap-1"
            animate={bluetoothStatus === 'connecting' ? { opacity: [1, 0.5, 1] } : {}}
            transition={{ duration: 1, repeat: bluetoothStatus === 'connecting' ? Infinity : 0 }}
          >
            {bluetoothStatus === 'connected' ? (
              <Bluetooth className="w-4 h-4 text-primary" />
            ) : (
              <BluetoothOff className="w-4 h-4 text-muted-foreground" />
            )}
          </motion.div>

          {/* WiFi */}
          <motion.div 
            className="flex items-center gap-1"
            animate={wifiStatus === 'connecting' ? { opacity: [1, 0.5, 1] } : {}}
            transition={{ duration: 1, repeat: wifiStatus === 'connecting' ? Infinity : 0 }}
          >
            {wifiStatus === 'connected' ? (
              <Wifi className="w-4 h-4 text-primary" />
            ) : (
              <WifiOff className="w-4 h-4 text-muted-foreground" />
            )}
          </motion.div>

          {/* Battery */}
          <div className="flex items-center gap-1">
            <Battery className={`w-4 h-4 ${batteryColor}`} />
            <span className="text-xs font-mono">{batteryLevel}%</span>
          </div>
        </div>
      </div>

      {/* Connection Priority Badge */}
      <div className="flex justify-center">
        <ConnectionPriorityBadge 
          bluetoothStatus={bluetoothStatus} 
          wifiStatus={wifiStatus} 
        />
      </div>
    </header>
  );
}
