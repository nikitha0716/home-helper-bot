import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Sofa, Bed, ChefHat, Package, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RoomId } from '@/types/robot';

interface DestinationDialogProps {
  isOpen: boolean;
  selectedRoom: RoomId | null;
  onConfirm: () => void;
  onCancel: () => void;
}

const roomConfig: Record<RoomId, { name: string; icon: React.ReactNode }> = {
  'living-room': { name: 'Living Room', icon: <Sofa className="w-8 h-8" /> },
  'bedroom': { name: 'Bedroom', icon: <Bed className="w-8 h-8" /> },
  'kitchen': { name: 'Kitchen', icon: <ChefHat className="w-8 h-8" /> },
  'store-room': { name: 'Store Room', icon: <Package className="w-8 h-8" /> },
};

export function DestinationDialog({ isOpen, selectedRoom, onConfirm, onCancel }: DestinationDialogProps) {
  if (!selectedRoom) return null;
  
  const room = roomConfig[selectedRoom];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={onCancel}
          />
          
          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 bottom-24 z-50 glass-card p-6 space-y-4 max-w-sm mx-auto"
          >
            {/* Close Button */}
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-secondary transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            {/* Content */}
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Bot className="w-7 h-7 text-primary" />
                </div>
                <ArrowRight className="w-6 h-6 text-muted-foreground" />
                <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center text-primary">
                  {room.icon}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold">Send Robot to</h3>
                <p className="text-xl text-primary font-medium">{room.name}</p>
              </div>

              <p className="text-sm text-muted-foreground">
                The robot will navigate to the selected room automatically.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={onCancel}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={onConfirm}>
                Confirm
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
