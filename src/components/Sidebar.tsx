import { Town } from '../data/towns';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Calendar, X } from 'lucide-react';

interface SidebarProps {
  towns: Town[];
  currentYear: number;
  onClose?: () => void;
}

export default function Sidebar({ towns, currentYear, onClose }: SidebarProps) {
  const filteredTowns = towns
    .filter(t => t.year <= currentYear)
    .sort((a, b) => b.year - a.year);

  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-100 shadow-xl w-full md:w-80">
      <div className="p-6 border-b border-gray-50 flex items-center justify-between">
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
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-20 md:pb-4">
        <AnimatePresence initial={false}>
          {filteredTowns.map((town) => (
            <motion.div
              key={`${town.municipality}-${town.year}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group relative overflow-hidden"
            >
              {/* Tooltip Overlay */}
              <div className="absolute inset-0 bg-gray-900/95 text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center z-10 pointer-events-none">
                <div className="text-[10px] uppercase tracking-widest text-blue-400 font-bold mb-2">Detailed Info</div>
                <div className="space-y-1 text-sm">
                  <p><span className="text-gray-400">County:</span> {town.county}</p>
                  <p><span className="text-gray-400">Type:</span> <span className="capitalize">{town.type}</span></p>
                  <p><span className="text-gray-400">Established:</span> {town.year}</p>
                </div>
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
