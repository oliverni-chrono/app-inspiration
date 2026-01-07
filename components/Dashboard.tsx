
import React, { useState, useEffect } from 'react';
import { generateAffirmation } from '../services/geminiService';
import { Sparkles, RefreshCw, Star, BellPlus, CheckCircle2 } from 'lucide-react';

interface DashboardProps {
  onSchedule: (text: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSchedule }) => {
  const [affirmations, setAffirmations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('Abundance');
  const [scheduledId, setScheduledId] = useState<number | null>(null);

  const fetchAffirmations = async () => {
    setLoading(true);
    setScheduledId(null);
    try {
      const data = await generateAffirmation(category);
      setAffirmations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAffirmations();
  }, []);

  const handleScheduleClick = (aff: string, idx: number) => {
    onSchedule(aff);
    setScheduledId(idx);
    setTimeout(() => setScheduledId(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-serif italic mb-4 bg-gradient-to-r from-purple-200 to-indigo-300 bg-clip-text text-transparent">
          Align Your Frequency
        </h1>
        <p className="text-slate-400 tracking-widest uppercase text-sm">Today's Sacred Focus</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {['Abundance', 'Love', 'Career'].map((cat) => (
          <button
            key={cat}
            onClick={() => { setCategory(cat); fetchAffirmations(); }}
            className={`px-6 py-4 rounded-xl border transition-all ${
              category === cat 
                ? 'bg-purple-600/20 border-purple-500 text-purple-200' 
                : 'glass-panel border-transparent text-slate-400 hover:bg-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-6 relative">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <RefreshCw className="animate-spin text-purple-400" size={32} />
          </div>
        ) : (
          affirmations.map((aff, idx) => (
            <div 
              key={idx}
              className="glass-panel p-8 rounded-3xl float-animation shadow-xl group hover:border-purple-500/30 transition-all"
              style={{ animationDelay: `${idx * 1.5}s` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-900/40 p-3 rounded-full text-purple-400 shrink-0">
                    <Star size={20} />
                  </div>
                  <p className="text-2xl font-serif text-slate-100 leading-relaxed italic">
                    "{aff}"
                  </p>
                </div>
                
                <button
                  onClick={() => handleScheduleClick(aff, idx)}
                  className={`p-3 rounded-full transition-all shrink-0 ${
                    scheduledId === idx 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'hover:bg-purple-500/20 text-slate-400 hover:text-purple-400'
                  }`}
                  title="Schedule Reminder"
                >
                  {scheduledId === idx ? <CheckCircle2 size={24} /> : <BellPlus size={24} />}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-12 text-center">
        <button 
          onClick={fetchAffirmations}
          disabled={loading}
          className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-500 rounded-full font-semibold transition-all shadow-lg hover:shadow-purple-500/20 disabled:opacity-50"
        >
          <Sparkles size={18} />
          Refresh Alignment
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
