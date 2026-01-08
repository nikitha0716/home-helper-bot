import { useState, useRef, useCallback } from 'react';
import { OctagonX } from 'lucide-react';

interface FloatingEmergencyStopProps {
  onStop: () => void;
  isBluetoothConnected: boolean;
  isVisible?: boolean;
}

export function FloatingEmergencyStop({ 
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
    
    // Long press for hard stop - starts timer
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
        transition-colors duration-150
        ${isBluetoothConnected 
          ? isPressed
            ? 'bg-destructive/80' 
            : 'bg-destructive hover:bg-destructive/90 cursor-pointer'
          : 'bg-destructive/40 cursor-not-allowed'
        }
      `}
      style={{
        boxShadow: isBluetoothConnected 
          ? isPressed
            ? '0 0 40px hsl(0 72% 51% / 0.7), 0 4px 20px hsl(0 72% 51% / 0.4)' 
            : '0 0 25px hsl(0 72% 51% / 0.4), 0 4px 15px hsl(0 72% 51% / 0.25)'
          : 'none'
      }}
      aria-label="Emergency Stop"
    >
      <OctagonX 
        className={`w-8 h-8 text-destructive-foreground transition-transform duration-150 ${
          isPressed ? 'scale-90' : ''
        }`} 
      />
      
      {/* Long press indicator ring */}
      {isPressed && isBluetoothConnected && (
        <div 
          className="absolute inset-0 rounded-full border-4 border-destructive-foreground/50 animate-ping"
          style={{ animationDuration: '0.5s', animationIterationCount: 1 }}
        />
      )}
    </button>
  );
}
