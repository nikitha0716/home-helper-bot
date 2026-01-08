import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Gauge, Hand, Zap } from 'lucide-react';
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
}: ManualControlProps) {
  const { mode, speed, bluetoothStatus, status } = state;
  const isConnected = bluetoothStatus === 'connected';
  const isManualActive = mode === 'manual' && isConnected;
  
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const handleJoystickMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !isManualActive) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const x = e.clientX - rect.left - centerX;
    const y = e.clientY - rect.top - centerY;
    
    // Clamp to circle
    const distance = Math.sqrt(x * x + y * y);
    const maxDistance = 52; // Fixed max distance for inner knob
    
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
  }, [isDragging, isManualActive, onControl]);

  const handleJoystickRelease = useCallback(() => {
    setIsDragging(false);
    setJoystickPos({ x: 0, y: 0 });
    onControl('stop');
  }, [onControl]);

  // Empty/feedback states
  if (!isConnected) {
    return (
      <div className="flex flex-col h-full p-4 items-center justify-center">
        <div className="text-center space-y-4 max-w-xs">
          <div className="w-20 h-20 mx-auto rounded-full bg-secondary/50 flex items-center justify-center">
            <Hand className="w-10 h-10 text-muted-foreground/50" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-medium text-muted-foreground">Connect to Control</h2>
            <p className="text-sm text-muted-foreground/70">
              Connect to your robot via Bluetooth to enable manual control
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-4 space-y-4">
      {/* Mode Status Bar */}
      <div className="glass-card p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-200 ${
              mode === 'manual' ? 'bg-warning/20' : 'bg-primary/20'
            }`}>
              {mode === 'manual' ? (
                <Hand className="w-5 h-5 text-warning" />
              ) : (
                <Zap className="w-5 h-5 text-primary" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium">
                {mode === 'manual' ? 'Direct Control Enabled' : 'Automatic Navigation'}
              </p>
              <p className="text-xs text-muted-foreground">
                {mode === 'manual' 
                  ? 'Use joystick to control movement' 
                  : 'Robot navigates autonomously'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mode Toggle Buttons - Fixed, no animation on position */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onModeChange('auto')}
          className={`p-4 rounded-xl border-2 transition-colors duration-200 ${
            mode === 'auto' 
              ? 'bg-primary/20 border-primary text-primary' 
              : 'bg-secondary/50 border-border/50 text-muted-foreground hover:border-border'
          }`}
        >
          <div className="flex flex-col items-center gap-2">
            <Zap className="w-6 h-6" />
            <span className="text-sm font-medium">Auto Mode</span>
          </div>
        </button>
        <button
          onClick={() => onModeChange('manual')}
          className={`p-4 rounded-xl border-2 transition-colors duration-200 ${
            mode === 'manual' 
              ? 'bg-warning/20 border-warning text-warning' 
              : 'bg-secondary/50 border-border/50 text-muted-foreground hover:border-border'
          }`}
        >
          <div className="flex flex-col items-center gap-2">
            <Hand className="w-6 h-6" />
            <span className="text-sm font-medium">Manual Mode</span>
          </div>
        </button>
      </div>

      {/* Joystick Container - Fixed outer, only inner moves */}
      <div className="flex-1 flex items-center justify-center">
        <div 
          className={`relative transition-opacity duration-200 ${
            !isManualActive ? 'opacity-40 pointer-events-none' : ''
          }`}
        >
          {/* Fixed Outer Ring */}
          <div 
            className="w-44 h-44 rounded-full bg-secondary/50 border-2 border-border/50 relative"
            onPointerMove={handleJoystickMove}
            onPointerUp={handleJoystickRelease}
            onPointerLeave={handleJoystickRelease}
          >
            {/* Fixed Crosshair */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-px h-full bg-border/30" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-full h-px bg-border/30" />
            </div>
            
            {/* Fixed Direction Labels */}
            <span className="absolute top-3 left-1/2 -translate-x-1/2 text-xs text-muted-foreground font-medium">FWD</span>
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-muted-foreground font-medium">REV</span>
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">L</span>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">R</span>
            
            {/* Inner Knob - Only this moves */}
            <motion.div
              className={`absolute w-16 h-16 rounded-full top-1/2 left-1/2 cursor-pointer transition-colors duration-150 ${
                isDragging 
                  ? 'bg-primary shadow-lg' 
                  : 'bg-gradient-to-br from-primary to-primary/80'
              }`}
              style={{
                x: joystickPos.x - 32,
                y: joystickPos.y - 32,
                boxShadow: isDragging 
                  ? '0 0 20px hsl(var(--primary) / 0.5)' 
                  : '0 0 10px hsl(var(--primary) / 0.3)'
              }}
              onPointerDown={(e) => {
                if (isManualActive) {
                  setIsDragging(true);
                  e.currentTarget.setPointerCapture(e.pointerId);
                }
              }}
            />
          </div>

          {/* Mode overlay when auto */}
          {mode === 'auto' && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-full">
              <p className="text-xs text-muted-foreground text-center px-4">
                Switch to Manual Mode to use joystick
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Speed Control - Fixed layout */}
      <div className={`glass-card p-4 space-y-3 transition-opacity duration-200 ${
        !isManualActive ? 'opacity-50' : ''
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gauge className="w-5 h-5 text-primary" />
            <span className="font-medium">Speed Control</span>
          </div>
          <span className="text-lg font-mono text-primary tabular-nums">{speed}%</span>
        </div>
        
        <Slider
          value={[speed]}
          onValueChange={([val]) => onSpeedChange(val)}
          max={100}
          min={10}
          step={10}
          disabled={!isManualActive}
        />
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Slow</span>
          <span>Fast</span>
        </div>
      </div>

      {/* Status Label - Non-intrusive */}
      <div className="text-center py-2">
        <p className="text-xs text-muted-foreground">
          {status === 'idle' && 'Robot is ready'}
          {status === 'moving' && 'Robot is moving'}
          {status === 'obstacle_detected' && (
            <span className="text-warning">Obstacle detected</span>
          )}
          {status === 'emergency_stop' && (
            <span className="text-destructive">Emergency stop activated</span>
          )}
          {status === 'task_completed' && (
            <span className="text-success">Task completed</span>
          )}
        </p>
      </div>

      {/* Spacer for floating button */}
      <div className="h-2" />
    </div>
  );
}
