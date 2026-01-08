import { motion } from 'framer-motion';
import { Bluetooth, BluetoothConnected, BluetoothOff, RefreshCw, Signal, Bot, CheckCircle } from 'lucide-react';
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
  const isConnected = status === 'connected';
  const isConnecting = status === 'connecting';

  return (
    <div className="flex flex-col h-full p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <div 
          className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center transition-colors duration-300 ${
            isConnected ? 'bg-primary/20' : 
            isConnecting ? 'bg-warning/20' : 
            'bg-secondary/50'
          }`}
        >
          {isConnected ? (
            <BluetoothConnected className="w-10 h-10 text-primary" />
          ) : isConnecting ? (
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
              <Bluetooth className="w-10 h-10 text-warning" />
            </motion.div>
          ) : (
            <BluetoothOff className="w-10 h-10 text-muted-foreground" />
          )}
        </div>
        
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">Bluetooth Connection</h1>
          <StatusIndicator status={status} label={status} />
        </div>

        {/* Connected State Message */}
        {isConnected && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 text-success"
          >
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm">Robot connected and ready</span>
          </motion.div>
        )}

        {/* Disconnected State Message */}
        {status === 'disconnected' && devices.length === 0 && !isScanning && (
          <p className="text-sm text-muted-foreground">
            Connect to your robot to begin
          </p>
        )}
      </div>

      {/* Scan Button */}
      <Button
        onClick={onScan}
        disabled={isScanning || isConnected}
        variant={isConnected ? 'outline' : 'default'}
        className="w-full py-6 gap-2"
      >
        <RefreshCw className={`w-5 h-5 ${isScanning ? 'animate-spin' : ''}`} />
        {isScanning ? 'Scanning...' : isConnected ? 'Connected' : 'Scan for Devices'}
      </Button>

      {/* Device List */}
      <div className="flex-1 space-y-3 overflow-auto">
        <h2 className="text-sm font-medium text-muted-foreground">
          {isConnected ? 'Connected Device' : 'Available Devices'}
        </h2>
        
        {devices.length === 0 && !isScanning && !isConnected && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto rounded-full bg-secondary/30 flex items-center justify-center mb-4">
              <Bluetooth className="w-8 h-8 text-muted-foreground/30" />
            </div>
            <p className="text-sm text-muted-foreground">No devices found</p>
            <p className="text-xs text-muted-foreground/70 mt-1">Tap scan to search for nearby devices</p>
          </div>
        )}

        {isScanning && devices.length === 0 && (
          <div className="text-center py-12">
            <motion.div 
              className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Bluetooth className="w-8 h-8 text-primary" />
            </motion.div>
            <p className="text-sm text-muted-foreground">Searching for devices...</p>
          </div>
        )}

        {devices.map((device, index) => (
          <motion.div
            key={device.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`glass-card p-4 flex items-center justify-between transition-colors ${
              device.isRobot && isConnected ? 'border-primary/50' : 
              device.isRobot ? 'border-primary/20' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                device.isRobot 
                  ? isConnected ? 'bg-primary/30' : 'bg-primary/20' 
                  : 'bg-secondary'
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
                onClick={() => isConnected ? onDisconnect() : onConnect(device.id)}
                variant={isConnected ? 'outline' : 'default'}
                className={isConnected ? 'border-destructive/50 text-destructive hover:bg-destructive/10' : ''}
              >
                {isConnected ? 'Disconnect' : 'Connect'}
              </Button>
            )}
          </motion.div>
        ))}
      </div>

      {/* Connection Tips */}
      <div className="glass-card p-4 space-y-2">
        <h3 className="text-sm font-medium">Tips</h3>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Ensure the robot is powered on</li>
          <li>• Stay within 10 meters of the robot</li>
          <li>• Bluetooth is required for all controls</li>
        </ul>
      </div>
    </div>
  );
}
