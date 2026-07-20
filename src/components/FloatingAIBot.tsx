import React from 'react';
import FloatingButton from '../components/FloatingButton';
import ChatWindow from '../components/ChatWindow';
import { useChatLogic } from '../hooks/useChatLogic';

const FloatingAIBot: React.FC = () => {
  const {
    isOpen,
    isMinimized,
    messages,
    isLoading,
    inputText,
    messagesEndRef,
    inputRef,
    setInputText,
    handleSendMessage,
    handleKeyPress,
    toggleChat,
    toggleMinimize,
  } = useChatLogic();

  return (
    <>
      <FloatingButton isOpen={isOpen} onClick={toggleChat} />
      
      <ChatWindow
        isOpen={isOpen}
        isMinimized={isMinimized}
        messages={messages}
        isLoading={isLoading}
        inputText={inputText}
        onSendMessage={handleSendMessage}
        onToggleMinimize={toggleMinimize}
        onToggleChat={toggleChat}
        onInputChange={setInputText}
        onKeyPress={handleKeyPress}
        messagesEndRef={messagesEndRef}
        inputRef={inputRef}
      />

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