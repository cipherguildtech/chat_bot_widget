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
    chatWindowRef,
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
        chatWindowRef = {chatWindowRef}
      />
    </>
  );
};

export default FloatingAIBot;