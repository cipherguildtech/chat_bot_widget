import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Minimize2, Maximize2, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const ChatGlyph: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M16 4C9.373 4 4 9.163 4 15.5c0 3.06 1.24 5.84 3.27 7.9-.18 1.63-.7 3.13-1.52 4.4a.6.6 0 00.66.9c2-.45 3.86-1.28 5.4-2.4A13.6 13.6 0 0016 27c6.627 0 12-5.163 12-11.5S22.627 4 16 4z"
      fill="currentColor"
    />
    <path
      d="M11.5 14.2c.3-.7.6-.7.9-.7h.5c.25 0 .45.1.55.4l.7 1.9c.1.25.05.5-.1.7l-.55.65c-.15.2-.15.4-.05.6.5.9 1.6 2 2.5 2.5.2.1.4.1.6-.05l.65-.55c.2-.15.45-.2.7-.1l1.9.7c.3.1.4.3.4.55v.5c0 .3 0 .6-.7.9-.7.3-1.7.4-2.9-.1-1.2-.5-2.7-1.5-3.9-2.7-1.2-1.2-2.2-2.7-2.7-3.9-.5-1.2-.4-2.2-.1-2.9z"
      fill="white"
    />
  </svg>
);

const FloatingAIBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hey there! 👋 How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isMinimized]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: getAIResponse(),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 1200);
  };

  const getAIResponse = (): string => {
    const responses = [
      "That's a great question! Let me think about that... 🤔",
      'I understand your concern. Here\'s what I can suggest... 💡',
      "Thanks for asking! I'd be happy to help with that. 😊",
      "That's interesting! Let me provide some insights for you. 🔍",
      'I appreciate your question. Here\'s what you need to know... 📝',
      'Let me break that down for you step by step. 📋',
      "Great question! I'm on it. 🚀",
      'I see what you mean. Here\'s my take on that... ✨',
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const toggleMinimize = () => setIsMinimized(!isMinimized);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      {/* Floating Button */}
      <motion.button
        className="fixed bottom-6 right-6 z-[10000] flex items-center justify-center w-14 h-14 rounded-full focus:outline-none shadow-lg"
        style={{
          background: 'linear-gradient(145deg, #25D366 0%, #128C7E 100%)',
          boxShadow: '0 4px 20px rgba(18,140,126,0.5)',
        }}
        onClick={toggleChat}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.92 }}
        animate={{
          scale: isOpen ? 0 : 1,
          opacity: isOpen ? 0 : 1
        }}
        transition={{ duration: 0.2 }}
      >
        <ChatGlyph className="w-7 h-7 text-white" />
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999]"
              onClick={() => setIsOpen(false)}
            />

            {/* Chat Window */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{
                type: 'spring',
                damping: 30,
                stiffness: 300,
                duration: 0.3
              }}
              className="fixed right-0 top-0 z-[10000] flex flex-col"
              style={{
                width: '380px',
                height: '100vh',
                background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                boxShadow: '-8px 0 40px rgba(0,0,0,0.6)',
                borderLeft: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              {/* HEADER - FIXED TOP */}
              <div
                className="flex items-center justify-between px-5 py-4 border-b border-white/10"
                style={{ background: 'rgba(18,140,126,0.15)' }}
              >
                <div>
                  <h3 className="font-semibold text-white text-base">AI Assistant</h3>
                  <p className="text-xs text-emerald-300/80 flex items-center mt-0.5">
                    <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                    Online
                  </p>
                </div>
                <div className="flex items-center gap-1 text-white/70">
                  <button
                    onClick={toggleMinimize}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={toggleChat}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* BODY - FILLS REMAINING SPACE */}
              {!isMinimized && (
                <div className="flex flex-col flex-1 min-h-0">
                  {/* MESSAGES - SCROLLABLE */}
                  <div
                    className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
                    style={{
                      overflowY: 'auto',
                      overscrollBehavior: 'contain',
                    }}
                  >
                    {messages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className="max-w-[80%] px-4 py-2.5 rounded-2xl text-sm"
                          style={
                            message.type === 'user'
                              ? {
                                background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                                color: 'white',
                                borderBottomRightRadius: 4,
                              }
                              : {
                                background: 'rgba(255,255,255,0.08)',
                                color: '#E5E7EB',
                                border: '1px solid rgba(255,255,255,0.05)',
                                borderBottomLeftRadius: 4,
                              }
                          }
                        >
                          <p>{message.content}</p>
                          <span className="text-[10px] opacity-60 mt-1 block text-right">
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                      >
                        <div className="bg-white/10 border border-white/5 rounded-2xl px-4 py-2.5 flex items-center gap-2">
                          <span className="flex gap-1">
                            {[0, 1, 2].map((i) => (
                              <motion.span
                                key={i}
                                className="w-2 h-2 rounded-full bg-emerald-400"
                                animate={{ y: [0, -6, 0] }}
                                transition={{
                                  duration: 0.6,
                                  repeat: Infinity,
                                  delay: i * 0.15,
                                }}
                              />
                            ))}
                          </span>
                          <span className="text-xs text-white/60">Typing...</span>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* INPUT - FIXED BOTTOM */}
                  <div
                    className="px-4 py-3 border-t border-white/10"
                    style={{
                      background: 'rgba(0,0,0,0.3)',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-transparent text-sm text-white placeholder-white/40"
                        disabled={isLoading}
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!inputText.trim() || isLoading}
                        className="p-2.5 rounded-full text-white transition-all flex-shrink-0"
                        style={{
                          background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                          opacity: !inputText.trim() || isLoading ? 0.4 : 1,
                          cursor: !inputText.trim() || isLoading ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        * {
          box-sizing: border-box;
        }
        ::-webkit-scrollbar {
          width: 5px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #25D366, #128C7E);
          border-radius: 999px;
        }
      `}</style>
    </>
  );
};

export default FloatingAIBot;