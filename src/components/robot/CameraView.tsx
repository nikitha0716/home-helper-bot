import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  CameraOff, 
  Wifi, 
  WifiOff,
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight,
  Square,
  Hand,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { RobotState, ControlDirection, RobotMode } from '@/types/robot';
import { CameraHUD } from './CameraHUD';

interface CameraViewProps {
  state: RobotState;
  onConnectWifi: () => void;
  onDisconnectWifi: () => void;
  onControl: (direction: ControlDirection) => void;
  onSpeedChange: (speed: number) => void;
  onModeChange: (mode: RobotMode) => void;
  onEmergencyStop: () => void;
}

export function CameraView({
  state,
  onConnectWifi,
  onDisconnectWifi,
  onControl,
  onSpeedChange,
  onModeChange,
}: CameraViewProps) {
  const { wifiStatus, mode, speed, bluetoothStatus, status } = state;
  const isWifiConnected = wifiStatus === 'connected';
  const isBluetoothConnected = bluetoothStatus === 'connected';
  const isManualActive = mode === 'manual' && isBluetoothConnected;
  
  const [currentDirection, setCurrentDirection] = useState<ControlDirection>('stop');
  const [showControls, setShowControls] = useState(true);
  const [lastInteraction, setLastInteraction] = useState(Date.now());
  
  const obstacleDetected = status === 'obstacle_detected';

  // Auto-hide controls after inactivity
  useEffect(() => {
    if (!isWifiConnected) return;
    
    const timer = setInterval(() => {
      if (Date.now() - lastInteraction > 4000) {
        setShowControls(false);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [lastInteraction, isWifiConnected]);

  const handleInteraction = useCallback(() => {
    setShowControls(true);
    setLastInteraction(Date.now());
  }, []);

  const handleControl = useCallback((direction: ControlDirection) => {
    setCurrentDirection(direction);
    onControl(direction);
    handleInteraction();
  }, [onControl, handleInteraction]);

  return (
    <div className="flex flex-col h-full" onClick={handleInteraction}>
      {/* Camera Feed Area */}
      <div className="relative flex-1 bg-secondary/30 m-4 rounded-xl overflow-hidden min-h-[200px]">
        {isWifiConnected ? (
          <>
            {/* Simulated Camera Feed */}
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/50 to-background flex items-center justify-center">
              <div className="text-center space-y-2 opacity-50">
                <Camera className="w-10 h-10 mx-auto text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Live Camera Feed</p>
              </div>
            </div>
            
            {/* Subtle Scan Line */}
            <motion.div
              className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-50"
              animate={{ y: ['0%', '100vh'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            />

            {/* Minimal HUD Overlay */}
            <CameraHUD 
              state={state} 
              currentDirection={currentDirection}
              obstacleDetected={obstacleDetected}
            />

            {/* Disconnect Button - Always visible */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-12 right-2 z-10 opacity-70 hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                onDisconnectWifi();
              }}
            >
              <WifiOff className="w-4 h-4" />
            </Button>
          </>
        ) : (
          /* Camera Unavailable - Calm placeholder */
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 p-6">
            <div className="w-16 h-16 rounded-full bg-secondary/30 flex items-center justify-center">
              <CameraOff className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Camera Unavailable</p>
              <p className="text-xs text-muted-foreground/70">
                Bluetooth control active
              </p>
            </div>
            <Button 
              onClick={onConnectWifi} 
              variant="outline" 
              size="sm"
              className="gap-2 mt-2"
            >
              <Wifi className="w-4 h-4" />
              Connect Camera
            </Button>
          </div>
        )}
      </div>

      {/* Control Overlay - Fades in/out */}
      <AnimatePresence>
        {(showControls || !isWifiConnected) && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="p-4 space-y-4"
          >
            {/* Mode Indicator - Compact */}
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => onModeChange('auto')}
                disabled={!isBluetoothConnected}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                  mode === 'auto' 
                    ? 'bg-primary/20 text-primary border border-primary/30' 
                    : 'bg-secondary/50 text-muted-foreground'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span className="text-sm">Auto</span>
              </button>
              <button
                onClick={() => onModeChange('manual')}
                disabled={!isBluetoothConnected}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                  mode === 'manual' 
                    ? 'bg-warning/20 text-warning border border-warning/30' 
                    : 'bg-secondary/50 text-muted-foreground'
                }`}
              >
                <Hand className="w-4 h-4" />
                <span className="text-sm">Manual</span>
              </button>
            </div>

            {/* Direction Controls - Fixed positions, only color change on press */}
            <div className={`grid grid-cols-3 gap-2 max-w-xs mx-auto transition-opacity duration-200 ${
              !isManualActive ? 'opacity-40 pointer-events-none' : ''
            }`}>
              <div />
              <button
                className={`h-12 rounded-xl border-2 flex items-center justify-center transition-colors duration-100 ${
                  currentDirection === 'forward' 
                    ? 'bg-primary/30 border-primary text-primary' 
                    : 'bg-secondary/50 border-border/50 text-foreground hover:border-border'
                }`}
                onPointerDown={() => handleControl('forward')}
                onPointerUp={() => handleControl('stop')}
                onPointerLeave={() => handleControl('stop')}
                disabled={!isManualActive}
              >
                <ArrowUp className="w-5 h-5" />
              </button>
              <div />
              
              <button
                className={`h-12 rounded-xl border-2 flex items-center justify-center transition-colors duration-100 ${
                  currentDirection === 'left' 
                    ? 'bg-primary/30 border-primary text-primary' 
                    : 'bg-secondary/50 border-border/50 text-foreground hover:border-border'
                }`}
                onPointerDown={() => handleControl('left')}
                onPointerUp={() => handleControl('stop')}
                onPointerLeave={() => handleControl('stop')}
                disabled={!isManualActive}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                className={`h-12 rounded-xl border-2 flex items-center justify-center transition-colors duration-100 ${
                  currentDirection === 'stop' 
                    ? 'bg-secondary/80 border-border' 
                    : 'bg-secondary/50 border-border/50 text-foreground hover:border-border'
                }`}
                onClick={() => handleControl('stop')}
                disabled={!isBluetoothConnected}
              >
                <Square className="w-4 h-4" />
              </button>
              <button
                className={`h-12 rounded-xl border-2 flex items-center justify-center transition-colors duration-100 ${
                  currentDirection === 'right' 
                    ? 'bg-primary/30 border-primary text-primary' 
                    : 'bg-secondary/50 border-border/50 text-foreground hover:border-border'
                }`}
                onPointerDown={() => handleControl('right')}
                onPointerUp={() => handleControl('stop')}
                onPointerLeave={() => handleControl('stop')}
                disabled={!isManualActive}
              >
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <div />
              <button
                className={`h-12 rounded-xl border-2 flex items-center justify-center transition-colors duration-100 ${
                  currentDirection === 'backward' 
                    ? 'bg-primary/30 border-primary text-primary' 
                    : 'bg-secondary/50 border-border/50 text-foreground hover:border-border'
                }`}
                onPointerDown={() => handleControl('backward')}
                onPointerUp={() => handleControl('stop')}
                onPointerLeave={() => handleControl('stop')}
                disabled={!isManualActive}
              >
                <ArrowDown className="w-5 h-5" />
              </button>
              <div />
            </div>

            {/* Speed Control - Compact */}
            <div className={`glass-card p-3 space-y-2 transition-opacity duration-200 ${
              !isManualActive ? 'opacity-50' : ''
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Speed</span>
                <span className="text-xs font-mono tabular-nums">{speed}%</span>
              </div>
              <Slider
                value={[speed]}
                onValueChange={([val]) => {
                  onSpeedChange(val);
                  handleInteraction();
                }}
                max={100}
                min={10}
                step={10}
                disabled={!isManualActive}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
