import React from 'react';
import FloatingButton from '../components/FloatingButton';
import ChatWindow from '../components/ChatWindow';
import { useChatLogic } from '../hooks/useChatLogic';

interface FloatingAIBotProps {
  position: string;
  bg_color: string;
  button_bg_color: string;
  button_fg_color: string;
  fg_color: string;
  text_color:string;
}

const FloatingAIBot: React.FC<FloatingAIBotProps> = ({
  position,
  bg_color,
   button_bg_color,
    button_fg_color, 
    fg_color,
    text_color,
}) => {
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
      <FloatingButton isOpen={isOpen} onClick={toggleChat} bg_color={button_bg_color} fg_color={button_fg_color} position={position} />

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
        chatWindowRef={chatWindowRef}
        position={position}
        bg_color={bg_color}
        fg_color={fg_color}
        text_color={text_color}
      />
    </>
  );
};

export default FloatingAIBot;