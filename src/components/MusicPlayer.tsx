import { motion } from 'framer-motion';
import { Play, Pause, Music } from 'lucide-react';
import { songDetails } from '../data';

interface MusicPlayerProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
}

const MusicPlayer = ({ isPlaying, onTogglePlay }: MusicPlayerProps) => {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="fixed top-5 right-5 z-50 select-none"
    >
      {/* Washi Tape holding the player */}
      <div className="absolute -top-3.5 left-4 w-12 h-3.5 bg-[#eae1d0]/80 border border-dashed border-[#b8ab96]/30 shadow-xs z-10 rotate-[-4deg] pointer-events-none" />
      
      {/* Paper Tag Music Player */}
      <div 
        onClick={onTogglePlay}
        className="bg-[#faf6ee] border border-[#d5ccb6] px-3.5 py-2 rounded-xl flex items-center space-x-2.5 shadow-[2px_5px_15px_rgba(139,92,26,0.08)] cursor-pointer hover:bg-[#f5ebd6] active:scale-95 transition-all duration-300 text-[#2d2a29] rotate-[1.5deg] hover:rotate-0"
      >
        {/* Rotating Album Cover / Vinyl (Cozy Retro style) */}
        <motion.div
          animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
          transition={isPlaying ? { duration: 8, repeat: Infinity, ease: "linear" } : { duration: 0.5 }}
          className="w-7 h-7 rounded-full overflow-hidden border border-[#d5ccb6] flex-shrink-0 flex items-center justify-center bg-[#eae1d0] relative"
        >
          {songDetails.cover ? (
            <img src={songDetails.cover} alt="album art" className="w-full h-full object-cover grayscale-[20%]" />
          ) : (
            <Music size={12} className="text-zinc-600" />
          )}
          {/* Spindle hole */}
          <div className="absolute w-1.5 h-1.5 bg-[#faf6ee] rounded-full border border-[#d5ccb6]" />
        </motion.div>
        
        {/* Song info (Monospace / Typewriter font) */}
        <div className="flex flex-col min-w-0 max-w-[90px] sm:max-w-[120px]">
          <h4 className="text-[10px] sm:text-xs font-mono font-bold truncate text-[#2d2a29]">{songDetails.title}</h4>
          <p className="text-[9px] sm:text-[10px] font-mono text-zinc-500 truncate">{songDetails.artist}</p>
        </div>

        {/* Play/Pause Button */}
        <div className="flex-shrink-0 text-[#a16207]">
          {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
        </div>
      </div>
    </motion.div>
  );
};

export default MusicPlayer;
