export type RoomId = 'living-room' | 'bedroom' | 'kitchen' | 'store-room';

export interface Room {
  id: RoomId;
  name: string;
  icon: string;
  position: { x: number; y: number };
}

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export type RobotMode = 'auto' | 'manual';

export type RobotStatus = 
  | 'idle'
  | 'moving'
  | 'obstacle_detected'
  | 'task_completed'
  | 'charging'
  | 'emergency_stop'
  | 'error';

export interface BluetoothDevice {
  id: string;
  name: string;
  rssi: number;
  isRobot: boolean;
}

export interface RobotState {
  bluetoothStatus: ConnectionStatus;
  wifiStatus: ConnectionStatus;
  currentRoom: RoomId | null;
  destinationRoom: RoomId | null;
  batteryLevel: number;
  signalStrength: number;
  mode: RobotMode;
  status: RobotStatus;
  speed: number;
  isMoving: boolean;
  isCharging: boolean;
  loadWeight: number; // kg
  maxLoadWeight: number; // kg
  displayMessage: string;
}

export interface StatusMessage {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: Date;
}

export type ControlDirection = 'forward' | 'backward' | 'left' | 'right' | 'stop';
