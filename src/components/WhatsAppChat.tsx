import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Video, Phone, MoreVertical, Smile, Paperclip,
  Mic, Send, CheckCheck, Play, Pause, Heart,
  Mail, MessageSquare, Lock
} from 'lucide-react';
import { chatSteps } from '../data';

interface WhatsAppChatProps {
  onOpenCard: () => void;
  chatSound?: HTMLAudioElement | null;
  voiceSound?: HTMLAudioElement | null;
}

const formatDuration = (secs: number) => {
  if (isNaN(secs)) return '0:00';
  const minutes = Math.floor(secs / 60);
  const seconds = Math.floor(secs % 60);
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
};

interface DisplayMessage {
  id: string;
  sender: 'partner' | 'user' | 'system';
  type: 'text' | 'image' | 'voice' | 'card';
  content?: string;
  mediaUrl?: string;
  title?: string;
  duration?: string;
  timestamp: string;
}

const WhatsAppChat = ({ onOpenCard, chatSound, voiceSound }: WhatsAppChatProps) => {
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  const [inputText, setInputText] = useState('');

  // Audio Player State for Voice Note
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const processedStepsRef = useRef<Record<string, boolean>>({});
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Helper to get current timestamp
  const getFormattedTime = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  };

  // Sound effects to simulate WhatsApp sounds
  const playNotificationSound = (type: 'sent' | 'received') => {
    try {
      if (type === 'received') {
        if (chatSound) {
          chatSound.currentTime = 0; // Reset track to start
          chatSound.play().catch(e => console.log('Notification play blocked', e));
        }
        return;
      }

      // Keep synthesized sound for sent message
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
      // AudioContext blocked or not supported
    }
  };

  // Scroll to bottom helper
  const scrollToBottom = () => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Process next step in the chat script
  useEffect(() => {
    if (currentStepIndex >= chatSteps.length) return;

    const step = chatSteps[currentStepIndex];

    // Prevent double execution in Strict Mode
    if (processedStepsRef.current[step.id]) return;
    processedStepsRef.current[step.id] = true;

    if (step.sender === 'system') {
      // System message displays instantly
      setMessages(prev => [...prev, {
        ...step,
        timestamp: getFormattedTime()
      }]);
      setCurrentStepIndex(prev => prev + 1);
      scrollToBottom();
    } else if (step.sender === 'partner') {
      // Simulate typing indicator
      const delay = step.delay || 1000;
      setIsTyping(true);
      scrollToBottom();

      const timer = setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: step.id,
          sender: 'partner',
          type: step.type,
          content: step.content,
          mediaUrl: step.mediaUrl,
          title: step.title,
          duration: step.duration,
          timestamp: getFormattedTime()
        }]);
        playNotificationSound('received');
        scrollToBottom();

        // If this step has options, present them as quick replies
        if (step.options && step.options.length > 0) {
          setQuickReplies(step.options);
        } else {
          // If no options, proceed to next step automatically
          setCurrentStepIndex(prev => prev + 1);
        }
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [currentStepIndex]);

  // Synchronize Voice Note progress and state with the real audio track
  useEffect(() => {
    if (!voiceSound) return;

    const handleTimeUpdate = () => {
      if (voiceSound.duration) {
        setAudioProgress((voiceSound.currentTime / voiceSound.duration) * 100);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setAudioProgress(0);
    };

    voiceSound.addEventListener('timeupdate', handleTimeUpdate);
    voiceSound.addEventListener('ended', handleEnded);

    return () => {
      voiceSound.removeEventListener('timeupdate', handleTimeUpdate);
      voiceSound.removeEventListener('ended', handleEnded);
    };
  }, [voiceSound]);

  // Clean up and stop voice note on unmount
  useEffect(() => {
    return () => {
      if (voiceSound) {
        voiceSound.pause();
        voiceSound.currentTime = 0;
      }
    };
  }, [voiceSound]);

  // Handle Voice Note real audio play/pause
  const togglePlayAudio = () => {
    if (!voiceSound) return;

    if (isPlaying) {
      voiceSound.pause();
      setIsPlaying(false);
    } else {
      voiceSound.play().catch(e => console.log('Voice note play blocked', e));
      setIsPlaying(true);
    }
  };

  // Handle Quick Reply selection
  const handleSelectOption = (option: string) => {
    // Clear quick replies
    setQuickReplies([]);

    // 1. Add user's sent message to chat
    const userMsgId = `user-reply-${Date.now()}`;
    setMessages(prev => [...prev, {
      id: userMsgId,
      sender: 'user',
      type: 'text',
      content: option,
      timestamp: getFormattedTime()
    }]);
    playNotificationSound('sent');
    scrollToBottom();

    // 2. Advance to the next step (which will be partner's response)
    // First, let's find if we need to skip or customize steps.
    // In our simplified chat script, steps are linear.
    // Let's adjust current index to trigger partner's reply.
    setCurrentStepIndex(prev => prev + 1);
  };

  return (
    <div className="relative flex flex-col h-screen w-full bg-[#0b141a] select-none text-[#e9edef] font-sans">

      {/* WhatsApp Header */}
      <div className="z-10 flex items-center justify-between bg-[#202c33] px-3 py-2.5 shadow-md">
        <div className="flex items-center gap-2">
          <button className="p-1 hover:bg-[#2a3942] rounded-full text-[#aebac1] transition-colors md:hidden">
            <ArrowLeft size={20} />
          </button>

          {/* Avatar Profile */}
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700/50 overflow-hidden shadow flex items-center justify-center">
              <img src="/profil.jpg" alt="Deni" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#00e676] rounded-full border-2 border-[#202c33]" />
          </div>

          {/* Partner Info */}
          <div className="flex flex-col ml-1">
            <span className="font-semibold text-[16px] text-[#e9edef] leading-tight flex items-center gap-1.5">
              Deni ❤️
            </span>
            <span className="text-xs text-[#8696a0]">
              {isTyping ? (
                <span className="text-[#00a884] font-medium animate-pulse">sedang mengetik...</span>
              ) : (
                'online'
              )}
            </span>
          </div>
        </div>

        {/* Header Icons */}
        <div className="flex items-center gap-5 text-[#aebac1]">
          <button className="hover:text-white transition-colors cursor-pointer p-1">
            <Video size={20} />
          </button>
          <button className="hover:text-white transition-colors cursor-pointer p-1">
            <Phone size={18} />
          </button>
          <button className="hover:text-white transition-colors cursor-pointer p-1">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Chat Area Wallpaper Overlay */}
      <div className="whatsapp-bg" />

      {/* Chat Content Body */}
      <div className="flex-1 overflow-y-auto px-4 py-4 z-10 relative flex flex-col gap-3.5 pb-24">
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            if (msg.sender === 'system') {
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mx-auto my-2 max-w-[85%] text-center"
                >
                  <div className="bg-[#182229] border border-[#222e35] text-[#ffe69c] text-[11.5px] px-3.5 py-1.5 rounded-lg inline-flex items-start gap-1.5 leading-relaxed shadow-sm">
                    <Lock size={12} className="text-[#ffe69c] flex-shrink-0 mt-0.5" />
                    <span>{msg.content}</span>
                  </div>
                </motion.div>
              );
            }

            const isPartner = msg.sender === 'partner';
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 260 }}
                className={`flex w-full ${isPartner ? 'justify-start' : 'justify-end'}`}
              >
                {/* Bubble Container */}
                <div
                  className={`relative max-w-[80%] md:max-w-[55%] rounded-lg px-3 py-1.5 shadow-[0_1px_0.5px_rgba(0,0,0,0.13)] border border-white/5 ${isPartner
                    ? 'bg-[#202c33] text-[#e9edef] rounded-tl-none'
                    : 'bg-[#005c4b] text-[#e9edef] rounded-tr-none'
                    }`}
                >
                  {/* Bubble Tail */}
                  <div className={`absolute top-0 w-3 h-3 overflow-hidden ${isPartner
                    ? '-left-2.5 text-[#202c33]'
                    : '-right-2.5 text-[#005c4b]'
                    }`}>
                    <svg viewBox="0 0 8 13" width="8" height="13" className="fill-current">
                      {isPartner ? (
                        <path d="M1.533 3.568L8 12.133V0H2.812C1.042 0 .474 1.62 1.533 3.568z" />
                      ) : (
                        <path d="M6.467 3.568L0 12.133V0h5.188c1.77 0 2.338 1.62 1.279 3.568z" />
                      )}
                    </svg>
                  </div>

                  {/* Text Message */}
                  {msg.type === 'text' && (
                    <div className="pr-10 text-[14.5px] whitespace-pre-wrap leading-relaxed">
                      {msg.content}
                    </div>
                  )}

                  {/* Image Message */}
                  {msg.type === 'image' && (
                    <div className="flex flex-col gap-1.5 max-w-full">
                      <div className="rounded-md overflow-hidden bg-black/20 border border-white/5 relative group">
                        <img
                          src={msg.mediaUrl}
                          alt={msg.title}
                          className="w-full max-h-60 object-cover cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-[10px] text-white/80 font-medium border border-white/10">
                          {msg.title}
                        </div>
                      </div>
                      {msg.content && (
                        <p className="text-[14.5px] pr-10 leading-relaxed pt-1">
                          {msg.content}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Voice Note Message */}
                  {msg.type === 'voice' && (
                    <div className="flex items-center gap-3.5 py-1 pr-6 min-w-[200px]">
                      {/* Play/Pause Button */}
                      <button
                        onClick={togglePlayAudio}
                        className="w-9 h-9 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center cursor-pointer hover:bg-pink-500/30 transition-colors"
                      >
                        {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                      </button>

                      {/* Waveform Visualization */}
                      <div className="flex-1 flex flex-col gap-1">
                        <div className="h-6 flex items-center gap-[3px] overflow-hidden">
                          {[...Array(24)].map((_, idx) => {
                            // Pseudo random height waveform
                            const heights = [10, 16, 22, 14, 8, 18, 24, 12, 16, 20, 14, 10, 18, 12, 8, 16, 22, 14, 18, 10, 12, 8, 14, 10];
                            const height = heights[idx % heights.length];

                            // Visualizer progress color
                            const isActive = (idx / 24) * 100 <= audioProgress;

                            return (
                              <div
                                key={idx}
                                className="w-[3px] rounded-full transition-all duration-300"
                                style={{
                                  height: `${height}px`,
                                  backgroundColor: isPlaying && isActive ? '#ec4899' : '#8696a0'
                                }}
                              />
                            );
                          })}
                        </div>
                        <span className="text-[10px] text-[#8696a0]">
                          {voiceSound && voiceSound.duration ? formatDuration(voiceSound.duration) : msg.duration}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Special Gift Card Message */}
                  {msg.type === 'card' && (
                    <div className="flex flex-col items-center py-4 px-2 text-center min-w-[240px]">
                      <div className="w-16 h-16 rounded-full bg-pink-500/10 flex items-center justify-center mb-3.5 border border-pink-500/20">
                        <motion.div
                          animate={{ scale: [1, 1.15, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <Heart size={32} className="text-pink-500 fill-pink-500" />
                        </motion.div>
                      </div>
                      <h4 className="font-display font-bold text-lg text-pink-400 mb-1">
                        {msg.title}
                      </h4>
                      <p className="text-xs text-[#8696a0] mb-4">
                        {msg.content}
                      </p>
                      <button
                        onClick={onOpenCard}
                        className="w-full bg-[#008069] hover:bg-[#00a884] active:scale-95 text-white font-medium text-sm py-2 px-4 rounded-full shadow transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Mail size={16} />
                        Buka Surat
                      </button>
                    </div>
                  )}

                  {/* Time and Blue Ticks */}
                  <div className="absolute bottom-1 right-2 flex items-center gap-1">
                    <span className="text-[10px] text-[#8696a0] select-none">
                      {msg.timestamp}
                    </span>
                    {!isPartner && (
                      <CheckCheck size={14} className="text-[#53bdeb]" />
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Typing Indicator Bubble */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="flex w-full justify-start"
            >
              <div className="relative bg-[#202c33] rounded-lg px-4 py-3 shadow border border-white/5 rounded-tl-none flex items-center gap-1 min-w-[70px]">
                <div className="absolute top-0 -left-2.5 text-[#202c33] w-3 h-3 overflow-hidden">
                  <svg viewBox="0 0 8 13" width="8" height="13" className="fill-current">
                    <path d="M1.533 3.568L8 12.133V0H2.812C1.042 0 .474 1.62 1.533 3.568z" />
                  </svg>
                </div>
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={chatEndRef} />
      </div>

      {/* Floating Quick Reply Options */}
      {quickReplies.length > 0 && (
        <div className="absolute bottom-16 left-0 right-0 z-20 flex flex-col items-center gap-2 px-4 py-2 bg-gradient-to-t from-[#0b141a] to-transparent">
          <span className="text-xs text-pink-400/80 font-medium tracking-wide">Pilih balasan:</span>
          <div className="flex flex-wrap gap-2.5 justify-center">
            {quickReplies.map((option, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSelectOption(option)}
                className="bg-[#202c33] hover:bg-[#2a3942] active:bg-[#202c33] border border-pink-500/20 text-[#e9edef] rounded-full px-[18px] py-2 text-[13px] font-medium shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <MessageSquare size={13} className="text-pink-400" />
                {option}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* WhatsApp Bottom Send Bar */}
      <div className="z-10 bg-[#202c33] px-3.5 py-2.5 flex items-center gap-3">
        <div className="flex items-center gap-3.5 text-[#aebac1]">
          <button className="hover:text-[#e9edef] transition-colors cursor-pointer">
            <Smile size={22} />
          </button>
          <button className="hover:text-[#e9edef] transition-colors cursor-pointer">
            <Paperclip size={20} className="rotate-45" />
          </button>
        </div>

        {/* TextInput Box */}
        <div className="flex-1 bg-[#2a3942] rounded-lg px-3 py-1.5 flex items-center">
          <input
            type="text"
            placeholder="Ketik pesan..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={quickReplies.length > 0}
            className="w-full bg-transparent border-none outline-none text-[#e9edef] text-[14.5px] placeholder-[#8696a0]"
          />
        </div>

        {/* Audio mic or Send Icon */}
        <button
          className="w-[38px] h-[38px] rounded-full bg-[#00a884] text-white flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
        >
          {inputText ? <Send size={16} className="ml-0.5" /> : <Mic size={18} />}
        </button>
      </div>
    </div>
  );
};

export default WhatsAppChat;
