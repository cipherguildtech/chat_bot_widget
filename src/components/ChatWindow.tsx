import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Minimize2, Maximize2, Loader2 } from 'lucide-react';
import type { ChatWindowProps } from '../types';

const ChatWindow: React.FC<ChatWindowProps> = ({
  isOpen,
  isMinimized,
  messages,
  isLoading,
  inputText,
  onSendMessage,
  onToggleMinimize,
  onToggleChat,
  onInputChange,
  onKeyPress,
  messagesEndRef,
  inputRef,
}) => {
  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  // Header component
  const Header = () => (
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
          onClick={onToggleMinimize}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
        </button>
        <button
          onClick={onToggleChat}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  // Messages component
  const Messages = () => (
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
  );

  // Input component
  const Input = () => (
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
          onChange={(e) => onInputChange(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-transparent text-sm text-white placeholder-white/40"
          disabled={isLoading}
        />
        <button
          onClick={() => onSendMessage(inputText)}
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
  );

  return (
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
            onClick={onToggleChat}
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
            <Header />
            {!isMinimized && (
              <div className="flex flex-col flex-1 min-h-0">
                <Messages />
                <Input />
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ChatWindow;