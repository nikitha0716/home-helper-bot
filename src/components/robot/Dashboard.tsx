import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bot,
  Battery,
  Signal,
  MapPin,
  Sofa,
  Bed,
  ChefHat,
  Package,
  Navigation,
  Hand,
  Zap,
  Gauge,
  Video,
  VideoOff,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { RobotState, RoomId, Room, ControlDirection, RobotMode, StatusMessage } from '@/types/robot';

interface DashboardProps {
  state: RobotState;
  messages: StatusMessage[];
  onSelectRoom: (roomId: RoomId) => void;
  onControl: (direction: ControlDirection) => void;
  onSpeedChange: (speed: number) => void;
  onModeChange: (mode: RobotMode) => void;
  onConnectWifi: () => void;
  onDisconnectWifi: () => void;
}

const rooms: Room[] = [
  { id: 'living-room', name: 'Living Room', icon: 'sofa', position: { x: 0, y: 0 } },
  { id: 'bedroom', name: 'Bedroom', icon: 'bed', position: { x: 1, y: 0 } },
  { id: 'kitchen', name: 'Kitchen', icon: 'chef', position: { x: 0, y: 1 } },
  { id: 'store-room', name: 'Store Room', icon: 'package', position: { x: 1, y: 1 } },
];

const roomIcons: Record<string, React.ReactNode> = {
  sofa: <Sofa className="w-5 h-5" />,
  bed: <Bed className="w-5 h-5" />,
  chef: <ChefHat className="w-5 h-5" />,
  package: <Package className="w-5 h-5" />,
};

