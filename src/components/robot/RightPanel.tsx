import { memo } from 'react';
import { RobotState } from '@/types/robot';
import { RobotDisplayPanel } from './RobotDisplayPanel';
import { MessageInput } from './MessageInput';

interface RightPanelProps {
  state: RobotState;
  onSendMessage: (message: string) => void;
}

/**
 * RIGHT PANEL - Robot Display & Telemetry
 * 
 * Contains:
 * - Robot Display Panel (mirrors physical robot LCD)
 *   - Time, Battery, Robot state, Display message, Load weight, Destination
 * - Message Input Box
 * 
 * Only telemetry/display elements allowed here
 */
export const RightPanel = memo(function RightPanel({
  state,
  onSendMessage,
}: RightPanelProps) {
  return (
    <div className="h-full flex flex-col rounded-xl border border-border/40 bg-secondary/20 overflow-hidden">
      {/* Panel Header */}
      <div className="flex-shrink-0 px-4 py-2.5 border-b border-border/30 bg-secondary/30">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Robot Display
        </h2>
      </div>

      {/* Panel Content */}
      <div className="flex-1 p-3 space-y-3 overflow-hidden">
        {/* Robot Display Panel - Mirrors physical LCD */}
        <RobotDisplayPanel state={state} />
        
        {/* Message Input - Directly below display panel */}
        <MessageInput 
          currentMessage={state.displayMessage}
          onSendMessage={onSendMessage}
          disabled={state.bluetoothStatus !== 'connected'}
        />
      </div>
    </div>
  );
});
