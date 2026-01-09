import { memo, useCallback } from 'react';
import { RobotState, RoomId, ControlDirection } from '@/types/robot';
import { AutoModeView } from './AutoModeView';
import { ManualModeView } from './ManualModeView';

interface LeftPanelProps {
  state: RobotState;
  onSelectRoom: (roomId: RoomId) => void;
  onControl: (direction: ControlDirection) => void;
  onSpeedChange: (speed: number) => void;
}

/**
 * LEFT PANEL - Movement & Navigation
 * 
 * Contains:
 * - Auto Mode: House map + destination selection + path visualization
 * - Manual Mode: Joystick + speed control
 * 
 * Only movement-related elements allowed here
 */
export const LeftPanel = memo(function LeftPanel({
  state,
  onSelectRoom,
  onControl,
  onSpeedChange,
}: LeftPanelProps) {
  const { mode, speed, isCharging } = state;
  const isAutoMode = mode === 'auto';

  const handleControl = useCallback((direction: ControlDirection) => {
    if (isCharging) return;
    onControl(direction);
  }, [onControl, isCharging]);

  const handleSpeedChange = useCallback((newSpeed: number) => {
    onSpeedChange(newSpeed);
  }, [onSpeedChange]);

  const handleSelectRoom = useCallback((roomId: RoomId) => {
    if (isCharging) return;
    onSelectRoom(roomId);
  }, [onSelectRoom, isCharging]);

  return (
    <div className="h-full flex flex-col rounded-xl border border-border/40 bg-secondary/20 overflow-hidden">
      {/* Panel Header */}
      <div className="flex-shrink-0 px-4 py-2.5 border-b border-border/30 bg-secondary/30">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {isAutoMode ? 'Navigation Control' : 'Manual Control'}
        </h2>
      </div>

      {/* Panel Content - No scrolling for controls */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {isAutoMode ? (
          <AutoModeView 
            state={state} 
            onSelectRoom={handleSelectRoom} 
          />
        ) : (
          <ManualModeView
            speed={speed}
            onControl={handleControl}
            onSpeedChange={handleSpeedChange}
            disabled={isCharging}
          />
        )}
      </div>
    </div>
  );
});
