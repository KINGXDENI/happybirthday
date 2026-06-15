import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { finalMessage } from '../data';
import { Heart, Pin, Send, Trash2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import HeartQR from './HeartQR';

interface Wish {
  id: string;
  name: string;
  text: string;
  date: string;
  color: 'yellow' | 'pink' | 'blue' | 'green';
}

const DEFAULT_WISHES: Wish[] = [
  {
    id: 'default-1',
    name: 'Deni ❤️',
    text: 'Semoga di usiamu yang baru ini kamu selalu dilimpahi kebahagiaan, kesehatan, dan tetap menjadi Keiza yang apa adanya. Aku berjanji akan selalu ada di sampingmu untuk mendukung dan menyayangimu di setiap langkah kita. Happy Birthday sayang! 🌙✨',
    date: '15 Juni 2026',
    color: 'yellow'
  }
];

const COLORS: Wish['color'][] = ['yellow', 'pink', 'blue', 'green'];
const COLOR_CLASSES = {
  yellow: 'bg-[#fef9c3] border-yellow-200 text-yellow-900',
  pink: 'bg-[#fce7f3] border-pink-200 text-pink-900',
  blue: 'bg-[#e0f2fe] border-blue-200 text-blue-900',
  green: 'bg-[#dcfce7] border-green-200 text-green-900',
};

const CinematicFinale = () => {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [newWish, setNewWish] = useState('');
  const [senderName, setSenderName] = useState('Keiza');
  const [selectedColor, setSelectedColor] = useState<Wish['color']>('pink');

  // Load wishes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('keiza_wishes');
    if (saved) {
      try {
        setWishes(JSON.parse(saved));
      } catch (e) {
        setWishes(DEFAULT_WISHES);
      }
    } else {
      setWishes(DEFAULT_WISHES);
    }
  }, []);

  // Save wishes to localStorage
  const saveWishes = (updatedWishes: Wish[]) => {
    setWishes(updatedWishes);
    localStorage.setItem('keiza_wishes', JSON.stringify(updatedWishes));
  };

  const handleAddWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWish.trim() || !senderName.trim()) return;

    const newWishObj: Wish = {
      id: `wish-${Date.now()}`,
      name: senderName.trim(),
      text: newWish.trim(),
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      color: selectedColor
    };

    const updated = [newWishObj, ...wishes];
    saveWishes(updated);
    setNewWish('');

    // Trigger confetti explosion
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#ec4899', '#3b82f6', '#10b981', '#f59e0b']
    });
  };

  const handleDeleteWish = (id: string) => {
    // Prevent deleting Deni's default note
    if (id === 'default-1') return;
    const updated = wishes.filter(w => w.id !== id);
    saveWishes(updated);
  };

  return (
    <div className="min-h-screen w-full bg-[#f4f1ea] flex flex-col items-center justify-start px-4 sm:px-6 py-20 snap-start relative text-[#2d2a29]">
      
      {/* Scrapbook Grid Paper Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(139,92,26,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(139,92,26,0.04)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] pointer-events-none" />

      {/* Cozy Lined Notebook Letter Sheet */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-2xl bg-[#fefefe] border border-zinc-200 p-5 sm:p-8 md:p-14 rounded-xs shadow-[0_25px_50px_-10px_rgba(139,92,26,0.1)] relative overflow-hidden z-10 mb-20"
        style={{
          boxShadow: '0 30px 60px -15px rgba(139, 92, 26, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
          backgroundImage: 'linear-gradient(#f0ebe1 1.5px, transparent 1.5px)',
          backgroundSize: '100% 32px', // notebook lines height
          paddingTop: '3.5rem', // align first line of text
        }}
      >
        {/* Washi Tapes holding the sheet */}
        <div className="absolute -top-3 left-6 sm:left-12 w-20 sm:w-24 h-4.5 sm:h-5.5 bg-[#eae1d0]/70 border border-dashed border-[#b8ab96]/25 rotate-[-3deg] shadow-sm z-20 pointer-events-none" />
        <div className="absolute -top-3.5 right-6 sm:right-12 w-20 sm:w-24 h-4.5 sm:h-5.5 bg-[#eae1d0]/70 border border-dashed border-[#b8ab96]/25 rotate-[2deg] shadow-sm z-20 pointer-events-none" />

        {/* Heart Accent (Drawn notebook style) */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="text-pink-500/80 p-1.5 sm:p-2 bg-pink-50 rounded-full border border-pink-100 shadow-sm"
          >
            <Heart size={16} fill="currentColor" stroke="none" />
          </motion.div>
        </div>

        {/* Notebook Letter Header (Monospace Hand-drawn Style) */}
        <div className="text-center font-mono text-[9px] sm:text-[10px] tracking-[0.25em] text-zinc-400 uppercase mb-6 sm:mb-8">
          June 15, 2026 / Cozy Letter
        </div>

        {/* Serif Letter Title */}
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#2d2a29] tracking-tight text-center mb-5 sm:mb-6 leading-tight">
          {finalMessage.title}
        </h2>

        {/* Letter Body Message (Handwritten font aligned to notebook lines) */}
        <p 
          className="font-handwriting text-xl sm:text-2xl md:text-3xl text-zinc-700 leading-[32px] text-center font-light tracking-wide mb-8 sm:mb-12 max-w-lg mx-auto"
          style={{
            lineHeight: '32px', // matches background line size
          }}
        >
          {finalMessage.message}
        </p>

        {/* Letter Signature (Handwritten right aligned) */}
        <div className="text-right mt-12 sm:mt-16 pt-3 sm:pt-4 border-t border-dashed border-zinc-200">
          <span className="font-mono text-[8px] sm:text-[9px] tracking-[0.2em] text-zinc-400 uppercase block mb-1">
            With Love,
          </span>
          <span className="font-handwriting text-2xl sm:text-3xl md:text-4xl text-[#2d2a29] font-bold tracking-wide">
            {finalMessage.signature}
          </span>
        </div>

        {/* Heart QR Code Section (Added inside the letter sheet) */}
        <div className="flex flex-col items-center mt-12 pt-8 border-t border-dashed border-zinc-100">
          <p className="font-mono text-[9px] tracking-[0.3em] text-zinc-400 uppercase mb-6">Scan for a Surprise</p>
          <div className="p-4 bg-white rounded-2xl shadow-sm border border-zinc-50">
            <HeartQR value={window.location.href} size={160} />
          </div>
        </div>
      </motion.div>

      {/* WISH WALL / PAPAN HARAPAN SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 1 }}
        className="w-full max-w-3xl z-10"
      >
        <div className="text-center mb-8">
          <h2 className="font-serif text-3xl font-bold text-[#2d2a29] mb-2">Papan Harapan Keiza 📌</h2>
          <p className="font-handwriting text-2xl text-zinc-600">
            Tulis harapan, cita-cita, atau keinginanmu di hari ulang tahunmu ini, sayang...
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left: Input Form Card */}
          <div className="md:col-span-5 bg-white p-5 rounded-2xl border border-zinc-200 shadow-[0_15px_30px_rgba(139,92,26,0.05)] relative">
            {/* Washi Tape */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-4 bg-pink-100/60 border border-dashed border-pink-200/40 rotate-[1deg] shadow-sm pointer-events-none" />

            <form onSubmit={handleAddWish} className="flex flex-col gap-4">
              <div>
                <label className="block font-mono text-[10px] tracking-wider text-zinc-400 uppercase mb-1.5">Nama Kamu</label>
                <input 
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-500 bg-zinc-50"
                  placeholder="Masukkan nama"
                  required
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] tracking-wider text-zinc-400 uppercase mb-1.5">Pilih Warna Sticky Note</label>
                <div className="flex gap-2.5">
                  {COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer ${
                        selectedColor === color ? 'border-zinc-800 scale-110' : 'border-transparent'
                      } ${
                        color === 'yellow' ? 'bg-[#fef9c3]' :
                        color === 'pink' ? 'bg-[#fce7f3]' :
                        color === 'blue' ? 'bg-[#e0f2fe]' : 'bg-[#dcfce7]'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] tracking-wider text-zinc-400 uppercase mb-1.5">Harapan & Doa</label>
                <textarea 
                  value={newWish}
                  onChange={(e) => setNewWish(e.target.value)}
                  rows={4}
                  className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-500 bg-zinc-50 resize-none"
                  placeholder="Ketik doa atau harapanmu di sini..."
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-pink-500 hover:bg-pink-600 active:scale-95 text-white font-medium py-2.5 rounded-full shadow transition-all cursor-pointer flex items-center justify-center gap-2 text-sm"
              >
                <Send size={14} />
                <span>Gantung Harapan 📌</span>
              </button>
            </form>
          </div>

          {/* Right: Papan Gabus (Corkboard) with Sticky Notes */}
          <div className="md:col-span-7 bg-[#d4a373]/25 border-8 border-[#a16207]/30 rounded-3xl p-5 shadow-inner relative min-h-[350px]">
            {/* Wooden Board Pattern overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.01)_0%,transparent_100%)] pointer-events-none" />

            <div className="flex flex-wrap gap-4 justify-center">
              <AnimatePresence>
                {wishes.map((wish, index) => {
                  // Slight random rotations for notes
                  const rotations = [-1.5, 1, -1, 1.5, -2, 2];
                  const rotation = rotations[index % rotations.length];

                  return (
                    <motion.div
                      key={wish.id}
                      initial={{ scale: 0, opacity: 0, rotate: 0 }}
                      animate={{ scale: 1, opacity: 1, rotate: rotation }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      className={`p-4 rounded-sm shadow-md border max-w-[200px] w-full relative flex flex-col justify-between ${COLOR_CLASSES[wish.color]}`}
                      style={{ transform: `rotate(${rotation}deg)` }}
                    >
                      {/* Pushpin at the top center */}
                      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-red-500 drop-shadow-sm pointer-events-none">
                        <Pin size={16} fill="currentColor" className="rotate-[15deg]" />
                      </div>

                      {/* Delete button (except for default note) */}
                      {wish.id !== 'default-1' && (
                        <button
                          onClick={() => handleDeleteWish(wish.id)}
                          className="absolute top-1.5 right-1.5 text-zinc-400 hover:text-red-500 transition-colors p-0.5 cursor-pointer"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}

                      <div className="pt-2">
                        <p className="font-handwriting text-lg leading-relaxed italic mb-3">
                          "{wish.text}"
                        </p>
                      </div>

                      <div className="border-t border-dashed border-black/10 pt-2 flex items-center justify-between mt-2">
                        <span className="font-mono text-[9px] tracking-wider uppercase font-semibold">
                          {wish.name}
                        </span>
                        <span className="text-[8px] opacity-65 font-mono">
                          {wish.date}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            
            {wishes.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-zinc-400 text-sm italic font-mono pointer-events-none">
                Papan harapan masih kosong...
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Decorative leaf or heart ambient tone at bottom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] max-w-[500px] h-[100px] bg-amber-500/5 rounded-full blur-[80px] pointer-events-none" />
    </div>
  );
};

export default CinematicFinale;
