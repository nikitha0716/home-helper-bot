import { motion } from 'framer-motion';
import { Bot, Zap, AlertTriangle } from 'lucide-react';
import { RobotStatus } from '@/types/robot';

interface RobotAnimationProps {
  status: RobotStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const statusConfig: Record<RobotStatus, {
  color: string;
  bgColor: string;
  animation: { y?: number[]; rotate?: number[]; scale?: number[]; x?: number[]; opacity?: number[] };
  pulseColor: string;
  label: string;
}> = {
  idle: {
    color: 'text-success',
    bgColor: 'bg-success/20',
    animation: { y: [0, -2, 0] },
    pulseColor: 'bg-success',
    label: 'Ready',
  },
  moving: {
    color: 'text-warning',
    bgColor: 'bg-warning/20',
    animation: { y: [0, -4, 0], rotate: [0, 5, -5, 0] },
    pulseColor: 'bg-warning',
    label: 'Moving',
  },
  obstacle_detected: {
    color: 'text-destructive',
    bgColor: 'bg-destructive/20',
    animation: { scale: [1, 1.1, 1], x: [-2, 2, -2, 0] },
    pulseColor: 'bg-destructive',
    label: 'Obstacle!',
  },
  task_completed: {
    color: 'text-success',
    bgColor: 'bg-success/20',
    animation: { scale: [1, 1.2, 1] },
    pulseColor: 'bg-success',
    label: 'Complete',
  },
  charging: {
    color: 'text-primary',
    bgColor: 'bg-primary/20',
    animation: { opacity: [1, 0.5, 1] },
    pulseColor: 'bg-primary',
    label: 'Charging',
  },
  error: {
    color: 'text-destructive',
    bgColor: 'bg-destructive/20',
    animation: { rotate: [0, -10, 10, 0] },
    pulseColor: 'bg-destructive',
    label: 'Error',
  },
  emergency_stop: {
    color: 'text-destructive',
    bgColor: 'bg-destructive/30',
    animation: { scale: [1, 1.05, 1] },
    pulseColor: 'bg-destructive',
    label: 'STOPPED',
  },
};

const sizeConfig = {
  sm: { container: 'w-8 h-8', icon: 'w-4 h-4' },
  md: { container: 'w-12 h-12', icon: 'w-6 h-6' },
  lg: { container: 'w-16 h-16', icon: 'w-8 h-8' },
};

export function RobotAnimation({ status, size = 'md', showLabel = false }: RobotAnimationProps) {
  const config = statusConfig[status];
  const sizes = sizeConfig[size];

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        {/* Pulse Ring */}
        <motion.div
          className={`absolute inset-0 rounded-xl ${config.pulseColor}`}
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Main Container */}
        <motion.div
          className={`
            relative ${sizes.container} rounded-xl ${config.bgColor}
            flex items-center justify-center
            border border-current/20
          `}
          animate={config.animation}
          transition={{
            duration: status === 'moving' ? 0.8 : 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {status === 'obstacle_detected' ? (
            <AlertTriangle className={`${sizes.icon} ${config.color}`} />
          ) : status === 'charging' ? (
            <Zap className={`${sizes.icon} ${config.color}`} />
          ) : (
            <Bot className={`${sizes.icon} ${config.color}`} />
          )}
        </motion.div>
      </div>

      {showLabel && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-xs font-medium ${config.color}`}
        >
          {config.label}
        </motion.span>
      )}
    </div>
  );
}
