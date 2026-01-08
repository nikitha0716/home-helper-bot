import { memo } from 'react';
import { Hand, Zap } from 'lucide-react';
import { RobotMode } from '@/types/robot';

interface ModeToggleBarProps {
  mode: RobotMode;
  onModeChange: (mode: RobotMode) => void;
}

// Mode Toggle - Fixed buttons, no position animation
export const ModeToggleBar = memo(function ModeToggleBar({
  mode,
  onModeChange,
}: ModeToggleBarProps) {
  return (
    <div className="grid grid-cols-2 gap-2 flex-shrink-0">
      <button
        onClick={() => onModeChange('auto')}
        className={`p-3 rounded-xl border-2 transition-colors duration-200 ${
          mode === 'auto' 
            ? 'bg-primary/15 border-primary' 
            : 'bg-secondary/30 border-border/30 hover:border-border/50'
        }`}
      >
        <div className="flex items-center justify-center gap-2">
          <Zap className={`w-4 h-4 ${mode === 'auto' ? 'text-primary' : 'text-muted-foreground'}`} />
          <span className={`text-sm font-medium ${mode === 'auto' ? 'text-primary' : 'text-muted-foreground'}`}>
            Auto
          </span>
        </div>
      </button>
      <button
        onClick={() => onModeChange('manual')}
        className={`p-3 rounded-xl border-2 transition-colors duration-200 ${
          mode === 'manual' 
            ? 'bg-warning/15 border-warning' 
            : 'bg-secondary/30 border-border/30 hover:border-border/50'
        }`}
      >
        <div className="flex items-center justify-center gap-2">
          <Hand className={`w-4 h-4 ${mode === 'manual' ? 'text-warning' : 'text-muted-foreground'}`} />
          <span className={`text-sm font-medium ${mode === 'manual' ? 'text-warning' : 'text-muted-foreground'}`}>
            Manual
          </span>
        </div>
      </button>
    </div>
  );
});
