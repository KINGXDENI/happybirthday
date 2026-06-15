import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock } from 'lucide-react';
import PinLock from './components/PinLock';
import CinematicIntro from './components/CinematicIntro';
import { LoveQuiz } from './components/LoveQuiz';
import WhatsAppChat from './components/WhatsAppChat';
import CinematicScene from './components/CinematicScene';
import CinematicFinale from './components/CinematicFinale';
import MusicPlayer from './components/MusicPlayer';
import { RelationshipCounter } from './components/RelationshipCounter';
import { QrGenerator } from './components/QrGenerator';
import { scenes } from './data';

type Step = 'pin' | 'intro' | 'loading' | 'chat' | 'quiz' | 'scenes' | 'qr';

function App() {
  const [step, setStep] = useState<Step>(() => {
    // Check if URL contains '?qr' or '?qr=true' to load generator directly
    if (window.location.search.includes('qr')) {
      return 'qr';
    }
    return 'pin';
  });
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chatSoundRef = useRef<HTMLAudioElement | null>(null);
  const voiceSoundRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Audios (Perfect, Chat incoming, and Voice note) and register them early
  useEffect(() => {
    const audio = new Audio('/sounds/Ed Sheeran - Perfect.mp3');
    audio.loop = true;
    audioRef.current = audio;

    const chatSound = new Audio('/sounds/chatmasuk.mp3');
    chatSound.preload = 'auto';
    chatSoundRef.current = chatSound;

    const voiceSound = new Audio('/sounds/medan.mp3');
    voiceSound.preload = 'auto';
    voiceSoundRef.current = voiceSound;

    return () => {
      audio.pause();
      chatSound.pause();
      voiceSound.pause();
    };
  }, []);

  const unlockAudio = () => {
    // Play and immediately pause to unlock Chrome's strict autoplay restrictions on user interaction
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        audioRef.current?.pause();
      }).catch(() => {});
    }
    if (chatSoundRef.current) {
      chatSoundRef.current.play().then(() => {
        chatSoundRef.current?.pause();
      }).catch(() => {});
    }
    if (voiceSoundRef.current) {
      voiceSoundRef.current.play().then(() => {
        voiceSoundRef.current?.pause();
      }).catch(() => {});
    }
  };

  const startMusic = () => {
    if (audioRef.current && !isMusicPlaying) {
      audioRef.current.play().then(() => {
        setIsMusicPlaying(true);
      }).catch((err) => {
        console.log('Autoplay blocked by browser. Music will play on next interaction.', err);
      });
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isMusicPlaying) {
      audioRef.current.pause();
      setIsMusicPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsMusicPlaying(true);
      }).catch((err) => {
        console.log('Play failed', err);
      });
    }
  };

  const handlePinSuccess = () => {
    setStep('intro');
  };

  const handleIntroComplete = () => {
    setStep('loading');
    setTimeout(() => {
      setStep('chat');
    }, 2500); // 2.5s WhatsApp Loading Screen
  };

  const handleQuizComplete = () => {
    setStep('scenes'); // Unlocks Scrapbook and letter finale
  };

  return (
    <div className="relative min-h-screen bg-black text-[#e9edef] font-sans overflow-hidden">
      {/* Real Floating Music Player (Visible only during Quiz and Scenes) */}
      {(step === 'quiz' || step === 'scenes') && (
        <MusicPlayer isPlaying={isMusicPlaying} onTogglePlay={toggleMusic} />
      )}

      <AnimatePresence mode="wait">
        {/* 1. PIN LOCK */}
        {step === 'pin' && (
          <motion.div
            key="pin"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-screen"
          >
            <PinLock onSuccess={handlePinSuccess} onInteraction={unlockAudio} />
          </motion.div>
        )}

        {/* 2. CINEMATIC INTRO TEXTS */}
        {step === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-screen"
          >
            <CinematicIntro onComplete={handleIntroComplete} />
          </motion.div>
        )}

        {/* 3. WHATSAPP SPLASH LOADING SCREEN */}
        {step === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 bg-[#0b141a] z-50 flex flex-col items-center justify-between py-16 text-center select-none"
          >
            <div />

            {/* Center Logo & Spinner */}
            <div className="flex flex-col items-center gap-6">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, type: 'spring' }}
                className="w-20 h-20 bg-[#25d366] rounded-full flex items-center justify-center shadow-lg shadow-[#25d366]/10"
              >
                <svg viewBox="0 0 24 24" width="46" height="46" className="fill-white">
                  <path d="M12.012 2c-5.506 0-9.988 4.482-9.988 9.988 0 1.76.459 3.483 1.33 5.004L2 22l5.163-1.355c1.472.802 3.125 1.228 4.837 1.228h.005c5.505 0 9.988-4.482 9.988-9.988C22 6.482 17.518 2 12.012 2zm6.059 14.175c-.25.704-1.228 1.282-1.688 1.348-.461.066-.922.115-3.092-.741-2.775-1.093-4.526-3.923-4.664-4.108-.139-.185-1.12-1.492-1.12-2.846 0-1.354.708-2.014.962-2.28.253-.266.551-.332.736-.332.185 0 .369.002.53.01.166.008.388-.062.607.468.225.543.768 1.87.834 2.003.066.133.11.288.022.465-.088.177-.132.288-.264.443-.133.155-.28.346-.399.465-.133.133-.27.277-.116.543.155.266.69 1.134 1.48 1.838.986.88 1.812 1.152 2.071 1.262.259.11.41.092.564-.088.154-.18.663-.775.84-1.04.177-.266.353-.222.597-.133.244.088 1.549.73 1.815.863.266.133.443.2.509.31.066.11.066.643-.184 1.348z"/>
                </svg>
              </motion.div>

              <div className="w-8 h-8 border-[3px] border-[#00a884]/30 border-t-[#00a884] rounded-full animate-spin mt-4" />
            </div>

            {/* Bottom Info */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs text-[#8696a0] tracking-wider uppercase">from</span>
              <span className="text-[17px] font-bold text-white tracking-widest">WHATSAPP</span>
              <div className="flex items-center gap-1.5 text-[#00a884] mt-2 bg-[#202c33]/30 px-3 py-1 rounded-full text-xs">
                <Lock size={12} />
                <span>End-to-end encrypted</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* 4. WHATSAPP INTERACTIVE MOCKUP CHAT */}
        {step === 'chat' && (
          <motion.div
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-screen"
          >
            <WhatsAppChat 
              onOpenCard={() => {
                setStep('quiz');
                startMusic();
              }} 
              chatSound={chatSoundRef.current}
              voiceSound={voiceSoundRef.current}
            />
          </motion.div>
        )}

        {/* 5. LOVE QUIZ */}
        {step === 'quiz' && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-screen"
          >
            <LoveQuiz onComplete={handleQuizComplete} />
          </motion.div>
        )}

        {/* 6. CINEMATIC PARALLAX SCENES & FINALE */}
        {step === 'scenes' && (
          <motion.div
            key="scenes"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="h-screen w-full overflow-y-auto snap-y snap-mandatory"
            style={{ scrollbarWidth: 'none' }}
          >
            {/* Prologue Slide with Live Relationship Counter */}
            <div className="min-h-screen w-full bg-[#f4f1ea] snap-start flex flex-col items-center justify-center px-4 py-16 border-b border-zinc-200 relative text-[#2d2a29]">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(139,92,26,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(139,92,26,0.04)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] pointer-events-none" />
              
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-center max-w-lg z-10"
              >
                <span className="font-mono text-xs tracking-[0.25em] text-zinc-400 uppercase mb-4 block">Prologue</span>
                <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#2d2a29] tracking-tight mb-8">
                  Kilas Balik Hubungan Kita
                </h1>
                
                <RelationshipCounter />
                
                <motion.div 
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="mt-12 text-zinc-400 font-mono text-[10px] sm:text-xs tracking-widest uppercase"
                >
                  Scroll ke bawah untuk melihat memori kita 🐻👇
                </motion.div>
              </motion.div>
            </div>

            {scenes.map(scene => (
              <CinematicScene scene={scene} key={scene.id} />
            ))}
            <CinematicFinale />
          </motion.div>
        )}

        {/* 7. QR CODE GENERATOR */}
        {step === 'qr' && (
          <motion.div
            key="qr"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-screen"
          >
            <QrGenerator onBack={() => setStep('pin')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
