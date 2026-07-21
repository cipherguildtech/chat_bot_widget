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
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>

          {/* Chat Window */}
          <motion.div
            ref={chatWindowRef}
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
            <Header
              isMinimized={isMinimized}
              onToggleMinimize={onToggleMinimize}
              onToggleChat={onToggleChat}
            />

            {!isMinimized && (
              <div className="flex flex-col flex-1 min-h-0">
                <Chats
                  messages={messages}
                  isLoading={isLoading}
                  messagesEndRef={messagesEndRef}
                />
                <Footer
                  inputText={inputText}
                  isLoading={isLoading}
                  onInputChange={onInputChange}
                  onSendMessage={onSendMessage}
                  onKeyPress={onKeyPress}
                  inputRef={inputRef}
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