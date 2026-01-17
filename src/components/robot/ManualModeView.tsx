import { memo, useCallback } from 'react';
import { Hand, Gauge } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { StableJoystick } from './StableJoystick';
import { ControlDirection } from '@/types/robot';

interface ManualModeViewProps {
  speed: number;
  onControl: (direction: ControlDirection) => void;
  onSpeedChange: (speed: number) => void;
  disabled?: boolean;
}

/**
 * RESPONSIVE MANUAL MODE VIEW
 * 
 * Mobile: Compact layout with proportionally sized joystick
 * Tablet/Desktop: Full-size joystick and controls
 */
export const ManualModeView = memo(function ManualModeView({
  speed,
  onControl,
  onSpeedChange,
  disabled = false,
}: ManualModeViewProps) {
  const handleSpeedChange = useCallback((values: number[]) => {
    onSpeedChange(values[0]);
  }, [onSpeedChange]);

  return (
    <div className={`flex flex-col h-full ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      {/* Mode Label */}
      <div className="text-center py-1.5 sm:py-2 mb-1 sm:mb-2">
        <span className={`inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full ${
          disabled 
            ? 'bg-muted/10 border border-muted/20'
            : 'bg-warning/10 border border-warning/20'
        }`}>
          <Hand className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${disabled ? 'text-muted-foreground' : 'text-warning'}`} />
          <span className={`text-[10px] sm:text-xs font-medium ${disabled ? 'text-muted-foreground' : 'text-warning'}`}>
            {disabled ? 'Control disabled' : 'Manual control'}
          </span>
        </span>
      </div>

      {/* Joystick - Centered, fixed position, proportional sizing */}
      <div className="flex-1 flex items-center justify-center min-h-0">
        <StableJoystick isActive={!disabled} onControl={onControl} />
      </div>

      {/* Speed Control - Fixed below joystick */}
      <div className="glass-card p-2.5 sm:p-4 mx-2 mb-2 flex-shrink-0">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Gauge className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
            <span className="text-xs sm:text-sm font-medium">Speed</span>
          </div>
          <span className="text-xs sm:text-sm font-mono text-primary tabular-nums">{speed}%</span>
        </div>
        <Slider
          value={[speed]}
          onValueChange={handleSpeedChange}
          max={100}
          min={10}
          step={10}
          disabled={disabled}
          className="touch-none"
        />
        <div className="flex justify-between text-[8px] sm:text-[10px] text-muted-foreground/60 mt-1">
          <span>Slow</span>
          <span>Fast</span>
        </div>
      </div>
    </div>
  );
});
