import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, BookOpen, X, ZoomIn } from 'lucide-react';
import type { SceneData } from '../data';

interface CinematicSceneProps {
  scene: SceneData;
}

interface HeartParticle {
  id: number;
  x: number;
  y: number;
  scale: number;
  angle: number;
}

const CinematicScene = ({ scene }: CinematicSceneProps) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [particles, setParticles] = useState<HeartParticle[]>([]);

  // Format the ID as a zero-padded string (e.g. 1 -> 01)
  const paddedId = String(scene.id).padStart(2, '0');

  // Alternating tilt for scrapbook photos
  const rotationClass = scene.id % 2 === 0 ? 'hover:rotate-1 rotate-[-1.5deg]' : 'hover:rotate-[-1deg] rotate-[1.5deg]';

  // Trigger heart burst particle animation
  const handleLike = () => {
    if (!isLiked) {
      setIsLiked(true);
      const newParticles = Array.from({ length: 12 }).map((_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 80 + 40;
        return {
          id: Date.now() + i,
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance - 20,
          scale: Math.random() * 0.7 + 0.5,
          angle: Math.random() * 360,
        };
      });
      setParticles(newParticles);
      setTimeout(() => setParticles([]), 1200);
    } else {
      setIsLiked(false);
    }
  };

  return (
    <div className="min-h-screen md:h-screen w-full bg-[#f4f1ea] snap-start flex flex-col md:flex-row items-center justify-center px-4 sm:px-8 md:px-20 lg:px-32 py-10 sm:py-16 md:py-0 gap-6 sm:gap-10 md:gap-16 border-b border-zinc-200 relative overflow-hidden text-[#2d2a29]">
      
      {/* Scrapbook Grid Paper Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(139,92,26,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(139,92,26,0.04)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] pointer-events-none" />

      {/* Left Column: Taped Polaroid Photo */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="w-full md:w-[48%] flex justify-center z-10 relative"
      >
        {/* Masking Washi Tape Overlay */}
        <div 
          className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 sm:w-28 h-5 sm:h-6 bg-[#eae1d0]/75 backdrop-blur-[1px] border border-dashed border-[#b8ab96]/30 shadow-sm z-20 rotate-[-2deg] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(rgba(0,0,0,0.02) 25%, transparent 25%)',
            backgroundSize: '4px 4px',
          }}
        />

        {/* Polaroid Card */}
        <div 
          onClick={() => setIsZoomed(true)}
          className={`w-full max-w-[280px] sm:max-w-sm bg-white p-3 sm:p-4 pb-10 sm:pb-12 rounded-sm cursor-zoom-in relative transition-all duration-500 shadow-[0_15px_35px_rgba(139,92,26,0.12)] border border-zinc-200/50 ${rotationClass}`}
        >
          {/* Polaroid Image Frame */}
          <div className="w-full aspect-square rounded-[1px] overflow-hidden bg-zinc-100 border border-zinc-950/5 relative">
            <img 
              src={scene.image} 
              alt={scene.title}
              className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)]"
              loading="lazy"
            />
            
            {/* Subtle paper vignette overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_75%,rgba(0,0,0,0.1)_100%)] pointer-events-none" />
            
            {/* Zoom Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <span className="px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-white/50 text-[9px] sm:text-[10px] font-mono tracking-widest text-[#2d2a29] shadow-sm flex items-center gap-1.5">
                <ZoomIn size={10} />
                ZOOM PHOTO
              </span>
            </div>
          </div>

          {/* Polaroid Bottom Caption (Handwritten ink style) */}
          {scene.date && (
            <div className="text-center mt-4 sm:mt-5 font-handwriting text-zinc-700 text-lg sm:text-xl md:text-2xl tracking-wide select-none">
              {scene.date}
            </div>
          )}
        </div>
      </motion.div>

      {/* Right Column: Handwritten Scrapbook Text */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="w-full md:w-[48%] text-left flex flex-col justify-center max-w-[280px] sm:max-w-md z-10"
      >
        {/* Monospace Slide Index & Heart Button Container */}
        <div className="flex items-center justify-between mb-2 sm:mb-3 border-b border-dashed border-zinc-300 pb-1.5 sm:pb-2">
          <span className="font-mono text-[10px] sm:text-xs tracking-[0.2em] text-zinc-400 uppercase">
            Story #{paddedId}
          </span>
          
          {/* Heart Reaction with Floating Particle System */}
          <div className="relative flex items-center justify-center">
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={handleLike}
              className={`p-1.5 sm:p-2 rounded-full cursor-pointer transition-colors border ${
                isLiked 
                  ? 'bg-pink-500/10 border-pink-500/30 text-pink-500' 
                  : 'bg-zinc-200/60 border-zinc-300/60 text-zinc-400 hover:text-zinc-600'
              }`}
            >
              <Heart size={13} fill={isLiked ? "currentColor" : "none"} />
            </motion.button>

            {/* Particle Burst Overlay */}
            {particles.map(p => (
              <motion.div
                key={p.id}
                className="absolute pointer-events-none text-pink-500 z-30"
                initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
                animate={{ 
                  x: p.x, 
                  y: p.y, 
                  scale: p.scale, 
                  opacity: 0,
                  rotate: p.angle
                }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <Heart size={10} fill="currentColor" stroke="none" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Serif Scrapbook Title */}
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#2d2a29] tracking-tight mb-2 sm:mb-4 leading-tight">
          {scene.title}
        </h2>

        {/* Description (Handwritten font) */}
        <p className="font-handwriting text-xl sm:text-2xl md:text-3xl leading-relaxed text-[#403c3a] tracking-wide mb-4 sm:mb-6">
          {scene.description}
        </p>

        {/* Expandable Sticky Note Feature */}
        {scene.note && (
          <div className="flex flex-col items-start w-full relative">
            <button
              onClick={() => setShowNote(!showNote)}
              className="flex items-center gap-2 text-[10px] sm:text-xs font-mono tracking-widest text-[#a16207] hover:text-[#854d0e] transition-colors uppercase border-b border-[#a16207]/30 pb-0.5 cursor-pointer"
            >
              <BookOpen size={10} />
              {showNote ? 'Tutup Catatan' : 'Buka Catatan Kecil 💌'}
            </button>

            <AnimatePresence>
              {showNote && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -10, rotate: 0 }}
                  animate={{ opacity: 1, scale: 1, y: 0, rotate: 1 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10, rotate: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full mt-3 sm:mt-4 z-20 origin-top"
                >
                  {/* Cozy Yellow Sticky Note (Post-it) */}
                  <div 
                    className="p-4 sm:p-5 bg-[#fef9c3] border border-yellow-200/70 text-zinc-800 rounded-xs relative shadow-[5px_15px_30px_rgba(139,92,26,0.15)] rotate-[1.5deg]"
                    style={{
                      backgroundImage: 'linear-gradient(rgba(0,0,0,0.01) 1px, transparent 1px)',
                      backgroundSize: '100% 20px',
                    }}
                  >
                    {/* Washi tape holding sticky note */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 sm:w-16 h-3.5 sm:h-4.5 bg-red-100/60 border border-dashed border-red-200/40 rotate-[-1deg] shadow-sm z-30 pointer-events-none" />

                    <div className="flex gap-2">
                      <Sparkles size={14} className="text-yellow-600 flex-shrink-0 mt-1 animate-pulse" />
                      <p className="font-handwriting text-lg sm:text-xl md:text-2xl leading-relaxed italic text-zinc-700">
                        "{scene.note}"
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Full Screen Lightbox Modal */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsZoomed(false)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.92, rotate: -1 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.92, rotate: -1 }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="bg-white p-3 pb-12 shadow-2xl rounded-xs border border-zinc-200 max-w-full max-h-[90vh] flex flex-col items-center"
            >
              <img
                src={scene.image}
                alt={scene.title}
                className="max-w-full max-h-[75vh] object-contain rounded-xs border border-zinc-950/10"
              />
              {scene.date && (
                <span className="font-handwriting text-zinc-700 text-2xl mt-4 block">
                  {scene.date}
                </span>
              )}
            </motion.div>
            <button 
              onClick={() => setIsZoomed(false)}
              className="absolute top-6 right-6 text-zinc-400 hover:text-white hover:bg-white/10 p-2.5 rounded-full transition-colors cursor-pointer"
            >
              <X size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CinematicScene;
