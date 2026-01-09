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

// MANUAL MODE: Large joystick, speed slider, NO map
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
      <div className="text-center py-2 mb-2">
        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${
          disabled 
            ? 'bg-muted/10 border border-muted/20'
            : 'bg-warning/10 border border-warning/20'
        }`}>
          <Hand className={`w-3.5 h-3.5 ${disabled ? 'text-muted-foreground' : 'text-warning'}`} />
          <span className={`text-xs font-medium ${disabled ? 'text-muted-foreground' : 'text-warning'}`}>
            {disabled ? 'Manual control disabled' : 'Direct manual control enabled'}
          </span>
        </span>
      </div>

      {/* Joystick - Centered, fixed position */}
      <div className="flex-1 flex items-center justify-center">
        <StableJoystick isActive={!disabled} onControl={onControl} />
      </div>

      {/* Speed Control - Fixed below joystick */}
      <div className="glass-card p-4 mx-2 mb-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Speed</span>
          </div>
          <span className="text-sm font-mono text-primary tabular-nums">{speed}%</span>
        </div>
        <Slider
          value={[speed]}
          onValueChange={handleSpeedChange}
          max={100}
          min={10}
          step={10}
          disabled={disabled}
        />
        <div className="flex justify-between text-[10px] text-muted-foreground/60 mt-1">
          <span>Slow</span>
          <span>Fast</span>
        </div>
      </div>
    </div>
  );
});
