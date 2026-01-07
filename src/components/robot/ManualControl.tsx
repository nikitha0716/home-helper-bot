import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Gauge, 
  Zap, 
  Hand,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { RobotState, ControlDirection, RobotMode } from '@/types/robot';

interface ManualControlProps {
  state: RobotState;
  onControl: (direction: ControlDirection) => void;
  onSpeedChange: (speed: number) => void;
  onModeChange: (mode: RobotMode) => void;
  onEmergencyStop: () => void;
}

export function ManualControl({
  state,
  onControl,
  onSpeedChange,
  onModeChange,
  onEmergencyStop,
}: ManualControlProps) {
  const { mode, speed, bluetoothStatus, isMoving } = state;
  const isConnected = bluetoothStatus === 'connected';
  
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const handleJoystickMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !isConnected || mode === 'auto') return;
    
    const rect = e.currentTarget.parentElement?.getBoundingClientRect();
    if (!rect) return;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const x = e.clientX - rect.left - centerX;
    const y = e.clientY - rect.top - centerY;
    
    // Clamp to circle
    const distance = Math.sqrt(x * x + y * y);
    const maxDistance = rect.width / 2 - 32;
    
    if (distance > maxDistance) {
      const angle = Math.atan2(y, x);
      setJoystickPos({
        x: Math.cos(angle) * maxDistance,
        y: Math.sin(angle) * maxDistance,
      });
    } else {
      setJoystickPos({ x, y });
    }

    // Determine direction
    const threshold = 20;
    if (Math.abs(y) > Math.abs(x)) {
      if (y < -threshold) onControl('forward');
      else if (y > threshold) onControl('backward');
    } else {
      if (x > threshold) onControl('right');
      else if (x < -threshold) onControl('left');
    }
  }, [isDragging, isConnected, mode, onControl]);

  const handleJoystickRelease = useCallback(() => {
    setIsDragging(false);
    setJoystickPos({ x: 0, y: 0 });
    onControl('stop');
  }, [onControl]);

  return (
    <div className="flex flex-col h-full p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-xl font-semibold">Manual Control</h1>
        <p className="text-sm text-muted-foreground">
          {isConnected ? 'Bluetooth control active' : 'Connect to enable controls'}
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2">
        <Button
          variant={mode === 'auto' ? 'default' : 'outline'}
          className="flex-1 py-6"
          onClick={() => onModeChange('auto')}
        >
          <Zap className="w-5 h-5 mr-2" />
          Auto Mode
        </Button>
        <Button
          variant={mode === 'manual' ? 'default' : 'outline'}
          className="flex-1 py-6"
          onClick={() => onModeChange('manual')}
        >
          <Hand className="w-5 h-5 mr-2" />
          Manual Mode
        </Button>
      </div>

      {/* Joystick */}
      <div className="flex-1 flex items-center justify-center">
        <div 
          className={`joystick-container ${!isConnected || mode === 'auto' ? 'opacity-50' : ''}`}
          onPointerMove={handleJoystickMove}
          onPointerUp={handleJoystickRelease}
          onPointerLeave={handleJoystickRelease}
        >
          {/* Crosshair */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-px h-full bg-border/30" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-full h-px bg-border/30" />
          </div>
          
          {/* Direction Labels */}
          <span className="absolute top-2 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">FWD</span>
          <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">REV</span>
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">L</span>
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">R</span>
          
          {/* Joystick Knob */}
          <motion.div
            className="joystick-knob"
            style={{
              x: joystickPos.x,
              y: joystickPos.y,
            }}
            onPointerDown={(e) => {
              if (isConnected && mode === 'manual') {
                setIsDragging(true);
                e.currentTarget.setPointerCapture(e.pointerId);
              }
            }}
            whileTap={{ scale: 0.95 }}
          />
        </div>
      </div>

      {/* Speed Control */}
      <div className="glass-card p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gauge className="w-5 h-5 text-primary" />
            <span className="font-medium">Speed Control</span>
          </div>
          <span className="text-lg font-mono text-primary">{speed}%</span>
        </div>
        
        <Slider
          value={[speed]}
          onValueChange={([val]) => onSpeedChange(val)}
          max={100}
          min={10}
          step={10}
          disabled={!isConnected}
        />
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Slow</span>
          <span>Fast</span>
        </div>
      </div>

      {/* Status Indicator */}
      {isMoving && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-3 flex items-center justify-center gap-2 border-warning/50"
        >
          <AlertTriangle className="w-4 h-4 text-warning" />
          <span className="text-sm text-warning">Robot is moving</span>
        </motion.div>
      )}

      {/* Emergency Stop */}
      <Button
        onClick={onEmergencyStop}
        className="w-full h-16 emergency-stop text-xl"
        disabled={!isConnected}
      >
        EMERGENCY STOP
      </Button>
    </div>
  );
}
