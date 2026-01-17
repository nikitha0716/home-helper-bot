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
  sofa: <Sofa className="w-5 h-5 sm:w-6 sm:h-6" />,
  bed: <Bed className="w-5 h-5 sm:w-6 sm:h-6" />,
  chef: <ChefHat className="w-5 h-5 sm:w-6 sm:h-6" />,
  package: <Package className="w-5 h-5 sm:w-6 sm:h-6" />,
};

// Calculate path between rooms for visualization
function getPathBetweenRooms(from: RoomId | null, to: RoomId | null): { from: Room; to: Room } | null {
  if (!from || !to) return null;
  const fromRoom = rooms.find(r => r.id === from);
  const toRoom = rooms.find(r => r.id === to);
  if (!fromRoom || !toRoom) return null;
  return { from: fromRoom, to: toRoom };
}

/**
 * RESPONSIVE AUTO MODE VIEW
 * 
 * Mobile: Compact room cards, smaller text
 * Tablet/Desktop: Larger room cards with full labels
 */
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
      <div className="text-center py-1.5 sm:py-2 mb-1 sm:mb-2">
        <span className="inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-primary/10 border border-primary/20">
          <Navigation className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
          <span className="text-[10px] sm:text-xs font-medium text-primary">
            {isCharging ? 'Robot charging' : 'Auto navigation'}
          </span>
        </span>
      </div>

      {/* Path Indicator (when moving) */}
      {pathInfo && isMoving && (
        <div className="mx-2 sm:mx-4 mb-1.5 sm:mb-2 p-1.5 sm:p-2.5 rounded-lg bg-warning/10 border border-warning/30">
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
            <span className="font-medium text-warning truncate">{rooms.find(r => r.id === currentRoom)?.name}</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-warning flex-shrink-0" />
            </motion.div>
            <span className="font-medium text-warning truncate">{rooms.find(r => r.id === destinationRoom)?.name}</span>
          </div>
        </div>
      )}

      {/* House Map - Large */}
      <div className="flex-1 flex items-center justify-center p-1.5 sm:p-2">
        <div className="relative w-full max-w-xs">
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

          <div className="grid grid-cols-2 gap-2 sm:gap-3">
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
                    relative p-3 sm:p-4 rounded-xl flex flex-col items-center gap-1.5 sm:gap-2 
                    border-2 transition-colors duration-200 min-h-[80px] sm:min-h-[100px]
                    ${isCurrentRoom 
                      ? 'border-primary bg-primary/10' 
                      : isDestination 
                        ? 'border-warning bg-warning/10' 
                        : 'border-border/40 bg-secondary/20 hover:border-primary/40'
                    }
                    ${canSelect ? 'cursor-pointer active:scale-[0.98]' : 'cursor-default opacity-70'}
                  `}
                >
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-colors ${
                    isCurrentRoom 
                      ? 'bg-primary/20 text-primary' 
                      : isDestination 
                        ? 'bg-warning/20 text-warning' 
                        : 'bg-secondary/50 text-muted-foreground'
                  }`}>
                    {roomIcons[room.icon]}
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium text-center leading-tight">{room.name}</span>
                  
                  {/* Robot indicator with pulse when current */}
                  {isCurrentRoom && (
                    <div className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2">
                      <motion.div
                        animate={isMoving ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                      </motion.div>
                    </div>
                  )}
                  {isDestination && !isCurrentRoom && (
                    <div className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <Navigation className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-warning" />
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
      <div className="text-center py-1.5 sm:py-2">
        <p className="text-[10px] sm:text-xs text-muted-foreground px-2">
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
