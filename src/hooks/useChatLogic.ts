import { useState, useEffect, useRef } from 'react';
import type { Message } from '../types';
import { chat } from '../api/chat_api';
 
export const useChatLogic = ({clientId}: {clientId: string}) => {
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

  // Extract last five conversations from messages
  const getLastFiveConversations = (): { question: string; answer: string }[] => {
    // Filter out bot's initial greeting message if you want to exclude it
    // or keep all messages. Let's exclude the initial greeting
    const conversationPairs: { question: string; answer: string }[] = [];
    
    // Iterate through messages and pair user messages with bot responses
    for (let i = 0; i < messages.length; i++) {
      if (messages[i].type === 'user' && i + 1 < messages.length && messages[i + 1].type === 'bot') {
        conversationPairs.push({
          question: messages[i].content,
          answer: messages[i + 1].content
        });
        i++; // Skip the bot message since we already used it
      }
    }
    
    // Get the last 5 conversations (or fewer if there are less)
    return conversationPairs.slice(-5);
  };

  // Alternative approach: Get last 10 messages and pair them
  // const getLastFiveConversationsAlt = (): { question: string; answer: string }[] => {
  //   const lastTenMessages = messages.slice(-10); // Get last 10 messages
    
  //   const pairs: { question: string; answer: string }[] = [];
  //   let i = 0;
    
  //   // Find the last user message and pair it with the following bot message
  //   while (i < lastTenMessages.length) {
  //     if (lastTenMessages[i].type === 'user') {
  //       // Look ahead for a bot message
  //       let j = i + 1;
  //       while (j < lastTenMessages.length && lastTenMessages[j].type !== 'bot') {
  //         j++;
  //       }
  //       if (j < lastTenMessages.length) {
  //         pairs.push({
  //           question: lastTenMessages[i].content,
  //           answer: lastTenMessages[j].content
  //         });
  //         i = j + 1; // Skip to after the bot message
  //       } else {
  //         i++;
  //       }
  //     } else {
  //       i++;
  //     }
  //   }
    
  //   return pairs.slice(-5);
  // };

  // Scroll to bottom only when the newest message is from the user
  useEffect(() => {
    if (!messagesEndRef.current) return;

    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.type === 'user') {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

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
    // Get last five conversations
    const lastFiveConversations = getLastFiveConversations();
    
    // Call the API with the last five conversations
    const response = await chat(messageText.trim(), lastFiveConversations,clientId);
    return response;
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await getAIResponse(text);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
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
//       content: 'Hey there! 👋 How can I help you today?', // Changed from Promise to string
//       timestamp: new Date(),
//     },
//   ]);
//   const chatWindowRef = useRef<HTMLDivElement>(null);
//   const [inputText, setInputText] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLInputElement>(null);

//   // Scroll to bottom only when the newest message is from the user
//   // useEffect(() => {
//   //   if (!messagesEndRef.current) return;

//   //   const lastMessage = messages[messages.length - 1];
//   //   // Only auto-scroll when the last message was sent by the user
//   //   if (lastMessage?.type === 'user') {
//   //     messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
//   //   }
//   // }, [messages]);

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

//   const getAIResponse = async (messageText: string, lastFiveConversations: { question: string; answer: string }[]): Promise<string> => {
//     const response = await chat(messageText.trim(), lastFiveConversations);
//     return response;
//   };

//   const handleSendMessage = async (text: string) => {
//     if (!text.trim() || isLoading) return;

//     const userMessage: Message = {
//       id: Date.now().toString(),
//       type: 'user',
//       content: text.trim(), // Changed from Promise to string
//       timestamp: new Date(),
//     };

//     setMessages((prev) => [...prev, userMessage]);
//     setInputText('');
//     setIsLoading(true);

//     // Actually call the API here instead of using setTimeout with getAIResponse
//     try {
//       const response = await getAIResponse(text);
//       const botMessage: Message = {
//         id: (Date.now() + 1).toString(),
//         type: 'bot',
//         content: response, // String, not Promise
//         timestamp: new Date(),
//       };
//       setMessages((prev) => [...prev, botMessage]);
//     } catch (error) {
//       console.error('Error getting AI response:', error);
//       // Optionally add an error message
//       const errorMessage: Message = {
//         id: (Date.now() + 1).toString(),
//         type: 'bot',
//         content: 'Sorry, I encountered an error. Please try again.',
//         timestamp: new Date(),
//       };
//       setMessages((prev) => [...prev, errorMessage]);
//     } finally {
//       setIsLoading(false);
//     }
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
//     function handlePointerDown(event: MouseEvent | TouchEvent) {
//       if (
//         chatWindowRef.current &&
//         !chatWindowRef.current.contains(event.target as Node)
//       ) {
//         toggleChat();
//       }
//     }

//     document.addEventListener("mousedown", handlePointerDown);
//     document.addEventListener("touchstart", handlePointerDown);

//     return () => {
//       document.removeEventListener("mousedown", handlePointerDown);
//       document.removeEventListener("touchstart", handlePointerDown);
//     };
//   }, [toggleChat]);

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