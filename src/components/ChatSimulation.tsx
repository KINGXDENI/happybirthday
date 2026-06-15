import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { chatMessages } from '../data';

interface ChatSimulationProps {
  onComplete: () => void;
}

const ChatSimulation = ({ onComplete }: ChatSimulationProps) => {
  const [visibleMessages, setVisibleMessages] = useState<number[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const playSound = (type: 'typing' | 'send' | 'receive') => {
    const sounds = {
      typing: 'https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3', // Soft tap
      send: 'https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3',   // Whoosh/Pop
      receive: 'https://assets.mixkit.co/active_storage/sfx/2353/2353-preview.mp3' // Ding/Pop
    };
    const audio = new Audio(sounds[type]);
    audio.volume = 0.3;
    audio.play().catch(() => {});
  };

  useEffect(() => {
    let currentMessage = 0;

    const showNextMessage = () => {
      if (currentMessage < chatMessages.length) {
        setIsTyping(true);
        // Play typing sound periodically while typing
        const typingInterval = setInterval(() => playSound('typing'), 300);
        
        setTimeout(() => {
          clearInterval(typingInterval);
          setIsTyping(false);
          
          const msg = chatMessages[currentMessage];
          playSound(msg.sender === 'me' ? 'send' : 'receive');
          
          setVisibleMessages(prev => [...prev, msg.id]);
          currentMessage++;
          
          if (currentMessage < chatMessages.length) {
            setTimeout(showNextMessage, chatMessages[currentMessage].delay);
          } else {
            setTimeout(onComplete, 1000);
          }
        }, 1500);
      }
    };

    const initialTimeout = setTimeout(showNextMessage, 1000);
    return () => clearTimeout(initialTimeout);
  }, [onComplete]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 md:p-8">
      <div className="max-w-md w-full bg-stone-900/40 backdrop-blur-md rounded-[2.5rem] p-5 md:p-6 border border-white/10 shadow-2xl flex flex-col h-[70vh] md:h-[500px]">
        {/* Chat Header */}
        <div className="flex items-center space-x-3 mb-6 border-b border-white/5 pb-4">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-tr from-stone-700 to-stone-800 flex items-center justify-center text-white/50 border border-white/5">
            <span className="font-semibold text-[10px] md:text-xs tracking-tighter">iOS</span>
          </div>
          <div>
            <h3 className="text-white text-xs md:text-sm font-medium">Pacarku ❤️</h3>
            <p className="text-green-500 text-[8px] md:text-[10px] font-bold uppercase tracking-widest">Active Now</p>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 space-y-4 overflow-y-auto pr-2 scrollbar-none">
          <AnimatePresence>
            {chatMessages.filter(m => visibleMessages.includes(m.id)).map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-2 rounded-2xl text-[12px] md:text-[13px] leading-tight shadow-sm ${
                    msg.sender === 'me'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-stone-800 text-stone-100 rounded-tl-none border border-white/5'
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-stone-800 px-4 py-2 rounded-2xl rounded-tl-none flex space-x-1 border border-white/5">
                <div className="w-1 h-1 bg-white/40 rounded-full animate-bounce" />
                <div className="w-1 h-1 bg-white/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1 h-1 bg-white/40 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </motion.div>
          )}
        </div>
      </div>
      
      <AnimatePresence>
        {visibleMessages.length === chatMessages.length && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 md:mt-10 flex flex-col items-center text-stone-500"
          >
            <p className="text-[9px] md:text-[10px] tracking-[0.3em] uppercase mb-2">Scroll to continue</p>
            <motion.div 
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-px h-8 bg-gradient-to-b from-stone-500 to-transparent" 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatSimulation;
