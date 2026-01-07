import { motion } from 'framer-motion';
import { Bluetooth, Map, Camera, Gamepad2, Activity } from 'lucide-react';

type TabId = 'bluetooth' | 'map' | 'camera' | 'control' | 'status';

interface BottomNavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs = [
  { id: 'bluetooth' as TabId, icon: Bluetooth, label: 'Connect' },
  { id: 'map' as TabId, icon: Map, label: 'Map' },
  { id: 'camera' as TabId, icon: Camera, label: 'Camera' },
  { id: 'control' as TabId, icon: Gamepad2, label: 'Control' },
  { id: 'status' as TabId, icon: Activity, label: 'Status' },
];

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-card border-t border-border/50 safe-area-bottom z-50">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`nav-item relative flex-1 ${isActive ? 'nav-item-active' : 'text-muted-foreground'}`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary/10 rounded-lg"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <Icon className={`w-5 h-5 relative z-10 ${isActive ? 'text-primary' : ''}`} />
              <span className="text-[10px] relative z-10">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export type { TabId };
