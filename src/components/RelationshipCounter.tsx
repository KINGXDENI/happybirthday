import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Heart } from 'lucide-react';

const ANNIVERSARY_DATE = new Date('2025-08-23T00:00:00');

export const RelationshipCounter = () => {
  const [timeElapsed, setTimeElapsed] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const difference = Date.now() - ANNIVERSARY_DATE.getTime();
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeElapsed({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-xl mx-auto mb-10 px-4"
    >
      {/* Cozy Vintage Label Plate Design */}
      <div 
        className="bg-white border border-zinc-200 p-5 rounded-2xl shadow-[0_15px_30px_rgba(139,92,26,0.06)] relative text-center text-[#2d2a29]"
        style={{
          backgroundImage: 'radial-gradient(circle_at_center, rgba(139,92,26,0.01) 0%, transparent 100%)',
        }}
      >
        {/* Washi Tape Accent */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-5 bg-[#eae1d0]/75 border border-dashed border-[#b8ab96]/30 rotate-[-1deg] shadow-sm pointer-events-none" />

        <div className="flex items-center justify-center gap-2 mb-3 border-b border-dashed border-zinc-200 pb-2.5">
          <Calendar size={14} className="text-pink-500" />
          <span className="font-mono text-[10px] tracking-wider text-zinc-400 uppercase">
            Our Love Calendar (Since 23 Agt 2025)
          </span>
          <Heart size={14} className="text-pink-500 fill-pink-500 animate-pulse" />
        </div>

        {/* Counter Display */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-sm mx-auto">
          {/* Days */}
          <div className="flex flex-col items-center">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#a16207]">
              {timeElapsed.days}
            </span>
            <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 mt-1">Days</span>
          </div>

          {/* Hours */}
          <div className="flex flex-col items-center">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#a16207]">
              {String(timeElapsed.hours).padStart(2, '0')}
            </span>
            <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 mt-1">Hours</span>
          </div>

          {/* Minutes */}
          <div className="flex flex-col items-center">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#a16207]">
              {String(timeElapsed.minutes).padStart(2, '0')}
            </span>
            <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 mt-1">Mins</span>
          </div>

          {/* Seconds */}
          <div className="flex flex-col items-center">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-pink-500">
              {String(timeElapsed.seconds).padStart(2, '0')}
            </span>
            <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 mt-1">Secs</span>
          </div>
        </div>

        {/* Decorative Quote */}
        <p className="font-handwriting text-xl sm:text-2xl text-zinc-500 leading-relaxed mt-4 italic">
          "Setiap detik yang terlewati, rasanya tetap sama... aku sayang kamu selalu. ❤️"
        </p>
      </div>
    </motion.div>
  );
};
