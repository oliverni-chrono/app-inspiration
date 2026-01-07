
import React, { useState } from 'react';
import { generateVisionImage } from '../services/geminiService';
import { ImageIcon, Wand2, Loader2, Download, Trash2 } from 'lucide-react';

const VisionBoard: React.FC = () => {
  const [dream, setDream] = useState('');
  const [visionItems, setVisionItems] = useState<{id: string, url: string, dream: string}[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Manifestation generation using gemini-2.5-flash-image
  const handleGenerate = async () => {
    if (!dream.trim()) return;
    setIsGenerating(true);
    try {
      const url = await generateVisionImage(dream);
      if (url) {
        setVisionItems(prev => [{ id: Date.now().toString(), url, dream }, ...prev]);
        setDream('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const removeItem = (id: string) => {
    setVisionItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 animate-in fade-in duration-700">
      <header className="mb-12 text-center">
        <h2 className="text-4xl font-serif italic mb-4">Vision Sanctuary</h2>
        <p className="text-slate-400">Describe your reality, witness its manifestation</p>
      </header>

      <div className="glass-panel p-1 rounded-3xl mb-12 max-w-2xl mx-auto">
        <div className="flex gap-2">
          <input
            type="text"
            value={dream}
            onChange={(e) => setDream(e.target.value)}
            placeholder="I am living in my dream home by the ocean..."
            className="flex-1 bg-transparent px-6 py-4 outline-none text-slate-100 placeholder:text-slate-500"
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !dream}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-4 rounded-2xl flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Wand2 size={18} />}
            Visualize
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {visionItems.map((item) => (
          <div key={item.id} className="group relative glass-panel p-2 rounded-3xl overflow-hidden hover:border-indigo-500/50 transition-all duration-500">
            <div className="aspect-square rounded-2xl overflow-hidden mb-4 relative">
              <img src={item.url} alt={item.dream} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button className="bg-white/20 backdrop-blur p-3 rounded-full hover:bg-white/40">
                  <Download size={20} className="text-white" />
                </button>
                <button onClick={() => removeItem(item.id)} className="bg-red-500/20 backdrop-blur p-3 rounded-full hover:bg-red-500/40">
                  <Trash2 size={20} className="text-white" />
                </button>
              </div>
            </div>
            <div className="px-4 pb-4">
              <p className="text-sm text-slate-300 italic line-clamp-2">"{item.dream}"</p>
            </div>
          </div>
        ))}

        {visionItems.length === 0 && !isGenerating && (
          <div className="col-span-full py-20 text-center glass-panel rounded-3xl border-dashed">
            <ImageIcon size={48} className="mx-auto mb-4 text-slate-500" />
            <p className="text-slate-400 italic">No visions manifested yet. Describe your dream above to begin.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisionBoard;
