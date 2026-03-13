import { useState, useMemo, useEffect } from 'react';
import Map from './components/Map';
import Timeline from './components/Timeline';
import Sidebar from './components/Sidebar';
import { NJ_TOWNS } from './data/towns';
import { motion, AnimatePresence } from 'motion/react';
import { Map as MapIcon, Info, List, X, Sparkles, History } from 'lucide-react';
import { getYearlyInsight } from './services/historyService';

export default function App() {
  const minYear = useMemo(() => Math.min(...NJ_TOWNS.map(t => t.year)), []);
  const maxYear = useMemo(() => Math.max(...NJ_TOWNS.map(t => t.year)), []);
  const [currentYear, setCurrentYear] = useState(minYear);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [insight, setInsight] = useState<string>("");
  const [isInsightLoading, setIsInsightLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setIsInsightLoading(true);
      const text = await getYearlyInsight(currentYear);
      setInsight(text);
      setIsInsightLoading(false);
    }, 1000); // Debounce to avoid too many API calls while scrubbing

    return () => clearTimeout(timer);
  }, [currentYear]);

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] w-full bg-[#fdfdfd] text-gray-900 overflow-hidden font-sans">
      {/* Main Content */}
      <main className="flex-1 flex flex-col relative min-w-0 h-full pb-[env(safe-area-inset-bottom)]">
        {/* Header */}
        <header className="px-4 md:px-8 py-4 md:py-6 flex items-center justify-between bg-white/50 backdrop-blur-md border-b border-gray-100 z-[1002]">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <MapIcon size={20} className="md:w-6 md:h-6" />
            </div>
            <div>
              <h1 className="text-lg md:text-2xl font-black tracking-tight text-gray-900 uppercase">NJ Origins</h1>
              <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Municipal Formation</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 md:gap-8">
            <div className="hidden sm:block text-right">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5 md:mb-1">Total Towns</div>
              <div className="text-sm md:text-xl font-mono font-bold text-gray-900">{NJ_TOWNS.length}</div>
            </div>
            <div className="hidden sm:block h-8 w-px bg-gray-100" />
            <div className="text-right">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5 md:mb-1">Current Year</div>
              <div className="text-sm md:text-xl font-mono font-bold text-blue-600">{currentYear}</div>
            </div>
            
            {/* Mobile Sidebar Toggle */}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
            >
              {isSidebarOpen ? <X size={20} /> : <List size={20} />}
            </button>
          </div>
        </header>

        {/* Map Area */}
        <div className="flex-1 relative overflow-hidden">
          <Map towns={NJ_TOWNS} currentYear={currentYear} />
          
          {/* AI Historian Panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentYear}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute top-24 md:top-32 left-4 md:left-8 z-[1000] max-w-xs"
            >
              <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-amber-100 text-amber-600 rounded-lg">
                    <History size={14} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">AI Historian</span>
                  {isInsightLoading && (
                    <motion.div
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="w-1.5 h-1.5 bg-amber-400 rounded-full ml-auto"
                    />
                  )}
                </div>
                <p className="text-xs leading-relaxed text-gray-700 italic">
                  "{insight || "Observing the landscape..."}"
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Floating Timeline Control */}
          <div className="absolute bottom-[calc(3rem+env(safe-area-inset-bottom))] md:bottom-10 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 md:px-6 z-[1000]">
            <Timeline 
              minYear={minYear} 
              maxYear={maxYear} 
              currentYear={currentYear} 
              onChange={setCurrentYear} 
            />
          </div>
        </div>
      </main>

      {/* Sidebar - Responsive Overlay on Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Mobile Sidebar Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[2000] md:hidden"
            />
            {/* Mobile Sidebar Content */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-[100dvh] z-[2001] w-full sm:w-80 shadow-2xl md:hidden"
            >
              <Sidebar towns={NJ_TOWNS} currentYear={currentYear} onClose={() => setIsSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-80 h-full border-l border-gray-100">
        <Sidebar towns={NJ_TOWNS} currentYear={currentYear} />
      </div>

      {/* Info Overlay (Hidden on small mobile) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-6 right-6 md:right-[340px] z-[1001] hidden sm:block"
      >
        <div className="group relative">
          <div className="w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-200 transition-all cursor-help shadow-sm">
            <Info size={16} />
          </div>
          <div className="absolute bottom-full right-0 mb-4 w-64 p-4 bg-gray-900 text-white text-xs rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-2xl">
            <p className="leading-relaxed">
              This visualization tracks the official incorporation dates of New Jersey's municipalities. 
              Scrub the timeline to see the state's administrative landscape evolve from the 17th century to the modern era.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

