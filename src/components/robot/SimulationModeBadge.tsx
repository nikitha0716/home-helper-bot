import { motion } from 'framer-motion';
import { FlaskConical, X } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SimulationModeBadgeProps {
  isSimulation: boolean;
  onToggle: () => void;
}

export function SimulationModeBadge({ isSimulation, onToggle }: SimulationModeBadgeProps) {
  if (!isSimulation) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onToggle}
            className="glass-card px-3 py-1.5 flex items-center gap-2 border-warning/50 hover:border-warning transition-colors"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <FlaskConical className="w-3.5 h-3.5 text-warning" />
            </motion.div>
            <span className="text-xs font-medium text-warning">SIMULATION</span>
            <X className="w-3 h-3 text-muted-foreground hover:text-foreground" />
          </motion.button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p className="text-xs">Demo mode - No real robot connected. Click to disable.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
