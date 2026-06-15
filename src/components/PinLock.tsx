import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Delete } from 'lucide-react';
import { SECRET_PIN } from '../data';

interface PinLockProps {
  onSuccess: () => void;
  onInteraction?: () => void;
}

const PinLock = ({ onSuccess, onInteraction }: PinLockProps) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const playSound = (type: 'tap' | 'success' | 'error') => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      const now = audioCtx.currentTime;

      if (type === 'tap') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1000, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.08);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start();
        osc.stop(now + 0.08);
      } else if (type === 'success') {
        // C5 -> E5 -> G5 sweet arpeggio
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start();
        osc.stop(now + 0.4);

        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(659.25, now + 0.08);
        gain2.gain.setValueAtTime(0.08, now + 0.08);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.23);
        osc2.start();
        osc2.stop(now + 0.4);

        const osc3 = audioCtx.createOscillator();
        const gain3 = audioCtx.createGain();
        osc3.connect(gain3);
        gain3.connect(audioCtx.destination);
        osc3.type = 'sine';
        osc3.frequency.setValueAtTime(783.99, now + 0.16);
        gain3.gain.setValueAtTime(0.08, now + 0.16);
        gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc3.start();
        osc3.stop(now + 0.4);
      } else if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start();
        osc.stop(now + 0.25);
      }
    } catch (e) {
      // AudioContext blocked
    }
  };

  const handleNumberClick = (num: string) => {
    if (pin.length < 4) {
      playSound('tap');
      setPin(prev => prev + num);
      onInteraction?.();
    }
  };

  const handleDelete = () => {
    playSound('tap');
    setPin(prev => prev.slice(0, -1));
    onInteraction?.();
  };

  useEffect(() => {
    if (pin.length === 4) {
      if (pin === SECRET_PIN) {
        playSound('success');
        setTimeout(onSuccess, 500);
      } else {
        playSound('error');
        setError(true);
        setTimeout(() => {
          setPin('');
          setError(false);
        }, 500);
      }
    }
  }, [pin, onSuccess]);

  return (
    <div className="h-screen w-full bg-black flex flex-col items-center justify-center p-6 select-none">
      <motion.div
        animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center"
      >
        <div className={`mb-8 transition-colors duration-300 ${error ? 'text-red-500' : 'text-white/50'}`}>
          <Lock size={48} strokeWidth={1} />
        </div>
        
        <h2 className={`text-xl font-light tracking-widest mb-10 uppercase transition-colors duration-300 ${error ? 'text-red-500' : 'text-white'}`}>
          {error ? 'Wrong PIN' : 'Enter PIN to Unlock'}
        </h2>

        {/* PIN Indicators */}
        <div className="flex space-x-6 mb-16">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full border transition-all duration-300 ${
                error 
                  ? 'bg-red-500 border-red-500 scale-125' 
                  : pin.length > i 
                    ? 'bg-white border-white scale-125' 
                    : 'bg-transparent border-white/30'
              }`}
            />
          ))}
        </div>

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-6">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              className="w-16 h-16 rounded-full bg-white/5 hover:bg-white/10 active:bg-white/20 flex items-center justify-center text-white text-2xl font-light transition-colors cursor-pointer"
            >
              {num}
            </button>
          ))}
          <div className="w-16 h-16" />
          <button
            onClick={() => handleNumberClick('0')}
            className="w-16 h-16 rounded-full bg-white/5 hover:bg-white/10 active:bg-white/20 flex items-center justify-center text-white text-2xl font-light transition-colors cursor-pointer"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="w-16 h-16 rounded-full flex items-center justify-center text-white/50 hover:text-white transition-colors cursor-pointer"
          >
            <Delete size={24} />
          </button>
        </div>

        <p className="mt-12 text-white/20 text-xs tracking-[0.3em] uppercase">
          Hint: Our Special Date
        </p>


      </motion.div>
    </div>
  );
};

export default PinLock;
