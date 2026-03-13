import { motion } from 'motion/react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';

interface TimelineProps {
  minYear: number;
  maxYear: number;
  currentYear: number;
  onChange: (year: number) => void;
}

export default function Timeline({ minYear, maxYear, currentYear, onChange }: TimelineProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        if (currentYear < maxYear) {
          onChange(currentYear + 1);
        } else {
          setIsPlaying(false);
        }
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentYear, maxYear, onChange]);

  return (
    <div className="bg-white/80 backdrop-blur-xl p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-2xl border border-white/20">
      <div className="flex items-center gap-3 md:gap-6 mb-2 md:mb-4">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 shrink-0"
        >
          {isPlaying ? <Pause size={20} className="md:w-6 md:h-6" /> : <Play size={20} className="md:w-6 md:h-6 ml-1" />}
        </button>
        
        <button
          onClick={() => {
            setIsPlaying(false);
            onChange(minYear);
          }}
          className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors shrink-0"
          title="Reset"
        >
          <RotateCcw size={16} className="md:w-5 md:h-5" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between text-[10px] md:text-xs font-mono text-gray-400 mb-1 md:mb-2 uppercase tracking-widest">
            <span>{minYear}</span>
            <span className="text-blue-600 font-bold text-xs md:text-sm">{currentYear}</span>
            <span>{maxYear}</span>
          </div>
          <input
            type="range"
            min={minYear}
            max={maxYear}
            value={currentYear}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="w-full h-1.5 md:h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      </div>
      
      <div className="relative h-2 md:h-4 mt-1 md:mt-2 overflow-hidden rounded-full bg-gray-100">
        <motion.div
          className="absolute top-0 left-0 h-full bg-blue-600/20"
          initial={false}
          animate={{ width: `${((currentYear - minYear) / (maxYear - minYear)) * 100}%` }}
        />
      </div>
    </div>
  );
}
