import { memo } from 'react';
import { Bot, Sofa, Bed, ChefHat, Package, Navigation } from 'lucide-react';
import { RoomId, Room, RobotState } from '@/types/robot';

interface AutoModeViewProps {
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

// AUTO MODE: Large house map, destination selection, NO joystick
export const AutoModeView = memo(function AutoModeView({
  state,
  onSelectRoom,
}: AutoModeViewProps) {
  const { currentRoom, destinationRoom, isMoving } = state;

  return (
    <div className="flex flex-col h-full">
      {/* Mode Label */}
      <div className="text-center py-2 mb-2">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
          <Navigation className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-medium text-primary">Robot navigating automatically</span>
        </span>
      </div>

      {/* House Map - Large */}
      <div className="flex-1 flex items-center justify-center p-2">
        <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
          {rooms.map((room) => {
            const isCurrentRoom = currentRoom === room.id;
            const isDestination = destinationRoom === room.id;
            const canSelect = !isMoving && !isCurrentRoom;
            
            return (
              <button
                key={room.id}
                onClick={() => canSelect && onSelectRoom(room.id)}
                disabled={!canSelect}
                className={`
                  relative p-4 rounded-xl flex flex-col items-center gap-2 
                  border-2 transition-colors duration-200
                  ${isCurrentRoom 
                    ? 'border-primary bg-primary/10' 
                    : isDestination 
                      ? 'border-warning bg-warning/10' 
                      : 'border-border/40 bg-secondary/20 hover:border-primary/40'
                  }
                  ${canSelect ? 'cursor-pointer active:scale-[0.98]' : 'cursor-default'}
                `}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                  isCurrentRoom 
                    ? 'bg-primary/20 text-primary' 
                    : isDestination 
                      ? 'bg-warning/20 text-warning' 
                      : 'bg-secondary/50 text-muted-foreground'
                }`}>
                  {roomIcons[room.icon]}
                </div>
                <span className="text-xs font-medium">{room.name}</span>
                
                {/* Robot indicator */}
                {isCurrentRoom && (
                  <div className="absolute top-2 right-2">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                )}
                {isDestination && !isCurrentRoom && (
                  <div className="absolute top-2 right-2">
                    <Navigation className="w-4 h-4 text-warning" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Status Message */}
      <div className="text-center py-2">
        <p className="text-xs text-muted-foreground">
          {isMoving 
            ? `Navigating to ${destinationRoom?.replace('-', ' ')}...` 
            : 'Tap a room to send robot'}
        </p>
      </div>
    </div>
  );
});
