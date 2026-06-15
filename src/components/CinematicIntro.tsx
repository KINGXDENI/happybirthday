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

  const playTransitionSound = (direction: 'in' | 'out') => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = audioCtx.currentTime;

      if (direction === 'in') {
        // Oscillator 1: Sweet high-pitch chime
        const osc1 = audioCtx.createOscillator();
        const gain1 = audioCtx.createGain();
        osc1.connect(gain1);
        gain1.connect(audioCtx.destination);
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(523.25, now); // C5
        osc1.frequency.exponentialRampToValueAtTime(783.99, now + 0.8); // G5 (romantic rising harmony)
        gain1.gain.setValueAtTime(0.001, now);
        gain1.gain.linearRampToValueAtTime(0.04, now + 0.25); // Smooth fade-in
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.2); // Slow decay
        osc1.start(now);
        osc1.stop(now + 1.25);

        // Oscillator 2: Warm fundamental tone
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(261.63, now); // C4
        gain2.gain.setValueAtTime(0.001, now);
        gain2.gain.linearRampToValueAtTime(0.03, now + 0.35);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
        osc2.start(now);
        osc2.stop(now + 1.55);
      } else {
        // Soft sweep/whoosh out
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.55); // Pitch sweep down
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.025, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.65);
      }
    } catch (e) {
      // AudioContext blocked
    }
  };

  useEffect(() => {
    if (index < introTexts.length) {
      // Play entry chime sound
      playTransitionSound('in');

      // Schedule exit sweep sound just before the animation exit triggers (around 2.4s)
      const exitSoundTimer = setTimeout(() => {
        playTransitionSound('out');
      }, 2400);

      // Schedule transition to the next text at 3s
      const nextTextTimer = setTimeout(() => {
        setIndex(prev => prev + 1);
      }, 3000);

      return () => {
        clearTimeout(exitSoundTimer);
        clearTimeout(nextTextTimer);
      };
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
