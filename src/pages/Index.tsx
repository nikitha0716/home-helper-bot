import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRobotState } from '@/hooks/useRobotState';
import { Header } from '@/components/robot/Header';
import { BottomNavigation, TabId } from '@/components/robot/BottomNavigation';
import { BluetoothScreen } from '@/components/robot/BluetoothScreen';
import { HouseMap } from '@/components/robot/HouseMap';
import { CameraView } from '@/components/robot/CameraView';
import { ManualControl } from '@/components/robot/ManualControl';
import { StatusPanel } from '@/components/robot/StatusPanel';
import { DestinationDialog } from '@/components/robot/DestinationDialog';
import { FloatingEmergencyStop } from '@/components/robot/FloatingEmergencyStop';
import { RoomId } from '@/types/robot';

const RobotControlApp = () => {
  const [activeTab, setActiveTab] = useState<TabId>('bluetooth');
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
      setActiveTab('map');
    }
  }, [selectedDestination, setDestination]);

  const handleCancelDestination = useCallback(() => {
    setShowConfirmDialog(false);
    setSelectedDestination(null);
  }, []);

  const handleToggleSimulation = useCallback(() => {
    setIsSimulation((prev) => !prev);
  }, []);

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  // Show floating stop on certain screens
  const showFloatingStop = activeTab !== 'bluetooth' && activeTab !== 'status';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <Header
        bluetoothStatus={state.bluetoothStatus}
        wifiStatus={state.wifiStatus}
        batteryLevel={state.batteryLevel}
        isSimulation={isSimulation}
        onToggleSimulation={handleToggleSimulation}
      />

      {/* Main Content */}
      <main className="flex-1 pb-20 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {activeTab === 'bluetooth' && (
              <BluetoothScreen
                status={state.bluetoothStatus}
                devices={availableDevices}
                isScanning={isScanning}
                onScan={scanForDevices}
                onConnect={connectBluetooth}
                onDisconnect={disconnectBluetooth}
              />
            )}

            {activeTab === 'map' && (
              <HouseMap
                state={state}
                onSelectRoom={handleSelectRoom}
              />
            )}

            {activeTab === 'camera' && (
              <CameraView
                state={state}
                onConnectWifi={connectWifi}
                onDisconnectWifi={disconnectWifi}
                onControl={sendControl}
                onSpeedChange={setSpeed}
                onModeChange={setMode}
                onEmergencyStop={emergencyStop}
              />
            )}

            {activeTab === 'control' && (
              <ManualControl
                state={state}
                onControl={sendControl}
                onSpeedChange={setSpeed}
                onModeChange={setMode}
                onEmergencyStop={emergencyStop}
              />
            )}

            {activeTab === 'status' && (
              <StatusPanel
                state={state}
                messages={messages}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating Emergency Stop */}
      <FloatingEmergencyStop
        onStop={emergencyStop}
        isBluetoothConnected={state.bluetoothStatus === 'connected'}
        isVisible={showFloatingStop}
      />

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />

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
