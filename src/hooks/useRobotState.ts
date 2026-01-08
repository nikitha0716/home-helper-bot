import { useState, useCallback } from 'react';
import { 
  RobotState, 
  RoomId, 
  ConnectionStatus, 
  RobotMode, 
  RobotStatus,
  StatusMessage,
  BluetoothDevice,
  ControlDirection
} from '@/types/robot';

const initialState: RobotState = {
  bluetoothStatus: 'connected',
  wifiStatus: 'disconnected',
  currentRoom: 'living-room',
  destinationRoom: null,
  batteryLevel: 85,
  signalStrength: 75,
  mode: 'auto',
  status: 'idle',
  speed: 50,
  isMoving: false,
};

export function useRobotState() {
  const [state, setState] = useState<RobotState>(initialState);
  const [messages, setMessages] = useState<StatusMessage[]>([
    {
      id: '1',
      type: 'info',
      message: 'System initialized',
      timestamp: new Date(),
    },
  ]);
  const [availableDevices, setAvailableDevices] = useState<BluetoothDevice[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const addMessage = useCallback((type: StatusMessage['type'], message: string) => {
    const newMessage: StatusMessage = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date(),
    };
    setMessages((prev) => [newMessage, ...prev].slice(0, 20));
  }, []);

  const scanForDevices = useCallback(async () => {
    setIsScanning(true);
    addMessage('info', 'Scanning for devices...');
    
    // Simulate scanning
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    const mockDevices: BluetoothDevice[] = [
      { id: 'robot-001', name: 'HomeBot-001', rssi: -45, isRobot: true },
      { id: 'device-002', name: 'Unknown Device', rssi: -72, isRobot: false },
      { id: 'device-003', name: 'Speaker', rssi: -58, isRobot: false },
    ];
    
    setAvailableDevices(mockDevices);
    setIsScanning(false);
    addMessage('success', `Found ${mockDevices.length} devices`);
  }, [addMessage]);

  const connectBluetooth = useCallback(async (deviceId: string) => {
    setState((prev) => ({ ...prev, bluetoothStatus: 'connecting' }));
    addMessage('info', 'Connecting to robot...');
    
    // Simulate connection
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setState((prev) => ({ ...prev, bluetoothStatus: 'connected' }));
    addMessage('success', 'Bluetooth connected successfully');
  }, [addMessage]);

  const disconnectBluetooth = useCallback(() => {
    setState((prev) => ({ ...prev, bluetoothStatus: 'disconnected' }));
    addMessage('info', 'Bluetooth disconnected');
  }, [addMessage]);

  const connectWifi = useCallback(async () => {
    setState((prev) => ({ ...prev, wifiStatus: 'connecting' }));
    addMessage('info', 'Connecting to camera stream...');
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setState((prev) => ({ ...prev, wifiStatus: 'connected' }));
    addMessage('success', 'Camera stream connected');
  }, [addMessage]);

  const disconnectWifi = useCallback(() => {
    setState((prev) => ({ ...prev, wifiStatus: 'disconnected' }));
    addMessage('info', 'Camera stream disconnected');
  }, [addMessage]);

  const setDestination = useCallback(async (roomId: RoomId) => {
    if (state.bluetoothStatus !== 'connected') {
      addMessage('error', 'Bluetooth not connected');
      return;
    }

    setState((prev) => ({ 
      ...prev, 
      destinationRoom: roomId, 
      status: 'moving',
      isMoving: true 
    }));
    addMessage('info', `Moving to ${roomId.replace('-', ' ')}`);

    // Simulate movement
    setTimeout(() => {
      setState((prev) => ({ 
        ...prev, 
        currentRoom: roomId,
        destinationRoom: null,
        status: 'task_completed',
        isMoving: false 
      }));
      addMessage('success', 'Task completed successfully');
      
      setTimeout(() => {
        setState((prev) => ({ ...prev, status: 'idle' }));
      }, 2000);
    }, 5000);
  }, [state.bluetoothStatus, addMessage]);

  const setMode = useCallback((mode: RobotMode) => {
    setState((prev) => ({ ...prev, mode }));
    addMessage('info', `Switched to ${mode} mode`);
  }, [addMessage]);

  const setSpeed = useCallback((speed: number) => {
    setState((prev) => ({ ...prev, speed }));
  }, []);

  const sendControl = useCallback((direction: ControlDirection) => {
    if (state.bluetoothStatus !== 'connected') {
      addMessage('error', 'Bluetooth not connected');
      return;
    }

    if (direction === 'stop') {
      setState((prev) => ({ ...prev, isMoving: false, status: 'idle' }));
      addMessage('warning', 'Robot stopped');
    } else {
      setState((prev) => ({ ...prev, isMoving: true, status: 'moving' }));
    }
  }, [state.bluetoothStatus, addMessage]);

  const emergencyStop = useCallback(() => {
    setState((prev) => ({ 
      ...prev, 
      isMoving: false, 
      status: 'idle',
      destinationRoom: null 
    }));
    addMessage('warning', 'EMERGENCY STOP activated');
  }, [addMessage]);

  return {
    state,
    messages,
    availableDevices,
    isScanning,
    scanForDevices,
    connectBluetooth,
    disconnectBluetooth,
    connectWifi,
    disconnectWifi,
    setDestination,
    setMode,
    setSpeed,
    sendControl,
    emergencyStop,
  };
}
