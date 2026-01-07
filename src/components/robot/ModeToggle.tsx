import { motion } from 'framer-motion';
import { Zap, Hand, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RobotMode } from '@/types/robot';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ModeToggleProps {
  mode: RobotMode;
  onModeChange: (mode: RobotMode) => void;
  disabled?: boolean;
  compact?: boolean;
}

export function ModeToggle({ mode, onModeChange, disabled, compact = false }: ModeToggleProps) {
  return (
    <TooltipProvider>
      <div className="flex gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={mode === 'auto' ? 'default' : 'outline'}
              className={`flex-1 ${compact ? 'py-2' : 'py-6'} relative overflow-hidden`}
              onClick={() => onModeChange('auto')}
              disabled={disabled}
            >
              {mode === 'auto' && (
                <motion.div
                  layoutId="mode-highlight"
                  className="absolute inset-0 bg-primary"
                  initial={false}
                />
              )}
              <span className="relative flex items-center gap-2">
                <Zap className={`${compact ? 'w-4 h-4' : 'w-5 h-5'}`} />
                {!compact && 'Auto'}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs">
            <div className="space-y-1">
              <p className="font-medium text-primary">Auto Mode</p>
              <p className="text-xs text-muted-foreground">
                Robot navigates autonomously using sensors. It will avoid obstacles 
                and find the optimal path to the destination.
              </p>
            </div>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={mode === 'manual' ? 'default' : 'outline'}
              className={`flex-1 ${compact ? 'py-2' : 'py-6'} relative overflow-hidden`}
              onClick={() => onModeChange('manual')}
              disabled={disabled}
            >
              {mode === 'manual' && (
                <motion.div
                  layoutId="mode-highlight"
                  className="absolute inset-0 bg-primary"
                  initial={false}
                />
              )}
              <span className="relative flex items-center gap-2">
                <Hand className={`${compact ? 'w-4 h-4' : 'w-5 h-5'}`} />
                {!compact && 'Manual'}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs">
            <div className="space-y-1">
              <p className="font-medium text-warning">Manual Mode</p>
              <p className="text-xs text-muted-foreground">
                Direct control via joystick or buttons. You control all movements. 
                Use caution and watch for obstacles.
              </p>
            </div>
          </TooltipContent>
        </Tooltip>

        {/* Mode Info Icon */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center">
              <HelpCircle className="w-4 h-4 text-muted-foreground" />
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs">
            <div className="space-y-2 text-xs">
              <p className="font-medium">Mode Comparison</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <p className="text-primary font-medium">Auto</p>
                  <ul className="text-muted-foreground">
                    <li>• Path planning</li>
                    <li>• Obstacle avoidance</li>
                    <li>• Hands-free</li>
                  </ul>
                </div>
                <div className="space-y-1">
                  <p className="text-warning font-medium">Manual</p>
                  <ul className="text-muted-foreground">
                    <li>• Direct control</li>
                    <li>• Precise movement</li>
                    <li>• Full override</li>
                  </ul>
                </div>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
