import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, HelpCircle, AlertTriangle, CheckCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LoveQuizProps {
  onComplete: () => void;
}

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
  hint: string;
}

const quizQuestions: Question[] = [
  {
    id: 1,
    text: "Game apa tempat kita pertama kali mabar?",
    options: ["PUBG Mobile", "Mobile Legends", "Free Fire"],
    correctAnswer: "Mobile Legends",
    hint: "Game MOBA 5v5 yang kita mainin bareng temennya Firas..."
  },
  {
    id: 2,
    text: "Di mana kita pertama kali buat grup & sering call bertiga bareng Firas?",
    options: ["LINE", "WhatsApp", "Discord"],
    correctAnswer: "LINE",
    hint: "Aplikasi chat hijau tempat kita bertiga sering ngobrol sampai larut malam..."
  },
  {
    id: 3,
    text: "Siapa yang pertama kali confess pas tanggal jadian kita (23 Agustus 2025)?",
    options: ["Deni", "Keiza"],
    correctAnswer: "Keiza",
    hint: "Hayo ngaku, di tengah sikap cuekku waktu itu, siapa yang akhirnya berani confess duluan? 😜"
  }
];

export const LoveQuiz = ({ onComplete }: LoveQuizProps) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isWrong, setIsWrong] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isFinished, setIsFinished] = useState(false);

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setIsWrong(false);
    setFeedback('');
  };

  const handleNext = () => {
    if (!selectedOption) return;

    const currentQuestion = quizQuestions[currentIdx];
    if (selectedOption === currentQuestion.correctAnswer) {
      // Correct!
      // Trigger small confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#ec4899', '#f43f5e', '#f472b6']
      });

      if (currentIdx < quizQuestions.length - 1) {
        setSelectedOption(null);
        setCurrentIdx(prev => prev + 1);
      } else {
        // Quiz completed
        setIsFinished(true);
        // Big confetti burst
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(() => {
          const timeLeft = animationEnd - Date.now();
          if (timeLeft <= 0) {
            return clearInterval(interval);
          }
          const particleCount = 50 * (timeLeft / duration);
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
      }
    } else {
      // Wrong!
      setIsWrong(true);
      const wrongFeedbacks = [
        "Yakin? Pikir-pikir lagi deh... 😂",
        "Masa lupa sih? Ingat-ingat lagi sayang! 😜",
        "Salah nih! Cobain pilihan yang lain yuk. 🤫",
        "Salah hihi, dipikir pelan-pelan yaaa~ ❤️"
      ];
      setFeedback(wrongFeedbacks[Math.floor(Math.random() * wrongFeedbacks.length)]);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f4f1ea] flex items-center justify-center p-4 relative overflow-hidden text-[#2d2a29]">
      {/* Scrapbook Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(139,92,26,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(139,92,26,0.03)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] pointer-events-none" />

      {/* Ambient background decoration */}
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-pink-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-amber-100/30 rounded-full blur-3xl pointer-events-none" />

      <AnimatePresence mode="wait">
        {!isFinished ? (
          <motion.div
            key="quiz-card"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md bg-white border border-zinc-200 p-6 sm:p-8 rounded-2xl shadow-[0_20px_40px_rgba(139,92,26,0.08)] relative z-10"
          >
            {/* Cute Tape Top Decor */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-5.5 bg-[#eae1d0]/75 border border-dashed border-[#b8ab96]/30 shadow-sm z-20 rotate-[-1deg] pointer-events-none" />

            {/* Header / Step Indicator */}
            <div className="flex items-center justify-between mb-6 border-b border-dashed border-zinc-200 pb-3">
              <span className="font-mono text-xs tracking-wider text-zinc-400 uppercase flex items-center gap-1.5">
                <HelpCircle size={14} className="text-zinc-400" />
                Memory Quiz {currentIdx + 1}/{quizQuestions.length}
              </span>
              <Heart size={16} className="text-pink-500 fill-pink-500 animate-pulse" />
            </div>

            {/* Question Text */}
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2d2a29] leading-snug mb-6">
              {quizQuestions[currentIdx].text}
            </h3>

            {/* Options List */}
            <div className="flex flex-col gap-3.5 mb-6">
              {quizQuestions[currentIdx].options.map((option) => {
                const isSelected = selectedOption === option;
                return (
                  <motion.button
                    key={option}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleOptionClick(option)}
                    className={`w-full text-left p-4 rounded-xl text-sm sm:text-base font-medium transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-pink-500/5 border-pink-500 text-pink-600 shadow-sm shadow-pink-500/5'
                        : 'bg-zinc-50 border-zinc-200 text-[#403c3a] hover:bg-zinc-100/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'border-pink-500 bg-pink-500 text-white' : 'border-zinc-300'
                      }`}>
                        {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                      <span>{option}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Feedback & Wrong Answer Alert */}
            <AnimatePresence>
              {isWrong && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-start gap-2 bg-red-50 border border-red-200/50 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm"
                >
                  <AlertTriangle size={16} className="flex-shrink-0 mt-0.5 text-red-500" />
                  <div>
                    <p className="font-semibold">{feedback}</p>
                    <p className="text-xs text-red-600/80 mt-1 font-mono">Petunjuk: {quizQuestions[currentIdx].hint}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Button */}
            <button
              onClick={handleNext}
              disabled={!selectedOption}
              className={`w-full font-medium py-3 rounded-full transition-all shadow cursor-pointer text-center text-sm flex items-center justify-center gap-2 ${
                selectedOption
                  ? 'bg-pink-500 text-white hover:bg-pink-600 active:scale-95'
                  : 'bg-zinc-100 text-zinc-400 border border-zinc-200 shadow-none cursor-not-allowed'
              }`}
            >
              <span>Jawab Pertanyaan</span>
              <Sparkles size={14} />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="quiz-success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md bg-white border border-zinc-200 p-8 rounded-2xl shadow-[0_20px_40px_rgba(139,92,26,0.08)] text-center relative z-10"
          >
            {/* Cute Tape Top Decor */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-5.5 bg-[#eae1d0]/75 border border-dashed border-[#b8ab96]/30 shadow-sm z-20 rotate-[1.5deg] pointer-events-none" />

            <div className="w-16 h-16 rounded-full bg-pink-500/10 text-pink-500 flex items-center justify-center mx-auto mb-5 border border-pink-500/20 shadow-inner">
              <CheckCircle size={36} fill="currentColor" className="text-white" />
            </div>

            <h3 className="font-serif text-2xl font-bold text-[#2d2a29] mb-3">
              Yeeay! Kuis Selesai! 🎉
            </h3>
            
            <p className="font-handwriting text-2xl leading-relaxed text-zinc-600 mb-8 max-w-sm mx-auto">
              Kamu lulus kuis memori kita dengan sempurna! Berarti kamu emang nggak lupa sama awal cerita kita, sayang. ❤️
            </p>

            <button
              onClick={onComplete}
              className="w-full bg-[#008069] hover:bg-[#00a884] active:scale-95 text-white font-medium py-3 rounded-full shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 text-sm"
            >
              <span>Buka Surat Cinta & Galeri</span>
              <Heart size={16} className="fill-white text-white" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
