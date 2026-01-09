import { useCallback } from 'react';
import { RobotState, RoomId, ControlDirection, RobotMode, StatusMessage } from '@/types/robot';
import { TopBar } from './TopBar';
import { LeftPanel } from './LeftPanel';
import { RightPanel } from './RightPanel';
import { BottomPanel } from './BottomPanel';

interface DashboardProps {
  state: RobotState;
  messages: StatusMessage[];
  onSelectRoom: (roomId: RoomId) => void;
  onControl: (direction: ControlDirection) => void;
  onSpeedChange: (speed: number) => void;
  onModeChange: (mode: RobotMode) => void;
  onEmergencyStop: () => void;
  onSendMessage: (message: string) => void;
}

/**
 * OPERATOR CONSOLE LAYOUT
 * 
 * ┌─────────────────────────────────────────────────────────┐
 * │ TOP BAR (full width)                                    │
 * │ Robot name | Mode toggle | Battery | BT | EMERGENCY STOP│
 * ├──────────────────────────────┬──────────────────────────┤
 * │ LEFT PANEL                   │ RIGHT PANEL              │
 * │ (Movement & Navigation)      │ (Robot Display & Telemetry) │
 * │                              │                          │
 * │ Auto: Map + Path             │ LCD Display Panel        │
 * │ Manual: Joystick + Speed     │ - Time, Battery, State   │
 * │                              │ - Message, Weight, Dest  │
 * │                              │                          │
 * │                              │ Message Input Box        │
 * ├──────────────────────────────┴──────────────────────────┤
 * │ BOTTOM PANEL (full width)                               │
 * │ Activity Log - Fixed height, scrollable                 │
 * └─────────────────────────────────────────────────────────┘
 */
export function Dashboard({
  state,
  messages,
  onSelectRoom,
  onControl,
  onSpeedChange,
  onModeChange,
  onEmergencyStop,
  onSendMessage,
}: DashboardProps) {
  // Memoized handlers to prevent unnecessary re-renders
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

  const handleSendMessage = useCallback((message: string) => {
    onSendMessage(message);
  }, [onSendMessage]);

  const handleEmergencyStop = useCallback(() => {
    onEmergencyStop();
  }, [onEmergencyStop]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ═══════ TOP BAR (Full Width) ═══════ */}
      <div className="flex-shrink-0">
        <TopBar 
          state={state}
          onModeChange={handleModeChange}
          onEmergencyStop={handleEmergencyStop}
        />
      </div>

      {/* ═══════ MAIN GRID (2 Columns) ═══════ */}
      <div className="flex-1 min-h-0 p-3 pb-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-full">
          {/* LEFT COLUMN: Movement & Navigation */}
          <LeftPanel
            state={state}
            onSelectRoom={handleSelectRoom}
            onControl={handleControl}
            onSpeedChange={handleSpeedChange}
          />

          {/* RIGHT COLUMN: Robot Display & Telemetry */}
          <RightPanel
            state={state}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>

      {/* ═══════ BOTTOM PANEL (Full Width) ═══════ */}
      <div className="flex-shrink-0 px-3 pb-3">
        <BottomPanel messages={messages} />
      </div>
    </div>
  );
}
