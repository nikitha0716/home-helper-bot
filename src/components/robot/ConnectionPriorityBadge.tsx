import { motion } from 'framer-motion';
import { Bluetooth, Wifi, Radio } from 'lucide-react';
import { ConnectionStatus } from '@/types/robot';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ConnectionPriorityBadgeProps {
  bluetoothStatus: ConnectionStatus;
  wifiStatus: ConnectionStatus;
}

export function ConnectionPriorityBadge({ 
  bluetoothStatus, 
  wifiStatus 
}: ConnectionPriorityBadgeProps) {
  const isBluetoothConnected = bluetoothStatus === 'connected';
  const isWifiConnected = wifiStatus === 'connected';

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card px-3 py-1.5 flex items-center gap-2"
          >
            <Radio className="w-3 h-3 text-primary animate-pulse" />
            <span className="text-xs font-medium">
              Control: <span className="text-primary">Bluetooth</span>
              <span className="text-muted-foreground"> (Primary)</span>
            </span>
            
            {/* Status dots */}
            <div className="flex items-center gap-1.5 ml-1 pl-2 border-l border-border/50">
              <div className="flex items-center gap-0.5">
                <Bluetooth className={`w-3 h-3 ${isBluetoothConnected ? 'text-primary' : 'text-muted-foreground'}`} />
                <div className={`w-1.5 h-1.5 rounded-full ${isBluetoothConnected ? 'bg-success' : 'bg-muted-foreground'}`} />
              </div>
              <div className="flex items-center gap-0.5">
                <Wifi className={`w-3 h-3 ${isWifiConnected ? 'text-primary' : 'text-muted-foreground'}`} />
                <div className={`w-1.5 h-1.5 rounded-full ${isWifiConnected ? 'bg-success' : 'bg-muted-foreground'}`} />
              </div>
            </div>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <div className="space-y-2 text-xs">
            <p className="font-medium">Connection Priority</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>• <span className="text-primary">Bluetooth</span>: Robot control, emergency stop (required)</li>
              <li>• <span className="text-primary">Wi-Fi</span>: Camera stream only (optional)</li>
            </ul>
            <p className="text-warning">Robot functions fully without Wi-Fi</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
