import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Message } from '../types';
import './Chats.css';

interface ChatsProps {
  messages: Message[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  bg_color: string;
  fg_color: string;
  text_color: string;
}

const hexToRgba = (hex: string, alpha: number) => {
  const sanitized = hex.replace('#', '');
  if (sanitized.length !== 6) return `rgba(0,0,0,${alpha})`;
  const bigint = parseInt(sanitized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Component to handle async message content
const MessageContent: React.FC<{ content: Promise<string> | string }> = ({ content }) => {
  const [resolvedContent, setResolvedContent] = useState<string>('');

  useEffect(() => {
    // If content is a Promise, resolve it
    if (content instanceof Promise) {
      content.then(setResolvedContent);
    } else {
      setResolvedContent(content);
    }
  }, [content]);

  return <>{resolvedContent || 'Loading...'}</>;
};

const Chats: React.FC<ChatsProps> = ({
  messages,
  isLoading,
  messagesEndRef,
  bg_color,
  fg_color,
  text_color,
}) => {
  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

  // Memoize styles to prevent recreation on every render
  const styles = useMemo(() => ({
    scrollbarTrack: hexToRgba(bg_color, 0.08),
    scrollbarThumb: fg_color,
    scrollbarThumbHover: hexToRgba(fg_color, 0.8),
    userMessageBg: bg_color,
    userMessageColor: fg_color,
    userMessageShadow: hexToRgba(bg_color, 0.35),
    botMessageBg: hexToRgba(bg_color, 0.12),
    botMessageBorder: hexToRgba(bg_color, 0.2),
    emptyIconBg: hexToRgba(bg_color, 0.15),
  }), [bg_color, fg_color]);

  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="flex flex-col items-center justify-center h-full text-center px-4"
    >
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
        style={{ background: styles.emptyIconBg }}
      >
        <svg
          className="w-10 h-10"
          style={{ color: fg_color }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium mb-2" style={{ color: text_color }}>
        No messages yet
      </h3>
      <p
        className="text-sm max-w-xs"
        style={{ color: text_color, opacity: 0.6 }}
      >
        Start a conversation by typing a message below
      </p>
    </motion.div>
  );

  const MessageBubble = ({ message, index }: { message: Message; index: number }) => {
    const isUser = message.type === 'user';
    
    return (
      <motion.div
        key={message.id}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          delay: index * 0.05,
          type: 'spring',
          stiffness: 100,
          damping: 15,
        }}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
      >
        <div
          className="max-w-[80%] px-4 py-2.5 rounded-2xl text-sm shadow-lg"
          style={
            isUser
              ? {
                  background: styles.userMessageBg,
                  color: styles.userMessageColor,
                  borderBottomRightRadius: 4,
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  whiteSpace: 'pre-wrap',
                  boxShadow: `0 4px 12px ${styles.userMessageShadow}`,
                }
              : {
                  background: styles.botMessageBg,
                  color: text_color,
                  border: `1px solid ${styles.botMessageBorder}`,
                  borderBottomLeftRadius: 4,
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  whiteSpace: 'pre-wrap',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                }
          }
        >
          <p
            style={{
              margin: 0,
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              whiteSpace: 'pre-wrap',
              lineHeight: 1.5,
            }}
          >
            <MessageContent content={message.content} />
          </p>
          <span
            className="text-[10px] mt-1.5 block text-right"
            style={{
              opacity: 0.65,
              color: isUser ? fg_color : text_color,
            }}
          >
            {formatTime(message.timestamp)}
          </span>
        </div>
      </motion.div>
    );
  };

  const LoadingIndicator = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start"
    >
      <div
        className="rounded-2xl px-4 py-2.5 flex items-center gap-2 backdrop-blur-sm"
        style={{
          background: styles.botMessageBg,
          border: `1px solid ${styles.botMessageBorder}`,
        }}
      >
        <span className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: fg_color }}
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut',
              }}
            />
          ))}
        </span>
        <span className="text-xs" style={{ color: text_color, opacity: 0.7 }}>
          thinking...
        </span>
      </div>
    </motion.div>
  );

  return (
    <>
      <style>{`
        .chat-scroll-container::-webkit-scrollbar {
          width: 8px;
        }
        .chat-scroll-container::-webkit-scrollbar-track {
          background: ${styles.scrollbarTrack};
        }
        .chat-scroll-container::-webkit-scrollbar-thumb {
          background: ${styles.scrollbarThumb};
          border-radius: 999px;
        }
        .chat-scroll-container::-webkit-scrollbar-thumb:hover {
          background: ${styles.scrollbarThumbHover};
        }
        .chat-scroll-container {
          scrollbar-width: thin;
          scrollbar-color: ${styles.scrollbarThumb} ${styles.scrollbarTrack};
        }
      `}</style>

      <div className="chat-scroll-container space-y-3 p-4 overflow-y-auto flex-1">
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {messages.map((message, index) => (
              <MessageBubble key={message.id} message={message} index={index} />
            ))}
            {isLoading && <LoadingIndicator />}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>
    </>
  );
};

export default Chats;