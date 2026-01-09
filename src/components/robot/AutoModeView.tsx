import { memo, useMemo } from 'react';
import { Bot, Sofa, Bed, ChefHat, Package, Navigation, ArrowRight } from 'lucide-react';
import { RoomId, Room, RobotState } from '@/types/robot';
import { motion } from 'framer-motion';

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

// Calculate path between rooms for visualization
function getPathBetweenRooms(from: RoomId | null, to: RoomId | null): { from: Room; to: Room } | null {
  if (!from || !to) return null;
  const fromRoom = rooms.find(r => r.id === from);
  const toRoom = rooms.find(r => r.id === to);
  if (!fromRoom || !toRoom) return null;
  return { from: fromRoom, to: toRoom };
}

// AUTO MODE: Large house map, destination selection, path display
export const AutoModeView = memo(function AutoModeView({
  state,
  onSelectRoom,
}: AutoModeViewProps) {
  const { currentRoom, destinationRoom, isMoving, isCharging } = state;

  const pathInfo = useMemo(() => 
    getPathBetweenRooms(currentRoom, destinationRoom), 
    [currentRoom, destinationRoom]
  );

  return (
    <div className="flex flex-col h-full">
      {/* Mode Label */}
      <div className="text-center py-2 mb-2">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
          <Navigation className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-medium text-primary">
            {isCharging ? 'Robot is charging' : 'Robot navigating automatically'}
          </span>
        </span>
      </div>

      {/* Path Indicator (when moving) */}
      {pathInfo && isMoving && (
        <div className="mx-4 mb-2 p-2.5 rounded-lg bg-warning/10 border border-warning/30">
          <div className="flex items-center justify-center gap-2 text-sm">
            <span className="font-medium text-warning">{rooms.find(r => r.id === currentRoom)?.name}</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <ArrowRight className="w-4 h-4 text-warning" />
            </motion.div>
            <span className="font-medium text-warning">{rooms.find(r => r.id === destinationRoom)?.name}</span>
          </div>
        </div>
      )}

      {/* House Map - Large */}
      <div className="flex-1 flex items-center justify-center p-2">
        <div className="relative">
          {/* Path Line SVG Overlay */}
          {pathInfo && isMoving && (
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
              style={{ overflow: 'visible' }}
            >
              <motion.line
                x1={pathInfo.from.position.x === 0 ? '25%' : '75%'}
                y1={pathInfo.from.position.y === 0 ? '25%' : '75%'}
                x2={pathInfo.to.position.x === 0 ? '25%' : '75%'}
                y2={pathInfo.to.position.y === 0 ? '25%' : '75%'}
                stroke="hsl(var(--warning))"
                strokeWidth="3"
                strokeDasharray="8 4"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
              {/* Animated dot along path */}
              <motion.circle
                r="6"
                fill="hsl(var(--warning))"
                initial={{ 
                  cx: pathInfo.from.position.x === 0 ? '25%' : '75%',
                  cy: pathInfo.from.position.y === 0 ? '25%' : '75%'
                }}
                animate={{ 
                  cx: pathInfo.to.position.x === 0 ? '25%' : '75%',
                  cy: pathInfo.to.position.y === 0 ? '25%' : '75%'
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
            </svg>
          )}

          <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
            {rooms.map((room) => {
              const isCurrentRoom = currentRoom === room.id;
              const isDestination = destinationRoom === room.id;
              const canSelect = !isMoving && !isCurrentRoom && !isCharging;
              
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
                    ${canSelect ? 'cursor-pointer active:scale-[0.98]' : 'cursor-default opacity-70'}
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
                  
                  {/* Robot indicator with pulse when current */}
                  {isCurrentRoom && (
                    <div className="absolute top-2 right-2">
                      <motion.div
                        animate={isMoving ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <Bot className="w-4 h-4 text-primary" />
                      </motion.div>
                    </div>
                  )}
                  {isDestination && !isCurrentRoom && (
                    <div className="absolute top-2 right-2">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <Navigation className="w-4 h-4 text-warning" />
                      </motion.div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Status Message */}
      <div className="text-center py-2">
        <p className="text-xs text-muted-foreground">
          {isCharging 
            ? 'Robot is charging — movement disabled'
            : isMoving 
              ? `Navigating to ${destinationRoom?.replace('-', ' ')}...` 
              : 'Tap a room to send robot'
          }
        </p>
      </div>
    </div>
  );
});
