import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { introTexts } from '../data';

interface CinematicIntroProps {
  onComplete: () => void;
}

const CinematicIntro = ({ onComplete }: CinematicIntroProps) => {
  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport to adjust letter-spacing dynamically
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (index < introTexts.length) {
      const timer = setTimeout(() => {
        setIndex(prev => prev + 1);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      onComplete();
    }
  }, [index, onComplete]);

  return (
    <div className="h-screen w-full bg-black flex items-center justify-center overflow-hidden px-6">
      <AnimatePresence mode="wait">
        {index < introTexts.length && (
          <motion.h1
            key={index}
            initial={{ opacity: 0, letterSpacing: isMobile ? "0.1em" : "0.2em" }}
            animate={{ opacity: 1, letterSpacing: isMobile ? "0.22em" : "0.5em" }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="text-white text-base sm:text-xl md:text-3xl font-serif text-center uppercase select-none leading-relaxed"
          >
            {introTexts[index]}
          </motion.h1>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CinematicIntro;
