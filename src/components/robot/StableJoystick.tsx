import { useState, useCallback, memo } from 'react';

interface StableJoystickProps {
  isActive: boolean;
  onControl: (direction: 'forward' | 'backward' | 'left' | 'right' | 'stop') => void;
}

// Memoized joystick component - never re-mounts on state updates
export const StableJoystick = memo(function StableJoystick({
  isActive,
  onControl,
}: StableJoystickProps) {
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const handleJoystickMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !isActive) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const x = e.clientX - rect.left - centerX;
    const y = e.clientY - rect.top - centerY;
    
    const distance = Math.sqrt(x * x + y * y);
    const maxDistance = 50;
    
    if (distance > maxDistance) {
      const angle = Math.atan2(y, x);
      setJoystickPos({
        x: Math.cos(angle) * maxDistance,
        y: Math.sin(angle) * maxDistance,
      });
    } else {
      setJoystickPos({ x, y });
    }

    const threshold = 20;
    if (Math.abs(y) > Math.abs(x)) {
      if (y < -threshold) onControl('forward');
      else if (y > threshold) onControl('backward');
    } else {
      if (x > threshold) onControl('right');
      else if (x < -threshold) onControl('left');
    }
  }, [isDragging, isActive, onControl]);

  const handleJoystickRelease = useCallback(() => {
    setIsDragging(false);
    setJoystickPos({ x: 0, y: 0 });
    onControl('stop');
  }, [onControl]);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (isActive) {
      setIsDragging(true);
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  }, [isActive]);

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Fixed Outer Base - Never moves */}
      <div 
        className="relative w-40 h-40 rounded-full bg-secondary/40 border-2 border-border/40"
        onPointerMove={handleJoystickMove}
        onPointerUp={handleJoystickRelease}
        onPointerLeave={handleJoystickRelease}
      >
        {/* Fixed Crosshair */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-px h-full bg-border/20" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-full h-px bg-border/20" />
        </div>
        
        {/* Fixed Direction Labels */}
        <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground/60 font-medium select-none">FWD</span>
        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground/60 font-medium select-none">REV</span>
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground/60 font-medium select-none">L</span>
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground/60 font-medium select-none">R</span>
        
        {/* Inner Knob - Only this element moves */}
        <div
          className={`absolute w-14 h-14 rounded-full top-1/2 left-1/2 select-none touch-none ${
            isActive ? 'cursor-grab active:cursor-grabbing' : 'cursor-not-allowed'
          }`}
          style={{
            transform: `translate(calc(-50% + ${joystickPos.x}px), calc(-50% + ${joystickPos.y}px))`,
            backgroundColor: isDragging 
              ? 'hsl(var(--primary))' 
              : 'hsl(var(--primary) / 0.85)',
            boxShadow: isDragging 
              ? '0 0 20px hsl(var(--primary) / 0.5)' 
              : '0 0 8px hsl(var(--primary) / 0.3)',
            transition: isDragging ? 'none' : 'transform 0.15s ease-out, box-shadow 0.15s ease-out',
          }}
          onPointerDown={handlePointerDown}
        />
      </div>
    </div>
  );
});
