import { motion } from 'framer-motion';
import { Bot, Sofa, Bed, ChefHat, Package, Navigation, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RoomId, Room, RobotState } from '@/types/robot';
import { RobotAnimation } from './RobotAnimation';

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
  const { currentRoom, destinationRoom, isMoving, bluetoothStatus, status } = state;
  const isConnected = bluetoothStatus === 'connected';

  // Calculate positions for path line
  const getRoomCenter = (roomId: RoomId | null) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return { x: 50, y: 50 };
    return {
      x: room.position.x === 0 ? 25 : 75,
      y: room.position.y === 0 ? 25 : 75,
    };
  };

  const startPos = getRoomCenter(currentRoom);
  const endPos = getRoomCenter(destinationRoom);

  return (
    <div className="flex flex-col h-full p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Home Map</h1>
          <p className="text-sm text-muted-foreground">
            {isMoving ? 'Robot is navigating...' : 'Tap a room to send robot'}
          </p>
        </div>
        <RobotAnimation status={status} size="sm" />
      </div>

      {/* Map Container */}
      <div className="flex-1 flex items-center justify-center">
        <div className="relative w-full max-w-sm aspect-square">
          {/* House Outline */}
          <motion.div 
            className="absolute inset-0 border-2 border-border/50 rounded-2xl bg-secondary/20"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          />
          
          {/* Room Grid */}
          <div className="absolute inset-2 grid grid-cols-2 grid-rows-2 gap-2">
            {rooms.map((room, index) => {
              const isCurrentRoom = currentRoom === room.id;
              const isDestination = destinationRoom === room.id;
              
              return (
                <motion.button
                  key={room.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
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
                  <motion.div 
                    className={`
                      w-12 h-12 rounded-xl flex items-center justify-center
                      ${isCurrentRoom ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'}
                    `}
                    animate={isCurrentRoom ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {roomIcons[room.icon]}
                  </motion.div>
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
            <motion.svg
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <defs>
                <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="100%" stopColor="hsl(var(--warning))" />
                </linearGradient>
              </defs>
              <motion.line
                x1={`${startPos.x}%`}
                y1={`${startPos.y}%`}
                x2={`${endPos.x}%`}
                y2={`${endPos.y}%`}
                stroke="url(#pathGradient)"
                strokeWidth="3"
                strokeDasharray="8,4"
                strokeLinecap="round"
                animate={{ strokeDashoffset: [0, -24] }}
                transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
              />
              {/* Moving dot */}
              <motion.circle
                r="6"
                fill="hsl(var(--primary))"
                animate={{
                  cx: [`${startPos.x}%`, `${endPos.x}%`],
                  cy: [`${startPos.y}%`, `${endPos.y}%`],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.svg>
          )}
        </div>
      </div>

      {/* Status Card */}
      <motion.div 
        className="glass-card p-4 space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Current Location</span>
          <span className="text-sm font-medium capitalize">
            {currentRoom?.replace('-', ' ') || 'Unknown'}
          </span>
        </div>
        
        {destinationRoom && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex items-center justify-between"
          >
            <span className="text-sm text-muted-foreground">Destination</span>
            <span className="text-sm font-medium text-warning capitalize">
              {destinationRoom.replace('-', ' ')}
            </span>
          </motion.div>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Status</span>
          <div className="flex items-center gap-2">
            <motion.div
              className={`w-2 h-2 rounded-full ${isMoving ? 'bg-warning' : 'bg-success'}`}
              animate={isMoving ? { opacity: [1, 0.5, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className={`text-sm font-medium ${isMoving ? 'text-warning' : 'text-success'}`}>
              {isMoving ? 'Moving' : 'Ready'}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Call Robot Button */}
      <Button
        size="lg"
        disabled={!isConnected}
        className="w-full py-6 gap-2"
      >
        <Phone className="w-5 h-5" />
        Call Robot to My Location
      </Button>
    </div>
  );
}
