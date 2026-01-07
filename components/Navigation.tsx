
import React from 'react';
import { AppTab } from '../types';
import { Home, Sparkles, Image as ImageIcon, BookOpen, Music, Bell } from 'lucide-react';

interface NavigationProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: AppTab.DASHBOARD, label: 'Focus', icon: Home },
    { id: AppTab.VISION_BOARD, label: 'Vision', icon: ImageIcon },
    { id: AppTab.JOURNAL, label: 'Journal', icon: BookOpen },
    { id: AppTab.AUDIO, label: 'Meditate', icon: Music },
    { id: AppTab.REMINDERS, label: 'Reminders', icon: Bell },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 glass-panel rounded-full px-4 sm:px-6 py-3 flex items-center gap-4 sm:gap-8 z-50 shadow-2xl transition-all hover:border-purple-500/50">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${
              isActive ? 'text-purple-400 scale-110' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Icon size={20} className={isActive ? 'drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]' : ''} />
            <span className="hidden sm:block text-[10px] uppercase tracking-widest font-medium">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default Navigation;
