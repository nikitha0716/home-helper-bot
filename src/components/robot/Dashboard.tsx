import { useCallback } from 'react';
import { RobotState, RoomId, ControlDirection, RobotMode, StatusMessage } from '@/types/robot';
import { StatusBar } from './StatusBar';
import { ModeToggleBar } from './ModeToggleBar';
import { AutoModeView } from './AutoModeView';
import { ManualModeView } from './ManualModeView';
import { ActivityLog } from './ActivityLog';

interface DashboardProps {
  state: RobotState;
  messages: StatusMessage[];
  onSelectRoom: (roomId: RoomId) => void;
  onControl: (direction: ControlDirection) => void;
  onSpeedChange: (speed: number) => void;
  onModeChange: (mode: RobotMode) => void;
  onConnectWifi: () => void;
  onDisconnectWifi: () => void;
}

/**
 * DASHBOARD ARCHITECTURE:
 * 
 * ZONE 1: STATUS BAR (Fixed top)
 * - Robot name, state, battery, bluetooth indicator
 * - Always visible, never scrolls
 * 
 * ZONE 2: PRIMARY CONTROL (Mode-driven, fixed height)
 * - Only ONE control type visible at a time
 * - AUTO: House map for destination selection
 * - MANUAL: Joystick + speed slider
 * - Never scrolls, never re-mounts
 * 
 * ZONE 3: SECONDARY INFO (Bottom, may scroll internally)
 * - Activity log only
 * - Non-critical indicators
 */
export function Dashboard({
  state,
  messages,
  onSelectRoom,
  onControl,
  onSpeedChange,
  onModeChange,
}: DashboardProps) {
  const { mode, speed } = state;
  const isAutoMode = mode === 'auto';

  // Memoized handlers to prevent joystick re-renders
  const handleControl = useCallback((direction: ControlDirection) => {
    onControl(direction);
  }, [onControl]);

  const handleSpeedChange = useCallback((newSpeed: number) => {
    onSpeedChange(newSpeed);
  }, [onSpeedChange]);

  const handleModeChange = useCallback((newMode: RobotMode) => {
    onModeChange(newMode);
  }, [onModeChange]);

  const handleSelectRoom = useCallback((roomId: RoomId) => {
    onSelectRoom(roomId);
  }, [onSelectRoom]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ========== ZONE 1: STATUS BAR (Fixed) ========== */}
      <div className="flex-shrink-0 p-3 pb-0">
        <StatusBar state={state} />
      </div>

      {/* Mode Toggle */}
      <div className="flex-shrink-0 p-3">
        <ModeToggleBar mode={mode} onModeChange={handleModeChange} />
      </div>

      {/* ========== ZONE 2: PRIMARY CONTROL (Mode-Driven, Fixed) ========== */}
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
          />
        )}
      </div>

      {/* ========== ZONE 3: SECONDARY INFO (Fixed bottom) ========== */}
      <div className="flex-shrink-0 p-3 pt-0 pb-24">
        <ActivityLog messages={messages} maxItems={10} />
      </div>
    </div>
  );
}
