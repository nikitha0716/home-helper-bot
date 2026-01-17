import { useCallback, useState } from 'react';
import { RobotState, RoomId, ControlDirection, RobotMode, StatusMessage } from '@/types/robot';
import { TopBar } from './TopBar';
import { LeftPanel } from './LeftPanel';
import { RightPanel } from './RightPanel';
import { BottomPanel } from './BottomPanel';
import { Map, Monitor } from 'lucide-react';

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
 * RESPONSIVE OPERATOR CONSOLE LAYOUT
 * 
 * MOBILE (< 768px):
 * ┌─────────────────────────────────────┐
 * │ TOP BAR (compact, icons only)       │
 * ├─────────────────────────────────────┤
 * │ [Control View Toggle Tabs]          │
 * │ Either LEFT PANEL or RIGHT PANEL    │
 * │ (single view at a time)             │
 * ├─────────────────────────────────────┤
 * │ BOTTOM PANEL (collapsed)            │
 * └─────────────────────────────────────┘
 * 
 * TABLET/DESKTOP (≥ 768px):
 * ┌─────────────────────────────────────────────────────────┐
 * │ TOP BAR (full width, text labels visible)              │
 * ├──────────────────────────────┬──────────────────────────┤
 * │ LEFT PANEL                   │ RIGHT PANEL              │
 * │ (Movement & Navigation)      │ (Robot Display)          │
 * ├──────────────────────────────┴──────────────────────────┤
 * │ BOTTOM PANEL (full width)                               │
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
  // Mobile view toggle: 'control' = Left Panel, 'display' = Right Panel
  const [mobileView, setMobileView] = useState<'control' | 'display'>('control');

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

      {/* ═══════ MOBILE VIEW TOGGLE (< 768px only) ═══════ */}
      <div className="flex-shrink-0 md:hidden px-2 pt-2">
        <div className="flex bg-secondary/30 rounded-lg p-1 border border-border/30">
          <button
            onClick={() => setMobileView('control')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              mobileView === 'control'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>{state.mode === 'auto' ? 'Navigation' : 'Control'}</span>
          </button>
          <button
            onClick={() => setMobileView('display')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              mobileView === 'display'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>Robot Display</span>
          </button>
        </div>
      </div>

      {/* ═══════ MAIN CONTENT ═══════ */}
      <div className="flex-1 min-h-0 p-2 md:p-3 pb-1 md:pb-2">
        {/* Desktop: Two-column grid */}
        <div className="hidden md:grid md:grid-cols-2 gap-3 h-full">
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

        {/* Mobile: Single panel view with toggle */}
        <div className="md:hidden h-full">
          {mobileView === 'control' ? (
            <LeftPanel
              state={state}
              onSelectRoom={handleSelectRoom}
              onControl={handleControl}
              onSpeedChange={handleSpeedChange}
            />
          ) : (
            <RightPanel
              state={state}
              onSendMessage={handleSendMessage}
            />
          )}
        </div>
      </div>

      {/* ═══════ BOTTOM PANEL (Full Width) ═══════ */}
      <div className="flex-shrink-0 px-2 md:px-3 pb-2 md:pb-3">
        <BottomPanel messages={messages} />
      </div>
    </div>
  );
}
