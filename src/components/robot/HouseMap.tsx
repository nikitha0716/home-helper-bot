import { motion } from 'framer-motion';
import { Bot, Sofa, Bed, ChefHat, Package, Navigation, Phone, Bluetooth } from 'lucide-react';
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
  const { currentRoom, destinationRoom, isMoving, bluetoothStatus, status, mode } = state;
  const isConnected = bluetoothStatus === 'connected';
  const isAutoMode = mode === 'auto';

  // Empty state when not connected
  if (!isConnected) {
    return (
      <div className="flex flex-col h-full p-4 items-center justify-center">
        <div className="text-center space-y-4 max-w-xs">
          <div className="w-20 h-20 mx-auto rounded-full bg-secondary/50 flex items-center justify-center">
            <Bluetooth className="w-10 h-10 text-muted-foreground/50" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-medium text-muted-foreground">Connect to Begin</h2>
            <p className="text-sm text-muted-foreground/70">
              Connect to your robot via Bluetooth to view the home map and control navigation
            </p>
          </div>
        </div>
      </div>
    );
  }

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
      {/* Header with Status */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Home Map</h1>
          <div className={`px-2 py-1 rounded-md text-xs font-medium ${
            isMoving ? 'bg-primary/20 text-primary' : 
            status === 'idle' ? 'bg-success/20 text-success' :
            'bg-muted text-muted-foreground'
          }`}>
            {isMoving ? 'Navigating' : status === 'idle' ? 'Ready' : status.replace('_', ' ')}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {isMoving 
            ? `Moving to ${destinationRoom?.replace('-', ' ')}...` 
            : isAutoMode
              ? 'Tap a room to send robot'
              : 'Switch to Auto mode for destination control'
          }
        </p>
      </div>

      {/* Map Container */}
      <div className="flex-1 flex items-center justify-center min-h-0">
        <div className="relative w-full max-w-sm aspect-square">
          {/* House Outline */}
          <div className="absolute inset-0 border-2 border-border/50 rounded-2xl bg-secondary/10" />
          
          {/* Room Grid */}
          <div className={`absolute inset-2 grid grid-cols-2 grid-rows-2 gap-2 transition-opacity duration-200 ${
            !isAutoMode ? 'opacity-60' : ''
          }`}>
            {rooms.map((room) => {
              const isCurrentRoom = currentRoom === room.id;
              const isDestination = destinationRoom === room.id;
              const canSelect = isConnected && !isMoving && isAutoMode && !isCurrentRoom;
              
              return (
                <button
                  key={room.id}
                  onClick={() => canSelect && onSelectRoom(room.id)}
                  disabled={!canSelect}
                  className={`
                    relative glass-card p-3 flex flex-col items-center justify-center gap-2
                    transition-all duration-200 border-2
                    ${isCurrentRoom ? 'border-primary bg-primary/10' : 'border-transparent'}
                    ${isDestination ? 'border-warning bg-warning/10' : ''}
                    ${canSelect ? 'hover:border-primary/50 cursor-pointer' : 'cursor-default'}
                  `}
                >
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center transition-colors
                    ${isCurrentRoom ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'}
                    ${isDestination && !isCurrentRoom ? 'bg-warning/20 text-warning' : ''}
                  `}>
                    {roomIcons[room.icon]}
                  </div>
                  <span className="text-xs font-medium">{room.name}</span>
                  
                  {/* Robot Indicator */}
                  {isCurrentRoom && (
                    <motion.div
                      className="absolute top-2 right-2"
                      animate={isMoving ? { y: [0, -3, 0] } : {}}
                      transition={{ duration: 0.8, repeat: isMoving ? Infinity : 0 }}
                    >
                      <Bot className="w-5 h-5 text-primary" />
                    </motion.div>
                  )}
                  
                  {/* Destination Indicator */}
                  {isDestination && !isCurrentRoom && (
                    <div className="absolute top-2 right-2">
                      <Navigation className="w-5 h-5 text-warning" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Movement Path - Subtle animation */}
          {isMoving && currentRoom && destinationRoom && (
            <svg className="absolute inset-0 pointer-events-none">
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
                strokeWidth="2"
                strokeDasharray="6,4"
                strokeLinecap="round"
                strokeOpacity="0.6"
                animate={{ strokeDashoffset: [0, -20] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              />
            </svg>
          )}

          {/* Manual Mode Overlay */}
          {!isAutoMode && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/40 rounded-2xl">
              <p className="text-sm text-muted-foreground text-center px-8">
                Switch to Auto Mode to select destinations
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Status Card - Clean & minimal */}
      <div className="glass-card p-4 space-y-2">
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
      </div>

      {/* Call Robot Button */}
      <Button
        size="lg"
        disabled={!isConnected || isMoving}
        variant="outline"
        className="w-full py-5 gap-2"
      >
        <Phone className="w-5 h-5" />
        Call Robot to My Location
      </Button>
    </div>
  );
}
