import { memo, useState, useCallback, useRef, useEffect } from 'react';
import { Bot, Battery, BatteryCharging, Bluetooth, BluetoothOff, Zap, Hand, StopCircle } from 'lucide-react';
import { RobotState, RobotMode } from '@/types/robot';
import { Button } from '@/components/ui/button';

interface TopBarProps {
  state: RobotState;
  onModeChange: (mode: RobotMode) => void;
  onEmergencyStop: () => void;
}

/**
 * TOP BAR - Full width, always visible
 * Contains: Robot name, current mode, battery, bluetooth, Emergency STOP
 */
export const TopBar = memo(function TopBar({ 
  state, 
  onModeChange,
  onEmergencyStop 
}: TopBarProps) {
  const { mode, batteryLevel, isCharging, bluetoothStatus } = state;
  const isConnected = bluetoothStatus === 'connected';
  
  // Long-press handling for hard stop
  const [isPressed, setIsPressed] = useState(false);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const [holdProgress, setHoldProgress] = useState(0);

  const handlePressStart = useCallback(() => {
    setIsPressed(true);
    setHoldProgress(0);
    
    let progress = 0;
    pressTimer.current = setInterval(() => {
      progress += 5;
      setHoldProgress(progress);
      if (progress >= 100) {
        onEmergencyStop();
        if (pressTimer.current) clearInterval(pressTimer.current);
        setIsPressed(false);
        setHoldProgress(0);
      }
    }, 50);
  }, [onEmergencyStop]);

  const handlePressEnd = useCallback(() => {
    if (pressTimer.current) {
      clearInterval(pressTimer.current);
      pressTimer.current = null;
    }
    if (holdProgress < 100 && holdProgress > 0) {
      // Quick tap - still trigger stop
      onEmergencyStop();
    }
    setIsPressed(false);
    setHoldProgress(0);
  }, [holdProgress, onEmergencyStop]);

  useEffect(() => {
    return () => {
      if (pressTimer.current) clearInterval(pressTimer.current);
    };
  }, []);

  return (
    <div className="flex items-center justify-between gap-4 p-3 bg-secondary/40 border-b border-border/50">
      {/* Left: Robot Name + Mode */}
      <div className="flex items-center gap-4">
        {/* Robot Name */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Bot className="w-4 h-4 text-primary" />
          </div>
          <span className="font-semibold text-sm">HomeBot</span>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center bg-background/50 rounded-lg p-1 gap-1">
          <button
            onClick={() => onModeChange('auto')}
            disabled={isCharging}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              mode === 'auto'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            } ${isCharging ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Zap className="w-3.5 h-3.5" />
            Auto
          </button>
          <button
            onClick={() => onModeChange('manual')}
            disabled={isCharging}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              mode === 'manual'
                ? 'bg-warning text-warning-foreground'
                : 'text-muted-foreground hover:text-foreground'
            } ${isCharging ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Hand className="w-3.5 h-3.5" />
            Manual
          </button>
        </div>
      </div>

      {/* Right: Status + Emergency Stop */}
      <div className="flex items-center gap-4">
        {/* Battery */}
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${
          isCharging ? 'bg-warning/10' : batteryLevel <= 20 ? 'bg-destructive/10' : 'bg-secondary/50'
        }`}>
          {isCharging ? (
            <BatteryCharging className="w-4 h-4 text-warning" />
          ) : (
            <Battery className={`w-4 h-4 ${batteryLevel <= 20 ? 'text-destructive' : 'text-success'}`} />
          )}
          <span className={`text-xs font-mono ${isCharging ? 'text-warning' : ''}`}>
            {batteryLevel}%
          </span>
        </div>

        {/* Bluetooth Status */}
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${
          isConnected ? 'bg-primary/10' : 'bg-destructive/10'
        }`}>
          {isConnected ? (
            <Bluetooth className="w-4 h-4 text-primary" />
          ) : (
            <BluetoothOff className="w-4 h-4 text-destructive" />
          )}
          <span className={`text-xs ${isConnected ? 'text-primary' : 'text-destructive'}`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        {/* Emergency STOP Button - Fixed position in top bar */}
        <Button
          variant="destructive"
          size="sm"
          className="relative overflow-hidden font-bold tracking-wide px-4"
          onMouseDown={handlePressStart}
          onMouseUp={handlePressEnd}
          onMouseLeave={handlePressEnd}
          onTouchStart={handlePressStart}
          onTouchEnd={handlePressEnd}
        >
          {/* Hold progress indicator */}
          {isPressed && (
            <div 
              className="absolute inset-0 bg-destructive-foreground/20"
              style={{ width: `${holdProgress}%` }}
            />
          )}
          <StopCircle className="w-4 h-4 mr-1.5 relative z-10" />
          <span className="relative z-10">STOP</span>
        </Button>
      </div>
    </div>
  );
});
