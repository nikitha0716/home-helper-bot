import { motion, AnimatePresence } from 'framer-motion';
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
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStop}
          disabled={!isBluetoothConnected}
          className={`
            fixed bottom-24 right-4 z-50
            w-16 h-16 rounded-full
            flex items-center justify-center
            transition-all duration-200
            ${isBluetoothConnected 
              ? 'bg-destructive hover:bg-destructive/90 cursor-pointer' 
              : 'bg-destructive/40 cursor-not-allowed'
            }
          `}
          style={{
            boxShadow: isBluetoothConnected 
              ? '0 0 30px hsl(0 72% 51% / 0.5), 0 4px 20px hsl(0 72% 51% / 0.3)' 
              : 'none'
          }}
          aria-label="Emergency Stop"
        >
          <motion.div
            animate={isBluetoothConnected ? { 
              scale: [1, 1.1, 1],
            } : {}}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <OctagonX className="w-8 h-8 text-destructive-foreground" />
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
