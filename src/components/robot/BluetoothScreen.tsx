import { motion } from 'framer-motion';
import { Bluetooth, BluetoothConnected, BluetoothOff, RefreshCw, Signal, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusIndicator } from './StatusIndicator';
import { BluetoothDevice, ConnectionStatus } from '@/types/robot';

interface BluetoothScreenProps {
  status: ConnectionStatus;
  devices: BluetoothDevice[];
  isScanning: boolean;
  onScan: () => void;
  onConnect: (deviceId: string) => void;
  onDisconnect: () => void;
}

export function BluetoothScreen({
  status,
  devices,
  isScanning,
  onScan,
  onConnect,
  onDisconnect,
}: BluetoothScreenProps) {
  return (
    <div className="flex flex-col h-full p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 mx-auto rounded-full bg-secondary/50 flex items-center justify-center"
        >
          {status === 'connected' ? (
            <BluetoothConnected className="w-10 h-10 text-primary" />
          ) : status === 'connecting' ? (
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
              <Bluetooth className="w-10 h-10 text-warning" />
            </motion.div>
          ) : (
            <BluetoothOff className="w-10 h-10 text-muted-foreground" />
          )}
        </motion.div>
        <h1 className="text-xl font-semibold">Bluetooth Connection</h1>
        <StatusIndicator status={status} label={status} />
      </div>

      {/* Scan Button */}
      <Button
        onClick={onScan}
        disabled={isScanning || status === 'connected'}
        variant="outline"
        className="w-full py-6 gap-2"
      >
        <RefreshCw className={`w-5 h-5 ${isScanning ? 'animate-spin' : ''}`} />
        {isScanning ? 'Scanning...' : 'Scan for Devices'}
      </Button>

      {/* Device List */}
      <div className="flex-1 space-y-3 overflow-auto">
        <h2 className="text-sm font-medium text-muted-foreground">Available Devices</h2>
        
        {devices.length === 0 && !isScanning && (
          <div className="text-center py-8 text-muted-foreground">
            <Bluetooth className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No devices found</p>
            <p className="text-xs">Tap scan to search for nearby devices</p>
          </div>
        )}

        {devices.map((device, index) => (
          <motion.div
            key={device.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`glass-card p-4 flex items-center justify-between ${
              device.isRobot ? 'border-primary/30' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                device.isRobot ? 'bg-primary/20' : 'bg-secondary'
              }`}>
                {device.isRobot ? (
                  <Bot className="w-5 h-5 text-primary" />
                ) : (
                  <Bluetooth className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="font-medium">{device.name}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Signal className="w-3 h-3" />
                  <span>{Math.abs(device.rssi)} dBm</span>
                  {device.isRobot && (
                    <span className="text-primary font-medium">• Robot</span>
                  )}
                </div>
              </div>
            </div>
            
            {device.isRobot && (
              <Button
                size="sm"
                onClick={() => 
                  status === 'connected' ? onDisconnect() : onConnect(device.id)
                }
                variant={status === 'connected' ? 'destructive' : 'default'}
              >
                {status === 'connected' ? 'Disconnect' : 'Connect'}
              </Button>
            )}
          </motion.div>
        ))}
      </div>

      {/* Connection Tips */}
      <div className="glass-card p-4 space-y-2">
        <h3 className="text-sm font-medium">Connection Tips</h3>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Ensure the robot is powered on</li>
          <li>• Stay within 10 meters of the robot</li>
          <li>• Bluetooth is required for all robot controls</li>
        </ul>
      </div>
    </div>
  );
}
