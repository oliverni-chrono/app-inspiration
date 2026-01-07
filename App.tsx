
import React, { useState, useEffect, useRef } from 'react';
import { AppTab, Reminder } from './types';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import VisionBoard from './components/VisionBoard';
import Reminders from './components/Reminders';
import { Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem('manifest_reminders');
    return saved ? JSON.parse(saved) : [];
  });
  
  const lastCheckedRef = useRef<string | null>(null);

  // Sync reminders with local storage
  useEffect(() => {
    localStorage.setItem('manifest_reminders', JSON.stringify(reminders));
  }, [reminders]);

  // Background check for notifications
  useEffect(() => {
    const checkInterval = setInterval(() => {
      const now = new Date();
      const currentHHMM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      if (lastCheckedRef.current === currentHHMM) return;
      lastCheckedRef.current = currentHHMM;

      const due = reminders.find(r => r.isActive && r.time === currentHHMM);
      if (due) {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification("Your Manifestation is Calling", {
            body: due.affirmation,
            icon: '/favicon.ico'
          });
        } else {
          // In-app backup
          console.log("TIME TO MANIFEST:", due.affirmation);
        }
      }
    }, 15000); // Check every 15 seconds

    return () => clearInterval(checkInterval);
  }, [reminders]);

  const addReminder = (data: Omit<Reminder, 'id'>) => {
    const newRem: Reminder = {
      ...data,
      id: Date.now().toString(),
    };
    setReminders(prev => [newRem, ...prev]);
  };

  const removeReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const toggleReminder = (id: string) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r));
  };

  const scheduleFromDashboard = (text: string) => {
    // Default to a standard manifest time or 1 hour from now
    const now = new Date();
    const hhmm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    addReminder({
      affirmation: text,
      time: hhmm,
      isActive: true
    });
  };

  return (
    <div className="min-h-screen pb-32">
      <header className="p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="bg-purple-600 p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-purple-500/20">
            <Sparkles className="text-white" size={24} />
          </div>
          <span className="text-xl font-serif font-bold tracking-tighter italic">ManifestAI</span>
        </div>
      </header>

      <main>
        {activeTab === AppTab.DASHBOARD && (
          <Dashboard onSchedule={scheduleFromDashboard} />
        )}
        {activeTab === AppTab.VISION_BOARD && (
          <VisionBoard />
        )}
        {activeTab === AppTab.REMINDERS && (
          <Reminders 
            reminders={reminders}
            onAdd={addReminder}
            onRemove={removeReminder}
            onToggle={toggleReminder}
          />
        )}
        {(activeTab === AppTab.JOURNAL || activeTab === AppTab.AUDIO) && (
          <div className="flex flex-col items-center justify-center py-40 opacity-50">
            <p className="text-2xl font-serif italic mb-2">Sacred Space Coming Soon</p>
            <p className="text-sm tracking-widest uppercase">Under Cosmic Construction</p>
          </div>
        )}
      </main>

      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default App;
