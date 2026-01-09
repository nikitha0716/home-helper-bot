import { useCallback } from 'react';
import { RobotState, RoomId, ControlDirection, RobotMode, StatusMessage } from '@/types/robot';
import { StatusBar } from './StatusBar';
import { ModeToggleBar } from './ModeToggleBar';
import { AutoModeView } from './AutoModeView';
import { ManualModeView } from './ManualModeView';
import { ActivityLog } from './ActivityLog';
import { RobotDisplayPanel } from './RobotDisplayPanel';
import { MessageInput } from './MessageInput';
import { WeightIndicator } from './WeightIndicator';

interface DashboardProps {
  state: RobotState;
  messages: StatusMessage[];
  onSelectRoom: (roomId: RoomId) => void;
  onControl: (direction: ControlDirection) => void;
  onSpeedChange: (speed: number) => void;
  onModeChange: (mode: RobotMode) => void;
  onConnectWifi: () => void;
  onDisconnectWifi: () => void;
  onSendMessage: (message: string) => void;
}

/**
 * DASHBOARD ARCHITECTURE:
 * 
 * ZONE 1: STATUS BAR (Fixed top)
 * - Robot name, state, battery, bluetooth indicator, weight
 * - Always visible, never scrolls
 * 
 * ZONE 2: PRIMARY CONTROL (Mode-driven, fixed height)
 * - Only ONE control type visible at a time
 * - AUTO: House map for destination selection with path display
 * - MANUAL: Joystick + speed slider
 * - Never scrolls, never re-mounts
 * 
 * ZONE 3: ROBOT DISPLAY & MESSAGING
 * - Robot Display Panel (mirrors physical robot screen)
 * - Message Input (send messages to robot)
 * 
 * ZONE 4: SECONDARY INFO (Bottom, may scroll internally)
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
  onSendMessage,
}: DashboardProps) {
  const { mode, speed, isCharging, loadWeight, maxLoadWeight } = state;
  const isAutoMode = mode === 'auto';

  // Memoized handlers to prevent joystick re-renders
  const handleControl = useCallback((direction: ControlDirection) => {
    if (isCharging) return; // Disable controls when charging
    onControl(direction);
  }, [onControl, isCharging]);

  const handleSpeedChange = useCallback((newSpeed: number) => {
    onSpeedChange(newSpeed);
  }, [onSpeedChange]);

  const handleModeChange = useCallback((newMode: RobotMode) => {
    if (isCharging) return; // Disable mode change when charging
    onModeChange(newMode);
  }, [onModeChange, isCharging]);

  const handleSelectRoom = useCallback((roomId: RoomId) => {
    if (isCharging) return; // Disable room selection when charging
    onSelectRoom(roomId);
  }, [onSelectRoom, isCharging]);

  const handleSendMessage = useCallback((message: string) => {
    onSendMessage(message);
  }, [onSendMessage]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ========== ZONE 1: STATUS BAR (Fixed) ========== */}
      <div className="flex-shrink-0 p-3 pb-0">
        <div className="flex items-center justify-between gap-2">
          <StatusBar state={state} />
          <WeightIndicator weight={loadWeight} maxWeight={maxLoadWeight} />
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex-shrink-0 p-3">
        <ModeToggleBar mode={mode} onModeChange={handleModeChange} disabled={isCharging} />
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
            disabled={isCharging}
          />
        )}
      </div>

      {/* ========== ZONE 3: ROBOT DISPLAY & MESSAGING ========== */}
      <div className="flex-shrink-0 p-3 pt-0 space-y-3">
        <RobotDisplayPanel state={state} />
        <MessageInput 
          currentMessage={state.displayMessage}
          onSendMessage={handleSendMessage}
          disabled={state.bluetoothStatus !== 'connected'}
        />
      </div>

      {/* ========== ZONE 4: SECONDARY INFO (Fixed bottom) ========== */}
      <div className="flex-shrink-0 p-3 pt-0 pb-24">
        <ActivityLog messages={messages} maxItems={8} />
      </div>
    </div>
  );
}
