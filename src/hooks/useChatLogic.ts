import { useState, useEffect, useRef } from 'react';
import type { Message } from '../types';
import { chat } from '../api/chat_api';

export const useChatLogic = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hey there! 👋 How can I help you today?', // Changed from Promise to string
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

  const getAIResponse = async (messageText: string): Promise<string> => {
    const response = await chat(messageText.trim());
    return response;
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: text.trim(), // Changed from Promise to string
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Actually call the API here instead of using setTimeout with getAIResponse
    try {
      const response = await getAIResponse(text);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response, // String, not Promise
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      // Optionally add an error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
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
        toggleChat();
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

// import { useState, useEffect, useRef } from 'react';
// import type { Message } from '../types';
// import { chat } from '../api/chat_api';

// export const useChatLogic = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isMinimized, setIsMinimized] = useState(false);
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: '1',
//       type: 'bot',
//             content: Promise.resolve('Hey there! 👋 How can I help you today?'),

//       // content: ,
//       timestamp: new Date(),
//     },
//   ]);
//   const chatWindowRef = useRef<HTMLDivElement>(null);
//   const [inputText, setInputText] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLInputElement>(null);

//   // Scroll to bottom when messages change
//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   }, [messages, isLoading]);

//   // Focus input when chat opens
//   useEffect(() => {
//     if (isOpen && !isMinimized) {
//       setTimeout(() => inputRef.current?.focus(), 300);
//     }
//   }, [isOpen, isMinimized]);

//   // Prevent body scroll when chat is open
//   useEffect(() => {
//     if (isOpen) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = '';
//     }
//     return () => {
//       document.body.style.overflow = '';
//     };
//   }, [isOpen]);

  

//   const getAIResponse = async (messageText:string): Promise<string> => {
//     const response = await chat(messageText);
            
            
//     return response;
//   };

//   const handleSendMessage = async (text: string) => {
//     if (!text.trim() || isLoading) return;

//     const userMessage: Message = {
//       id: Date.now().toString(),
//       type: 'user',
//       content: Promise.resolve(text.trim()),
//       timestamp: new Date(),
//     };

//     setMessages((prev) => [...prev, userMessage]);
//     setInputText('');
//     setIsLoading(true);

//     setTimeout(() => {
//       const botMessage: Message = {
//         id: (Date.now() + 1).toString(),
//         type: 'bot',
//         content: getAIResponse(text),
//         timestamp: new Date(),
//       };
//       setMessages((prev) => [...prev, botMessage]);
//       setIsLoading(false);
//     }, 1200);
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage(inputText);
//     }
//   };

//   const toggleChat = () => {
//     setIsOpen(!isOpen);
//     setIsMinimized(false);
//   };

//   useEffect(() => {
//   function handlePointerDown(event: MouseEvent | TouchEvent) {
//     if (
//       chatWindowRef.current &&
//       !chatWindowRef.current.contains(event.target as Node)
//     ) {
//       toggleChat(); // Close the chat
//     }
//   }

//   document.addEventListener("mousedown", handlePointerDown);
//   document.addEventListener("touchstart", handlePointerDown);

//   return () => {
//     document.removeEventListener("mousedown", handlePointerDown);
//     document.removeEventListener("touchstart", handlePointerDown);
//   };
// }, [toggleChat]);

//   const toggleMinimize = () => setIsMinimized(!isMinimized);

//   return {
//     isOpen,
//     isMinimized,
//     messages,
//     isLoading,
//     inputText,
//     chatWindowRef,
//     messagesEndRef,
//     inputRef,
//     setInputText,
//     handleSendMessage,
//     handleKeyPress,
//     toggleChat,
//     toggleMinimize,
//   };
// };