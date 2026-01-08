import { useState, useCallback } from 'react';
import { useRobotState } from '@/hooks/useRobotState';
import { Header } from '@/components/robot/Header';
import { BluetoothScreen } from '@/components/robot/BluetoothScreen';
import { DestinationDialog } from '@/components/robot/DestinationDialog';
import { FloatingEmergencyStop } from '@/components/robot/FloatingEmergencyStop';
import { Dashboard } from '@/components/robot/Dashboard';
import { RoomId } from '@/types/robot';

const RobotControlApp = () => {
  const [selectedDestination, setSelectedDestination] = useState<RoomId | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isSimulation, setIsSimulation] = useState(true);

  const {
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
  } = useRobotState();

  const handleSelectRoom = useCallback((roomId: RoomId) => {
    setSelectedDestination(roomId);
    setShowConfirmDialog(true);
  }, []);

  const handleConfirmDestination = useCallback(() => {
    if (selectedDestination) {
      setDestination(selectedDestination);
      setShowConfirmDialog(false);
      setSelectedDestination(null);
    }
  }, [selectedDestination, setDestination]);

  const handleCancelDestination = useCallback(() => {
    setShowConfirmDialog(false);
    setSelectedDestination(null);
  }, []);

  const handleToggleSimulation = useCallback(() => {
    setIsSimulation((prev) => !prev);
  }, []);

  const isConnected = state.bluetoothStatus === 'connected';

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header - Fixed */}
      <Header
        bluetoothStatus={state.bluetoothStatus}
        wifiStatus={state.wifiStatus}
        batteryLevel={state.batteryLevel}
        isSimulation={isSimulation}
        onToggleSimulation={handleToggleSimulation}
      />

      {/* Main Content - Fills remaining space, no external scroll */}
      <main className="flex-1 min-h-0 overflow-hidden">
        {!isConnected ? (
          <BluetoothScreen
            status={state.bluetoothStatus}
            devices={availableDevices}
            isScanning={isScanning}
            onScan={scanForDevices}
            onConnect={connectBluetooth}
            onDisconnect={disconnectBluetooth}
          />
        ) : (
          <Dashboard
            state={state}
            messages={messages}
            onSelectRoom={handleSelectRoom}
            onControl={sendControl}
            onSpeedChange={setSpeed}
            onModeChange={setMode}
            onConnectWifi={connectWifi}
            onDisconnectWifi={disconnectWifi}
          />
        )}
      </main>

      {/* Floating Emergency Stop - Fixed position, always visible when connected */}
      <FloatingEmergencyStop
        onStop={emergencyStop}
        isBluetoothConnected={isConnected}
        isVisible={isConnected}
      />

      {/* Destination Confirmation Dialog */}
      <DestinationDialog
        isOpen={showConfirmDialog}
        selectedRoom={selectedDestination}
        onConfirm={handleConfirmDestination}
        onCancel={handleCancelDestination}
      />
    </div>
  );
};

export default RobotControlApp;