export function Dashboard({
  state,
  messages,
  onSelectRoom,
  onControl,
  onSpeedChange,
  onModeChange,
  onConnectWifi,
  onDisconnectWifi,
}: DashboardProps) {
  const { currentRoom, destinationRoom, isMoving, mode, speed, status, batteryLevel, signalStrength, wifiStatus } = state;
  const isAutoMode = mode === 'auto';
  const isManualActive = mode === 'manual';

  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const handleJoystickMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !isManualActive) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const x = e.clientX - rect.left - centerX;
    const y = e.clientY - rect.top - centerY;
    
    const distance = Math.sqrt(x * x + y * y);
    const maxDistance = 40;
    
    if (distance > maxDistance) {
      const angle = Math.atan2(y, x);
      setJoystickPos({ x: Math.cos(angle) * maxDistance, y: Math.sin(angle) * maxDistance });
    } else {
      setJoystickPos({ x, y });
    }

    const threshold = 15;
    if (Math.abs(y) > Math.abs(x)) {
      if (y < -threshold) onControl('forward');
      else if (y > threshold) onControl('backward');
    } else {
      if (x > threshold) onControl('right');
      else if (x < -threshold) onControl('left');
    }
  };

  const handleJoystickRelease = () => {
    setIsDragging(false);
    setJoystickPos({ x: 0, y: 0 });
    onControl('stop');
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'idle': return { text: 'Ready', color: 'text-success', bg: 'bg-success/20' };
      case 'moving': return { text: 'Moving', color: 'text-primary', bg: 'bg-primary/20' };
      case 'obstacle_detected': return { text: 'Obstacle', color: 'text-warning', bg: 'bg-warning/20' };
      case 'emergency_stop': return { text: 'Stopped', color: 'text-destructive', bg: 'bg-destructive/20' };
      case 'task_completed': return { text: 'Complete', color: 'text-success', bg: 'bg-success/20' };
      default: return { text: 'Unknown', color: 'text-muted-foreground', bg: 'bg-secondary' };
    }
  };

  const statusLabel = getStatusLabel();
  const recentMessages = messages.slice(0, 5);

  return (
    <div className="flex flex-col gap-3 p-3 pb-24">
      {/* Top Status Bar */}
      <div className="glass-card p-3">
        <div className="flex items-center gap-3">
          <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center ${statusLabel.bg}`}>
            <Bot className={`w-6 h-6 ${statusLabel.color}`} />
            {status === 'moving' && (
              <motion.div 
                className="absolute -right-0.5 -top-0.5 w-2.5 h-2.5 rounded-full bg-primary"
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">HomeBot</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${statusLabel.bg} ${statusLabel.color}`}>
                {statusLabel.text}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span className="capitalize">{currentRoom?.replace('-', ' ') || 'Unknown'}</span>
              </span>
              {destinationRoom && (
                <span className="flex items-center gap-1 text-warning">
                  <Navigation className="w-3 h-3" />
                  <span className="capitalize">{destinationRoom.replace('-', ' ')}</span>
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1 text-xs">
              <Battery className={`w-3.5 h-3.5 ${batteryLevel > 20 ? 'text-success' : 'text-destructive'}`} />
              <span className="font-mono tabular-nums">{batteryLevel}%</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Signal className="w-3.5 h-3.5" />
              <span className="font-mono tabular-nums">{signalStrength}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onModeChange('auto')}
          className={`p-3 rounded-xl border-2 transition-colors duration-200 ${
            mode === 'auto' 
              ? 'bg-primary/20 border-primary' 
              : 'bg-secondary/30 border-border/30 hover:border-border/50'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Zap className={`w-4 h-4 ${mode === 'auto' ? 'text-primary' : 'text-muted-foreground'}`} />
            <span className={`text-sm font-medium ${mode === 'auto' ? 'text-primary' : 'text-muted-foreground'}`}>Auto</span>
          </div>
        </button>
        <button
          onClick={() => onModeChange('manual')}
          className={`p-3 rounded-xl border-2 transition-colors duration-200 ${
            mode === 'manual' 
              ? 'bg-warning/20 border-warning' 
              : 'bg-secondary/30 border-border/30 hover:border-border/50'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Hand className={`w-4 h-4 ${mode === 'manual' ? 'text-warning' : 'text-muted-foreground'}`} />
            <span className={`text-sm font-medium ${mode === 'manual' ? 'text-warning' : 'text-muted-foreground'}`}>Manual</span>
          </div>
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* House Map */}
        <div className={`glass-card p-2 ${!isAutoMode ? 'opacity-50' : ''}`}>
          <div className="text-xs font-medium mb-2 text-center text-muted-foreground">Select Destination</div>
          <div className="grid grid-cols-2 gap-1.5">
            {rooms.map((room) => {
              const isCurrentRoom = currentRoom === room.id;
              const isDestination = destinationRoom === room.id;
              const canSelect = !isMoving && isAutoMode && !isCurrentRoom;
              
              return (
                <button
                  key={room.id}
                  onClick={() => canSelect && onSelectRoom(room.id)}
                  disabled={!canSelect}
                  className={`
                    relative p-2.5 rounded-lg flex flex-col items-center gap-1 transition-all duration-200 border
                    ${isCurrentRoom ? 'border-primary bg-primary/10' : 'border-border/30 bg-secondary/20'}
                    ${isDestination ? 'border-warning bg-warning/10' : ''}
                    ${canSelect ? 'hover:border-primary/50 cursor-pointer active:scale-95' : 'cursor-default'}
                  `}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    isCurrentRoom ? 'bg-primary/20 text-primary' : 
                    isDestination ? 'bg-warning/20 text-warning' : 
                    'bg-secondary/50 text-muted-foreground'
                  }`}>
                    {roomIcons[room.icon]}
                  </div>
                  <span className="text-[10px] font-medium leading-tight text-center">{room.name}</span>
                  
                  {isCurrentRoom && (
                    <div className="absolute top-1 right-1">
                      <Bot className="w-3 h-3 text-primary" />
                    </div>
                  )}
                  {isDestination && !isCurrentRoom && (
                    <div className="absolute top-1 right-1">
                      <Navigation className="w-3 h-3 text-warning" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Joystick Control */}
        <div className={`glass-card p-2 flex flex-col items-center ${!isManualActive ? 'opacity-50' : ''}`}>
          <div className="text-xs font-medium mb-2 text-muted-foreground">Joystick Control</div>
          <div 
            className="relative w-28 h-28 rounded-full bg-secondary/30 border border-border/30"
            onPointerMove={handleJoystickMove}
            onPointerUp={handleJoystickRelease}
            onPointerLeave={handleJoystickRelease}
          >
            {/* Crosshair */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-px h-full bg-border/20" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-full h-px bg-border/20" />
            </div>
            
            {/* Direction indicators */}
            <span className="absolute top-1.5 left-1/2 -translate-x-1/2 text-[8px] text-muted-foreground/60">▲</span>
            <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-[8px] text-muted-foreground/60">▼</span>
            <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[8px] text-muted-foreground/60">◀</span>
            <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[8px] text-muted-foreground/60">▶</span>
            
            {/* Inner Knob */}
            <motion.div
              className={`absolute w-11 h-11 rounded-full top-1/2 left-1/2 transition-colors duration-150 ${
                isDragging ? 'bg-primary' : 'bg-primary/80'
              } ${!isManualActive ? 'pointer-events-none' : 'cursor-pointer'}`}
              style={{
                x: joystickPos.x - 22,
                y: joystickPos.y - 22,
                boxShadow: isDragging ? '0 0 16px hsl(var(--primary) / 0.5)' : '0 0 8px hsl(var(--primary) / 0.3)'
              }}
              onPointerDown={(e) => {
                if (isManualActive) {
                  setIsDragging(true);
                  e.currentTarget.setPointerCapture(e.pointerId);
                }
              }}
            />
            
            {!isManualActive && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[9px] text-muted-foreground text-center px-2">Switch to Manual</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Speed Control */}
      <div className={`glass-card p-3 ${!isManualActive ? 'opacity-50' : ''}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Speed</span>
          </div>
          <span className="text-sm font-mono text-primary tabular-nums">{speed}%</span>
        </div>
        <Slider
          value={[speed]}
          onValueChange={([val]) => onSpeedChange(val)}
          max={100}
          min={10}
          step={10}
          disabled={!isManualActive}
        />
      </div>

      {/* Camera Toggle */}
      <div className="glass-card p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {wifiStatus === 'connected' ? (
              <Video className="w-4 h-4 text-primary" />
            ) : (
              <VideoOff className="w-4 h-4 text-muted-foreground" />
            )}
            <span className="text-sm font-medium">Camera Feed</span>
          </div>
          <button
            onClick={wifiStatus === 'connected' ? onDisconnectWifi : onConnectWifi}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              wifiStatus === 'connected'
                ? 'bg-primary/20 text-primary hover:bg-primary/30'
                : 'bg-secondary hover:bg-secondary/80 text-muted-foreground'
            }`}
          >
            <span className="flex items-center gap-1.5">
              {wifiStatus === 'connected' ? (
                <>
                  <Wifi className="w-3 h-3" /> Connected
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3" /> Connect
                </>
              )}
            </span>
          </button>
        </div>
        {wifiStatus !== 'connected' && (
          <p className="text-xs text-muted-foreground mt-2">
            Camera unavailable – Bluetooth control active
          </p>
        )}
      </div>

      {/* Activity Log */}
      <div className="glass-card p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted-foreground">Recent Activity</span>
          <span className="text-[10px] text-muted-foreground">{messages.length} events</span>
        </div>
        <div className="space-y-1">
          {recentMessages.length === 0 ? (
            <p className="text-xs text-muted-foreground/60 text-center py-2">No activity yet</p>
          ) : (
            recentMessages.map((msg) => (
              <div key={msg.id} className="flex items-center gap-2 py-1">
                <div className={`w-1.5 h-1.5 rounded-full ${
                  msg.type === 'success' ? 'bg-success' :
                  msg.type === 'warning' ? 'bg-warning' :
                  msg.type === 'error' ? 'bg-destructive' :
                  'bg-primary'
                }`} />
                <span className="text-xs flex-1 truncate">{msg.message}</span>
                <span className="text-[10px] text-muted-foreground font-mono">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
