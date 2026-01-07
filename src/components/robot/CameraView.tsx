import { motion } from 'framer-motion';
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
  Gauge,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { RobotState, ControlDirection, RobotMode } from '@/types/robot';

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
  onEmergencyStop,
}: CameraViewProps) {
  const { wifiStatus, mode, speed, bluetoothStatus } = state;
  const isWifiConnected = wifiStatus === 'connected';
  const isBluetoothConnected = bluetoothStatus === 'connected';

  return (
    <div className="flex flex-col h-full">
      {/* Camera Feed Area */}
      <div className="relative flex-1 bg-secondary/30 m-4 rounded-xl overflow-hidden">
        {isWifiConnected ? (
          <>
            {/* Simulated Camera Feed */}
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/50 to-background flex items-center justify-center">
              <motion.div
                className="text-center space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Camera className="w-12 h-12 mx-auto text-primary animate-pulse" />
                <p className="text-sm text-muted-foreground">Live Camera Feed</p>
                <p className="text-xs text-muted-foreground/70">Simulated stream</p>
              </motion.div>
            </div>
            
            {/* Scan Line Effect */}
            <motion.div
              className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
              animate={{ y: ['0%', '100vh'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />

            {/* Disconnect Button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2"
              onClick={onDisconnectWifi}
            >
              <WifiOff className="w-4 h-4" />
            </Button>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 p-6">
            <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center">
              <CameraOff className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="text-center space-y-1">
              <p className="font-medium">Camera Unavailable</p>
              <p className="text-sm text-muted-foreground">
                Bluetooth control active
              </p>
            </div>
            <Button onClick={onConnectWifi} variant="outline" className="gap-2">
              <Wifi className="w-4 h-4" />
              Connect Camera
            </Button>
          </div>
        )}

        {/* Mode Indicator */}
        <div className="absolute top-2 left-2 glass-card px-3 py-1.5 flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${mode === 'auto' ? 'bg-primary' : 'bg-warning'}`} />
          <span className="text-xs font-medium uppercase">{mode}</span>
        </div>
      </div>

      {/* Control Overlay */}
      <div className="p-4 space-y-4">
        {/* Mode Toggle */}
        <div className="flex gap-2">
          <Button
            variant={mode === 'auto' ? 'default' : 'outline'}
            className="flex-1"
            onClick={() => onModeChange('auto')}
          >
            <Zap className="w-4 h-4 mr-2" />
            Auto
          </Button>
          <Button
            variant={mode === 'manual' ? 'default' : 'outline'}
            className="flex-1"
            onClick={() => onModeChange('manual')}
          >
            <Gauge className="w-4 h-4 mr-2" />
            Manual
          </Button>
        </div>

        {/* Direction Controls */}
        <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
          <div />
          <Button
            variant="outline"
            className="h-14 control-button"
            onPointerDown={() => onControl('forward')}
            onPointerUp={() => onControl('stop')}
            onPointerLeave={() => onControl('stop')}
            disabled={!isBluetoothConnected || mode === 'auto'}
          >
            <ArrowUp className="w-6 h-6" />
          </Button>
          <div />
          
          <Button
            variant="outline"
            className="h-14 control-button"
            onPointerDown={() => onControl('left')}
            onPointerUp={() => onControl('stop')}
            onPointerLeave={() => onControl('stop')}
            disabled={!isBluetoothConnected || mode === 'auto'}
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <Button
            variant="outline"
            className="h-14 control-button"
            onClick={() => onControl('stop')}
            disabled={!isBluetoothConnected}
          >
            <Square className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            className="h-14 control-button"
            onPointerDown={() => onControl('right')}
            onPointerUp={() => onControl('stop')}
            onPointerLeave={() => onControl('stop')}
            disabled={!isBluetoothConnected || mode === 'auto'}
          >
            <ArrowRight className="w-6 h-6" />
          </Button>
          
          <div />
          <Button
            variant="outline"
            className="h-14 control-button"
            onPointerDown={() => onControl('backward')}
            onPointerUp={() => onControl('stop')}
            onPointerLeave={() => onControl('stop')}
            disabled={!isBluetoothConnected || mode === 'auto'}
          >
            <ArrowDown className="w-6 h-6" />
          </Button>
          <div />
        </div>

        {/* Speed Control */}
        <div className="glass-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Speed</span>
            <span className="text-sm font-mono">{speed}%</span>
          </div>
          <Slider
            value={[speed]}
            onValueChange={([val]) => onSpeedChange(val)}
            max={100}
            min={10}
            step={10}
            disabled={!isBluetoothConnected}
          />
        </div>

        {/* Emergency Stop */}
        <Button
          onClick={onEmergencyStop}
          className="w-full h-14 emergency-stop text-lg"
          disabled={!isBluetoothConnected}
        >
          EMERGENCY STOP
        </Button>
      </div>
    </div>
  );
}
