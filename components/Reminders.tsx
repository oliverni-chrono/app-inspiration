
import React, { useState } from 'react';
import { Reminder } from '../types';
import { Clock, Trash2, Plus, BellRing, Settings, Info } from 'lucide-react';

interface RemindersProps {
  reminders: Reminder[];
  onAdd: (reminder: Omit<Reminder, 'id'>) => void;
  onRemove: (id: string) => void;
  onToggle: (id: string) => void;
}

const Reminders: React.FC<RemindersProps> = ({ reminders, onAdd, onRemove, onToggle }) => {
  const [newAffirmation, setNewAffirmation] = useState('');
  const [newTime, setNewTime] = useState('08:00');
  const [showAdd, setShowAdd] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAffirmation.trim()) return;
    onAdd({ affirmation: newAffirmation, time: newTime, isActive: true });
    setNewAffirmation('');
    setShowAdd(false);
  };

  const requestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification("Cosmic Connection Established", {
          body: "You will receive reminders when your frequency needs alignment.",
          icon: "/favicon.ico"
        });
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-12 text-center">
        <h2 className="text-4xl font-serif italic mb-4">Manifestation Reminders</h2>
        <p className="text-slate-400 uppercase tracking-widest text-xs">Maintain your high vibration throughout the day</p>
      </header>

      <div className="mb-8 flex justify-center gap-4">
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-full flex items-center gap-2 transition-all shadow-lg"
        >
          <Plus size={18} />
          Add Custom Affirmation
        </button>
        <button
          onClick={requestPermission}
          className="glass-panel text-slate-300 px-6 py-3 rounded-full flex items-center gap-2 hover:bg-white/10 transition-all border border-slate-700"
        >
          <BellRing size={18} />
          Enable Notifications
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-3xl mb-12 animate-in zoom-in duration-300">
          <div className="space-y-6">
            <div>
              <label className="block text-slate-400 text-sm mb-2 uppercase tracking-widest">Affirmation</label>
              <textarea
                value={newAffirmation}
                onChange={(e) => setNewAffirmation(e.target.value)}
                placeholder="I am worthy of all the abundance flowing into my life..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-slate-100 outline-none focus:border-purple-500 transition-all min-h-[100px]"
              />
            </div>
            <div className="flex flex-wrap gap-6 items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-slate-400 text-sm mb-2 uppercase tracking-widest">Sacred Time</label>
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-4">
                  <Clock className="text-purple-400" size={20} />
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="bg-transparent text-slate-100 outline-none w-full cursor-pointer"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="px-8 py-4 bg-purple-600 hover:bg-purple-500 rounded-2xl font-semibold transition-all shadow-lg"
              >
                Set Intention
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {reminders.length === 0 ? (
          <div className="text-center py-20 glass-panel rounded-3xl opacity-50 border-dashed">
            <Info size={48} className="mx-auto mb-4 text-slate-500" />
            <p className="text-slate-400 italic">No reminders scheduled. Use the 'Focus' tab or add one above.</p>
          </div>
        ) : (
          reminders.map((reminder) => (
            <div 
              key={reminder.id}
              className={`glass-panel p-6 rounded-2xl flex items-center justify-between gap-6 transition-all border-l-4 ${
                reminder.isActive ? 'border-l-purple-500' : 'border-l-transparent opacity-50'
              }`}
            >
              <div className="flex-1">
                <p className="text-lg font-serif italic text-slate-100 mb-1 line-clamp-2">"{reminder.affirmation}"</p>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Clock size={14} />
                  <span>Daily at {reminder.time}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onToggle(reminder.id)}
                  className={`w-12 h-6 rounded-full transition-all relative ${
                    reminder.isActive ? 'bg-purple-600' : 'bg-slate-700'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                    reminder.isActive ? 'left-7' : 'left-1'
                  }`} />
                </button>
                <button
                  onClick={() => onRemove(reminder.id)}
                  className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-12 p-6 glass-panel rounded-3xl bg-indigo-900/10 border-indigo-500/20">
        <h4 className="text-indigo-300 font-semibold mb-2 flex items-center gap-2">
          <Settings size={16} />
          Pro-Tip
        </h4>
        <p className="text-sm text-slate-400">
          Reminders work best when the app is open in a background tab. Set your affirmations for transition periods in your day: waking up, lunch break, and before sleep.
        </p>
      </div>
    </div>
  );
};

export default Reminders;
