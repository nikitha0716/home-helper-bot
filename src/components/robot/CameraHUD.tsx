import { motion } from 'framer-motion';
import { 
  Navigation2, 
  Gauge, 
  AlertTriangle, 
  Bluetooth, 
  Wifi,
  WifiOff,
  Compass
} from 'lucide-react';
import { RobotState, ControlDirection } from '@/types/robot';

interface CameraHUDProps {
  state: RobotState;
  currentDirection?: ControlDirection;
  obstacleDetected?: boolean;
}

const directionAngles: Record<ControlDirection, number> = {
  forward: 0,
  right: 90,
  backward: 180,
  left: 270,
  stop: 0,
};

export function CameraHUD({ state, currentDirection = 'stop', obstacleDetected = false }: CameraHUDProps) {
  const { speed, bluetoothStatus, wifiStatus, isMoving } = state;
  const isBluetoothConnected = bluetoothStatus === 'connected';
  const isWifiConnected = wifiStatus === 'connected';

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top HUD Bar */}
      <div className="absolute top-2 left-2 right-2 flex items-start justify-between">
        {/* Direction Indicator */}
        <motion.div 
          className="glass-card px-3 py-2 flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <motion.div
            animate={{ rotate: directionAngles[currentDirection] }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <Navigation2 className="w-5 h-5 text-primary" />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Direction</span>
            <span className="text-xs font-mono uppercase text-primary">
              {currentDirection === 'stop' ? 'HOLD' : currentDirection.toUpperCase()}
            </span>
          </div>
        </motion.div>

        {/* Connection Badges */}
        <motion.div 
          className="flex gap-1"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className={`glass-card px-2 py-1.5 flex items-center gap-1 ${isBluetoothConnected ? 'border-success/50' : 'border-destructive/50'}`}>
            <Bluetooth className={`w-3 h-3 ${isBluetoothConnected ? 'text-success' : 'text-destructive'}`} />
          </div>
          <div className={`glass-card px-2 py-1.5 flex items-center gap-1 ${isWifiConnected ? 'border-success/50' : 'border-muted'}`}>
            {isWifiConnected ? (
              <Wifi className="w-3 h-3 text-success" />
            ) : (
              <WifiOff className="w-3 h-3 text-muted-foreground" />
            )}
          </div>
        </motion.div>
      </div>

      {/* Bottom HUD Bar */}
      <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between">
        {/* Speed Gauge */}
        <motion.div 
          className="glass-card px-3 py-2 flex items-center gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Gauge className="w-5 h-5 text-primary" />
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Speed</span>
            <div className="flex items-center gap-1">
              <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${speed}%` }}
                  transition={{ type: 'spring', stiffness: 100 }}
                />
              </div>
              <span className="text-xs font-mono text-primary">{speed}%</span>
            </div>
          </div>
        </motion.div>

        {/* Status Indicators */}
        <div className="flex gap-2">
          {/* Moving Indicator */}
          {isMoving && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card px-3 py-2 border-warning/50"
            >
              <motion.div
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="flex items-center gap-2"
              >
                <Compass className="w-4 h-4 text-warning" />
                <span className="text-xs font-medium text-warning">MOVING</span>
              </motion.div>
            </motion.div>
          )}

          {/* Obstacle Alert */}
          {obstacleDetected && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
              }}
              className="glass-card px-3 py-2 border-destructive/50"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4 text-destructive" />
                <span className="text-xs font-medium text-destructive">OBSTACLE</span>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Center Crosshair */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          className="relative w-20 h-20"
        >
          <div className="absolute inset-0 border border-primary/30 rounded-full" />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-primary/30" />
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-primary/30" />
          <div className="absolute inset-4 border border-primary/20 rounded-full" />
        </motion.div>
      </div>

      {/* Corner Frames */}
      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-primary/30" />
      <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-primary/30" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-primary/30" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-primary/30" />
    </div>
  );
}
