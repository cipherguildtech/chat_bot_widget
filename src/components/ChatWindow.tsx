import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ChatWindowProps } from '../types';
import Header from './Header';
import Chats from './Chats';
import Footer from './Footer';

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
  chatWindowRef,
  position,
  bg_color,
  fg_color,
  text_color,
}) => {
  const isLeft = position.toLowerCase() === 'left';
  return (
    <AnimatePresence>
      {isOpen && (
        <>

          {/* Chat Window */}
          <motion.div
            ref={chatWindowRef}
            initial={{ x: isLeft ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: isLeft ? '-100%' : '100%' }}
            transition={{
              type: 'spring',
              damping: 30,
              stiffness: 300,
              duration: 0.3
            }}
            className={`fixed top-0 ${isLeft ? 'left-0' : 'right-0'
              } z-[10000] flex flex-col`}
            style={{
              width: '380px',
              height: '100vh',
              background:
                'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
              boxShadow: isLeft
                ? '8px 0 40px rgba(0,0,0,0.6)'
                : '-8px 0 40px rgba(0,0,0,0.6)',
              borderRight: isLeft
                ? '1px solid rgba(255,255,255,0.05)'
                : undefined,
              borderLeft: !isLeft
                ? '1px solid rgba(255,255,255,0.05)'
                : undefined,
            }}
          >
            <Header
              isMinimized={isMinimized}
              onToggleMinimize={onToggleMinimize}
              onToggleChat={onToggleChat}
              bg_color={bg_color}
              fg_color={fg_color}
              text_color={text_color}
            />

            {!isMinimized && (
              <div className="flex flex-col flex-1 min-h-0">
                <Chats
                  messages={messages}
                  isLoading={isLoading}
                  messagesEndRef={messagesEndRef}
                  bg_color={bg_color}
              fg_color={fg_color}
              text_color={text_color}
                />
                <Footer
                  inputText={inputText}
                  isLoading={isLoading}
                  onInputChange={onInputChange}
                  onSendMessage={onSendMessage}
                  onKeyPress={onKeyPress}
                  inputRef={inputRef}
                  bg_color={bg_color}
              fg_color={fg_color}
              text_color={text_color}
                />
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ChatWindow;
