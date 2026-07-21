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
      initial={{ opacity: 1, y: 10 }}
      animate={{ opacity: 1, y: 10 }}
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
              // Add these for text wrapping
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              whiteSpace: 'pre-wrap',
            }
            : {
              background: 'rgba(255,255,255,0.08)',
              color: '#E5E7EB',
              border: '1px solid rgba(255,255,255,0.05)',
              borderBottomLeftRadius: 4,
              // Add these for text wrapping
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              whiteSpace: 'pre-wrap',
            }
        }
      >
        <p style={{
          margin: 0,
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          whiteSpace: 'pre-wrap'
        }}>
          {message.content}
        </p>
        <span className="text-[10px] opacity-60 mt-1 block text-right">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </motion.div>
  );

  const TypingIndicator = () => (
    <motion.div
      initial={{ opacity: 1 }}
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
  );

  return (
    <div
      className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
      style={{
        overflowY: 'auto',
        overscrollBehavior: 'contain',
      }}
    >
      {messages.map((message, index) => (
        <MessageBubble key={message.id} message={message} index={index} />
      ))}
      {isLoading && <TypingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Chats;