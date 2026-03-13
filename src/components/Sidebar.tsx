import { Town } from '../data/towns';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Calendar, X, Sparkles, Image as ImageIcon, Loader2, Search } from 'lucide-react';
import { useState, useMemo } from 'react';
import { generateTownPostcard } from '../services/historyService';

interface SidebarProps {
  towns: Town[];
  currentYear: number;
  onClose?: () => void;
  onSelectTown?: (town: Town) => void;
}

export default function Sidebar({ towns, currentYear, onClose, onSelectTown }: SidebarProps) {
  const [postcards, setPostcards] = useState<Record<string, string>>({});
  const [loadingPostcards, setLoadingPostcards] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");

  const handleGeneratePostcard = async (town: Town) => {
    const key = `${town.municipality}-${town.year}`;
    if (postcards[key]) return;

    setLoadingPostcards(prev => ({ ...prev, [key]: true }));
    const url = await generateTownPostcard(town.municipality, town.year);
    if (url) {
      setPostcards(prev => ({ ...prev, [key]: url }));
    }
    setLoadingPostcards(prev => ({ ...prev, [key]: false }));
  };

  const filteredTowns = useMemo(() => {
    return towns
      .filter(t => t.year <= currentYear)
      .filter(t => 
        t.municipality.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.county.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => b.year - a.year);
  }, [towns, currentYear, searchQuery]);

  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-100 shadow-xl w-full md:w-80">
      <div className="p-6 border-b border-gray-50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Municipalities</h2>
            <p className="text-sm text-gray-500 mt-1">
              {filteredTowns.length} formed by {currentYear}
            </p>
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              className="md:hidden p-2 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search towns or counties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-4">
        <AnimatePresence initial={false}>
          {filteredTowns.map((town) => (
            <motion.div
              key={`${town.municipality}-${town.year}`}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={() => onSelectTown?.(town)}
              className="p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group relative overflow-hidden cursor-pointer"
            >
              {/* Tooltip Overlay */}
              <div className="absolute inset-0 bg-gray-900/95 text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center z-10">
                {postcards[`${town.municipality}-${town.year}`] ? (
                  <div className="relative h-full w-full">
                    <img 
                      src={postcards[`${town.municipality}-${town.year}`]} 
                      alt="Historical Postcard" 
                      className="w-full h-full object-cover rounded-lg"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 backdrop-blur-sm rounded-b-lg">
                      <p className="text-[10px] text-blue-300 font-bold uppercase tracking-widest">AI Vision: {town.year}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-[10px] uppercase tracking-widest text-blue-400 font-bold mb-2">Detailed Info</div>
                    <div className="space-y-1 text-sm mb-4">
                      <p><span className="text-gray-400">County:</span> {town.county}</p>
                      <p><span className="text-gray-400">Type:</span> <span className="capitalize">{town.type}</span></p>
                      <p><span className="text-gray-400">Established:</span> {town.year}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGeneratePostcard(town);
                      }}
                      disabled={loadingPostcards[`${town.municipality}-${town.year}`]}
                      className="mt-auto flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white rounded-xl text-xs font-bold transition-colors pointer-events-auto"
                    >
                      {loadingPostcards[`${town.municipality}-${town.year}`] ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={14} />
                          <span>Generate AI Postcard</span>
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>

              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-mono font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                  {town.year}
                </span>
                <span className="text-[10px] uppercase tracking-tighter text-gray-400 font-bold">
                  {town.county}
                </span>
              </div>
              <h3 className="font-bold text-gray-800 group-hover:text-blue-700 transition-colors">
                {town.municipality}
              </h3>
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                <MapPin size={12} />
                <span className="capitalize">{town.type}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredTowns.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 py-20">
            <Calendar size={48} className="mb-4 opacity-20" />
            <p className="text-sm">Scrub the timeline to begin</p>
          </div>
        )}
      </div>
    </div>
  );
}
