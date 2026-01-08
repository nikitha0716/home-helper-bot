import { useState, useRef, useCallback, memo } from 'react';
import { OctagonX } from 'lucide-react';

interface FloatingEmergencyStopProps {
  onStop: () => void;
  isBluetoothConnected: boolean;
  isVisible?: boolean;
}

/**
 * EMERGENCY STOP BUTTON
 * 
 * CRITICAL REQUIREMENTS:
 * - Always visible in fixed position
 * - Never animates position
 * - Supports long-press for hard stop
 * - Only color/glow changes on interaction
 * - Overrides all modes and UI states
 */
export const FloatingEmergencyStop = memo(function FloatingEmergencyStop({ 
  onStop, 
  isBluetoothConnected,
  isVisible = true 
}: FloatingEmergencyStopProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [isLongPress, setIsLongPress] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  const handlePointerDown = useCallback(() => {
    if (!isBluetoothConnected) return;
    
    setIsPressed(true);
    
    // Long press for hard stop - 500ms threshold
    longPressTimer.current = setTimeout(() => {
      setIsLongPress(true);
      onStop();
    }, 500);
  }, [isBluetoothConnected, onStop]);

  const handlePointerUp = useCallback(() => {
    setIsPressed(false);
    setIsLongPress(false);
    
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const handleClick = useCallback(() => {
    if (!isBluetoothConnected || isLongPress) return;
    onStop();
  }, [isBluetoothConnected, isLongPress, onStop]);

  if (!isVisible) return null;

  return (
    <button
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      disabled={!isBluetoothConnected}
      className={`
        fixed bottom-24 right-4 z-50
        w-16 h-16 rounded-full
        flex items-center justify-center
        select-none touch-none
        ${isBluetoothConnected 
          ? isPressed
            ? 'bg-destructive/90' 
            : 'bg-destructive cursor-pointer'
          : 'bg-destructive/30 cursor-not-allowed'
        }
      `}
      style={{
        // Fixed position - never transforms
        transform: 'none',
        boxShadow: isBluetoothConnected 
          ? isPressed
            ? '0 0 30px hsl(var(--destructive) / 0.7)' 
            : '0 0 20px hsl(var(--destructive) / 0.4)'
          : 'none',
        // No transition on transform, only on colors
        transition: 'background-color 0.15s ease, box-shadow 0.15s ease',
      }}
      aria-label="Emergency Stop"
    >
      <OctagonX 
        className={`w-8 h-8 text-destructive-foreground ${
          isPressed ? 'opacity-80' : ''
        }`}
        style={{ transition: 'opacity 0.15s ease' }}
      />
      
      {/* Long press visual feedback - ring only, no position change */}
      {isPressed && isBluetoothConnected && (
        <span 
          className="absolute inset-0 rounded-full border-3 border-destructive-foreground/40"
          style={{
            animation: 'pulse 0.5s ease-out forwards',
          }}
        />
      )}
    </button>
  );
});
