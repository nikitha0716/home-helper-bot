import { motion } from 'framer-motion';
import { Bot, Sofa, Bed, ChefHat, Package, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RoomId, Room, RobotState } from '@/types/robot';

interface HouseMapProps {
  state: RobotState;
  onSelectRoom: (roomId: RoomId) => void;
}

const rooms: Room[] = [
  { id: 'living-room', name: 'Living Room', icon: 'sofa', position: { x: 0, y: 0 } },
  { id: 'bedroom', name: 'Bedroom', icon: 'bed', position: { x: 1, y: 0 } },
  { id: 'kitchen', name: 'Kitchen', icon: 'chef', position: { x: 0, y: 1 } },
  { id: 'store-room', name: 'Store Room', icon: 'package', position: { x: 1, y: 1 } },
];

const roomIcons: Record<string, React.ReactNode> = {
  sofa: <Sofa className="w-6 h-6" />,
  bed: <Bed className="w-6 h-6" />,
  chef: <ChefHat className="w-6 h-6" />,
  package: <Package className="w-6 h-6" />,
};

export function HouseMap({ state, onSelectRoom }: HouseMapProps) {
  const { currentRoom, destinationRoom, isMoving, bluetoothStatus } = state;
  const isConnected = bluetoothStatus === 'connected';

  return (
    <div className="flex flex-col h-full p-4 space-y-4">
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-xl font-semibold">Home Map</h1>
        <p className="text-sm text-muted-foreground">
          {isMoving ? 'Robot is moving...' : 'Select a destination'}
        </p>
      </div>

      {/* Map Container */}
      <div className="flex-1 flex items-center justify-center">
        <div className="relative w-full max-w-sm aspect-square">
          {/* House Outline */}
          <div className="absolute inset-0 border-2 border-border/50 rounded-2xl bg-secondary/20" />
          
          {/* Room Grid */}
          <div className="absolute inset-2 grid grid-cols-2 grid-rows-2 gap-2">
            {rooms.map((room) => {
              const isCurrentRoom = currentRoom === room.id;
              const isDestination = destinationRoom === room.id;
              
              return (
                <motion.button
                  key={room.id}
                  onClick={() => isConnected && !isMoving && onSelectRoom(room.id)}
                  disabled={!isConnected || isMoving || isCurrentRoom}
                  className={`
                    relative glass-card p-3 flex flex-col items-center justify-center gap-2
                    transition-all duration-300
                    ${isCurrentRoom ? 'border-primary glow-primary' : ''}
                    ${isDestination ? 'border-warning glow-warning' : ''}
                    ${!isConnected || isMoving ? 'opacity-50' : 'hover:border-primary/50'}
                  `}
                  whileHover={isConnected && !isMoving ? { scale: 1.02 } : {}}
                  whileTap={isConnected && !isMoving ? { scale: 0.98 } : {}}
                >
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center
                    ${isCurrentRoom ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'}
                  `}>
                    {roomIcons[room.icon]}
                  </div>
                  <span className="text-xs font-medium">{room.name}</span>
                  
                  {/* Robot Indicator */}
                  {isCurrentRoom && (
                    <motion.div
                      className="absolute top-2 right-2"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Bot className="w-5 h-5 text-primary" />
                    </motion.div>
                  )}
                  
                  {/* Destination Indicator */}
                  {isDestination && (
                    <motion.div
                      className="absolute top-2 right-2"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <Navigation className="w-5 h-5 text-warning" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Movement Path Animation */}
          {isMoving && currentRoom && destinationRoom && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <svg className="w-full h-full">
                <motion.line
                  x1="50%"
                  y1="50%"
                  x2="50%"
                  y2="50%"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  animate={{ strokeDashoffset: [0, -20] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </svg>
            </motion.div>
          )}
        </div>
      </div>

      {/* Status Card */}
      <div className="glass-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Current Location</span>
          <span className="text-sm font-medium capitalize">
            {currentRoom?.replace('-', ' ') || 'Unknown'}
          </span>
        </div>
        
        {destinationRoom && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Destination</span>
            <span className="text-sm font-medium text-warning capitalize">
              {destinationRoom.replace('-', ' ')}
            </span>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Status</span>
          <span className={`text-sm font-medium ${isMoving ? 'text-warning' : 'text-success'}`}>
            {isMoving ? 'Moving' : 'Ready'}
          </span>
        </div>
      </div>

      {/* Call Robot Button */}
      <Button
        size="lg"
        disabled={!isConnected}
        className="w-full py-6 gap-2"
      >
        <Bot className="w-5 h-5" />
        Call Robot
      </Button>
    </div>
  );
}
