import { useState, useMemo } from 'react';
import Map from './components/Map';
import Timeline from './components/Timeline';
import Sidebar from './components/Sidebar';
import { NJ_TOWNS } from './data/towns';
import { motion } from 'motion/react';
import { Map as MapIcon, Info } from 'lucide-react';

export default function App() {
  const minYear = useMemo(() => Math.min(...NJ_TOWNS.map(t => t.year)), []);
  const maxYear = useMemo(() => Math.max(...NJ_TOWNS.map(t => t.year)), []);
  const [currentYear, setCurrentYear] = useState(minYear);

  return (
    <div className="flex h-screen w-full bg-[#fdfdfd] text-gray-900 overflow-hidden font-sans">
      {/* Main Content */}
      <main className="flex-1 flex flex-col relative min-w-0">
        {/* Header */}
        <header className="px-8 py-6 flex items-center justify-between bg-white/50 backdrop-blur-md border-b border-gray-100 z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <MapIcon size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-gray-900 uppercase">NJ Origins</h1>
              <p className="text-xs font-mono text-gray-400 uppercase tracking-widest">Municipal Formation Timeline</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <div className="text-right">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Towns</div>
              <div className="text-xl font-mono font-bold text-gray-900">{NJ_TOWNS.length}</div>
            </div>
            <div className="h-8 w-px bg-gray-100" />
            <div className="text-right">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Time Span</div>
              <div className="text-xl font-mono font-bold text-gray-900">{minYear} – {maxYear}</div>
            </div>
          </div>
        </header>

        {/* Map Area */}
        <div className="flex-1 p-6 relative">
          <Map towns={NJ_TOWNS} currentYear={currentYear} />
          
          {/* Floating Timeline Control */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 z-[1000]">
            <Timeline 
              minYear={minYear} 
              maxYear={maxYear} 
              currentYear={currentYear} 
              onChange={setCurrentYear} 
            />
          </div>
        </div>
      </main>

      {/* Sidebar */}
      <Sidebar towns={NJ_TOWNS} currentYear={currentYear} />

      {/* Info Overlay (Optional/Decorative) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-6 right-[340px] z-50"
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

