import React from 'react';
import { motion } from 'framer-motion';
import type { Message } from '../types';

interface ChatsProps {
  messages: Message[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const Chats: React.FC<ChatsProps> = ({
  messages,
  isLoading,
  messagesEndRef,
}) => {
  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const MessageBubble = ({ message, index }: { message: Message; index: number }) => (
    <motion.div
      key={message.id}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: index * 0.05,
        type: 'spring',
        stiffness: 100,
        damping: 15
      }}
      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className="max-w-[80%] px-4 py-2.5 rounded-2xl text-sm shadow-lg"
        style={
          message.type === 'user'
            ? {
              background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
              color: 'white',
              borderBottomRightRadius: 4,
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              whiteSpace: 'pre-wrap',
              boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)',
            }
            : {
              background: 'rgba(255,255,255,0.08)',
              color: '#E5E7EB',
              border: '1px solid rgba(255,255,255,0.05)',
              borderBottomLeftRadius: 4,
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              whiteSpace: 'pre-wrap',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            }
        }
      >
        <p style={{
          margin: 0,
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          whiteSpace: 'pre-wrap',
          lineHeight: 1.5,
        }}>
          {message.content}
        </p>
        <span className="text-[10px] opacity-60 mt-1.5 block text-right">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </motion.div>
  );

  const TypingIndicator = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start"
    >
      <div className="bg-white/10 border border-white/5 rounded-2xl px-4 py-2.5 flex items-center gap-2 backdrop-blur-sm">
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
                ease: "easeInOut",
              }}
            />
          ))}
        </span>
        <span className="text-xs text-white/60">AI is thinking...</span>
      </div>
    </motion.div>
  );

  // Custom scrollbar styles
  const scrollbarStyles = {
    // For Webkit browsers (Chrome, Safari, Edge)
    '&::-webkit-scrollbar': {
      width: '6px',
      height: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '10px',
      margin: '4px 0',
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'linear-gradient(180deg, #25D366 0%, #128C7E 100%)',
      borderRadius: '10px',
      transition: 'all 0.3s ease',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: 'linear-gradient(180deg, #2dde72 0%, #15a085 100%)',
      cursor: 'pointer',
    },
    // For Firefox
    scrollbarWidth: 'thin',
    scrollbarColor: '#25D366 rgba(255, 255, 255, 0.05)',
  };

  return (
    <div
      className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
      style={{
        overflowY: 'auto',
        overscrollBehavior: 'contain',
        ...scrollbarStyles,
        // Smooth scrolling
        scrollBehavior: 'smooth',
        // Padding for better scroll visibility
        paddingRight: '16px',
        paddingLeft: '16px',
        // Gradient overlay for scroll indication
        position: 'relative',
      }}
    >
      {/* Gradient overlay at bottom to indicate more messages */}
      <div
        style={{
          position: 'sticky',
          bottom: 0,
          height: '20px',
          background: 'linear-gradient(to top, rgba(26, 26, 46, 0.8), transparent)',
          pointerEvents: 'none',
          marginTop: '-20px',
          zIndex: 1,
        }}
      />

      {messages.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center justify-center h-full text-center px-4"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-white text-lg font-medium mb-2">No messages yet</h3>
          <p className="text-white/40 text-sm max-w-xs">
            Start a conversation by typing a message below
          </p>
        </motion.div>
      ) : (
        <>
          {messages.map((message, index) => (
            <MessageBubble key={message.id} message={message} index={index} />
          ))}
          {isLoading && <TypingIndicator />}
        </>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default Chats;