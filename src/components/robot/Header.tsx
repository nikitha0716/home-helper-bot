import { Battery, Bluetooth, BluetoothOff, Wifi, WifiOff, Bot } from 'lucide-react';
import { ConnectionStatus } from '@/types/robot';

interface HeaderProps {
  bluetoothStatus: ConnectionStatus;
  wifiStatus: ConnectionStatus;
  batteryLevel: number;
}

export function Header({ bluetoothStatus, wifiStatus, batteryLevel }: HeaderProps) {
  const batteryColor = 
    batteryLevel > 60 ? 'text-success' : 
    batteryLevel > 20 ? 'text-warning' : 
    'text-destructive';

  return (
    <header className="glass-card border-b border-border/50 px-4 py-3 safe-area-top">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-semibold">HomeBot</span>
        </div>

        {/* Status Icons */}
        <div className="flex items-center gap-3">
          {/* Bluetooth */}
          <div className="flex items-center gap-1">
            {bluetoothStatus === 'connected' ? (
              <Bluetooth className="w-4 h-4 text-primary" />
            ) : (
              <BluetoothOff className="w-4 h-4 text-muted-foreground" />
            )}
          </div>

          {/* WiFi */}
          <div className="flex items-center gap-1">
            {wifiStatus === 'connected' ? (
              <Wifi className="w-4 h-4 text-primary" />
            ) : (
              <WifiOff className="w-4 h-4 text-muted-foreground" />
            )}
          </div>

          {/* Battery */}
          <div className="flex items-center gap-1">
            <Battery className={`w-4 h-4 ${batteryColor}`} />
            <span className="text-xs font-mono">{batteryLevel}%</span>
          </div>
        </div>
      </div>
    </header>
  );
}
