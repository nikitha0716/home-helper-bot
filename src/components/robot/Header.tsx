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

/**
 * RESPONSIVE Header Component
 * 
 * Mobile: Compact layout with smaller icons
 * Tablet/Desktop: Full layout with text labels
 */
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
    <header className="glass-card border-b border-border/50 px-3 sm:px-4 py-2 sm:py-3 safe-area-top space-y-1.5 sm:space-y-2">
      {/* Top Row */}
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <motion.div 
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg gradient-primary flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
          </motion.div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="font-semibold text-sm sm:text-base">HomeBot</span>
            {isSimulation && (
              <motion.button
                onClick={onToggleSimulation}
                className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 rounded-full bg-warning/20 border border-warning/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <FlaskConical className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-warning" />
                <span className="text-[10px] sm:text-xs font-medium text-warning">SIM</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Status Icons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Bluetooth */}
          <motion.div 
            className="flex items-center gap-1"
            animate={bluetoothStatus === 'connecting' ? { opacity: [1, 0.5, 1] } : {}}
            transition={{ duration: 1, repeat: bluetoothStatus === 'connecting' ? Infinity : 0 }}
          >
            {bluetoothStatus === 'connected' ? (
              <Bluetooth className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
            ) : (
              <BluetoothOff className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
            )}
          </motion.div>

          {/* WiFi */}
          <motion.div 
            className="flex items-center gap-1"
            animate={wifiStatus === 'connecting' ? { opacity: [1, 0.5, 1] } : {}}
            transition={{ duration: 1, repeat: wifiStatus === 'connecting' ? Infinity : 0 }}
          >
            {wifiStatus === 'connected' ? (
              <Wifi className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
            ) : (
              <WifiOff className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
            )}
          </motion.div>

          {/* Battery */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            <Battery className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${batteryColor}`} />
            <span className="text-[10px] sm:text-xs font-mono">{batteryLevel}%</span>
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
