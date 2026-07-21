import { useState, useEffect, useRef } from 'react';
import type { Message } from '../types';

export const useChatLogic = () => {
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
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isMinimized]);

  // Prevent body scroll when chat is open
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

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: text,
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputText);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  useEffect(() => {
  function handlePointerDown(event: MouseEvent | TouchEvent) {
    if (
      chatWindowRef.current &&
      !chatWindowRef.current.contains(event.target as Node)
    ) {
      toggleChat(); // Close the chat
    }
  }

  document.addEventListener("mousedown", handlePointerDown);
  document.addEventListener("touchstart", handlePointerDown);

  return () => {
    document.removeEventListener("mousedown", handlePointerDown);
    document.removeEventListener("touchstart", handlePointerDown);
  };
}, [toggleChat]);

  const toggleMinimize = () => setIsMinimized(!isMinimized);

  return {
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
  };
};