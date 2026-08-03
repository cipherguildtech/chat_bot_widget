import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
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

const MessageContent: React.FC<{ content: Promise<string> | string }> = ({ content }) => {
  const [resolvedContent, setResolvedContent] = useState<string>('');

  useEffect(() => {
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prevMessagesLengthRef = useRef(messages.length);
  const lastUserMessageIndexRef = useRef(-1);
  const isUserTriggeredScrollRef = useRef(false);
  const scrollPositionRef = useRef(0);
  const isInitialMountRef = useRef(true);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

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

  // Scroll to bottom function
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior,
      });
    }
  }, []);

  // Save current scroll position
  const saveScrollPosition = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollPositionRef.current = scrollContainerRef.current.scrollTop;
    }
  }, []);

  // Restore scroll position
  const restoreScrollPosition = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollPositionRef.current;
    }
  }, []);

  // Handle messages changes
  useEffect(() => {
    const hasNewMessages = messages.length > prevMessagesLengthRef.current;
    
    if (hasNewMessages) {
      const lastMessage = messages[messages.length - 1];
      
      if (lastMessage?.type === 'user') {
        // User sent a message - scroll to bottom
        isUserTriggeredScrollRef.current = true;
        lastUserMessageIndexRef.current = messages.length - 1;
        
        setTimeout(() => {
          scrollToBottom('auto');
          setTimeout(() => {
            isUserTriggeredScrollRef.current = false;
          }, 150);
        }, 50);
      } else if (lastMessage?.type === 'bot') {
        // Bot message - maintain current position
        // Save the current scroll position before any updates
        saveScrollPosition();
        
        // Use requestAnimationFrame to restore position after render
        requestAnimationFrame(() => {
          restoreScrollPosition();
        });
      }
    }

    prevMessagesLengthRef.current = messages.length;
  }, [messages, scrollToBottom, saveScrollPosition, restoreScrollPosition]);

  // Initial scroll to bottom
  useEffect(() => {
    if (isInitialMountRef.current && messages.length > 0) {
      setTimeout(() => scrollToBottom('auto'), 100);
      isInitialMountRef.current = false;
    }
  }, [messages.length, scrollToBottom]);

  // Override scrollIntoView to prevent any unwanted scrolls
  useEffect(() => {
    if (messagesEndRef.current) {
      const originalScrollIntoView = messagesEndRef.current.scrollIntoView;
      
      messagesEndRef.current.scrollIntoView = function (options?: boolean | ScrollIntoViewOptions) {
        // Only allow scroll if it's user-triggered
        if (isUserTriggeredScrollRef.current) {
          originalScrollIntoView.call(this, options);
        }
        // Block all other scroll attempts
      };
    }

    return () => {
      if (messagesEndRef.current) {
        // Clean up
      }
    };
  }, [messagesEndRef]);

  // Additional effect to handle streaming bot responses
  useEffect(() => {
    // If we're loading and have messages, it's likely a bot response
    if (isLoading && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage?.type === 'bot') {
        // Save position on every update during loading
        saveScrollPosition();
        requestAnimationFrame(() => {
          restoreScrollPosition();
        });
      }
    }
  }, [isLoading, messages, saveScrollPosition, restoreScrollPosition]);

  const EmptyState = () => (
    <div
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
    </div>
  );

  const MessageBubble = ({ message }: { message: Message; index: number }) => {
    const isUser = message.type === 'user';

    return (
      <div
        key={message.id}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}
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
      </div>
    );
  };

  const LoadingIndicator = () => (
    <div className="flex justify-start mb-3">
      <div
        className="rounded-2xl px-4 py-2.5 flex items-center gap-2 backdrop-blur-sm"
        style={{
          background: styles.botMessageBg,
          border: `1px solid ${styles.botMessageBorder}`,
        }}
      >
        <span className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: fg_color,
                animation: 'bounce 0.6s infinite',
                animationDelay: `${i * 0.15}s`
              }}
            />
          ))}
        </span>
        <span className="text-xs" style={{ color: text_color, opacity: 0.7 }}>
          thinking...
        </span>
      </div>
    </div>
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
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>

      <div
        ref={scrollContainerRef}
        className="chat-scroll-container p-4 overflow-y-auto flex-1"
        style={{ height: '100%' }}
      >
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

// import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
// import type { Message } from '../types';
// import './Chats.css';

// interface ChatsProps {
//   messages: Message[];
//   isLoading: boolean;
//   messagesEndRef: React.RefObject<HTMLDivElement>;
//   bg_color: string;
//   fg_color: string;
//   text_color: string;
// }

// const hexToRgba = (hex: string, alpha: number) => {
//   const sanitized = hex.replace('#', '');
//   if (sanitized.length !== 6) return `rgba(0,0,0,${alpha})`;
//   const bigint = parseInt(sanitized, 16);
//   const r = (bigint >> 16) & 255;
//   const g = (bigint >> 8) & 255;
//   const b = bigint & 255;
//   return `rgba(${r}, ${g}, ${b}, ${alpha})`;
// };

// const MessageContent: React.FC<{ content: Promise<string> | string }> = ({ content }) => {
//   const [resolvedContent, setResolvedContent] = useState<string>('');

//   useEffect(() => {
//     if (content instanceof Promise) {
//       content.then(setResolvedContent);
//     } else {
//       setResolvedContent(content);
//     }
//   }, [content]);

//   return <>{resolvedContent || 'Loading...'}</>;
// };

// const Chats: React.FC<ChatsProps> = ({
//   messages,
//   isLoading,
//   messagesEndRef,
//   bg_color,
//   fg_color,
//   text_color,
// }) => {
//   const scrollContainerRef = useRef<HTMLDivElement>(null);
//   const prevMessagesLengthRef = useRef(messages.length);
//   const shouldScrollRef = useRef(false);

//   const formatTime = (date: Date) =>
//     date.toLocaleTimeString('en-US', {
//       hour: '2-digit',
//       minute: '2-digit',
//     });

//   const styles = useMemo(() => ({
//     scrollbarTrack: hexToRgba(bg_color, 0.08),
//     scrollbarThumb: fg_color,
//     scrollbarThumbHover: hexToRgba(fg_color, 0.8),
//     userMessageBg: bg_color,
//     userMessageColor: fg_color,
//     userMessageShadow: hexToRgba(bg_color, 0.35),
//     botMessageBg: hexToRgba(bg_color, 0.12),
//     botMessageBorder: hexToRgba(bg_color, 0.2),
//     emptyIconBg: hexToRgba(bg_color, 0.15),
//   }), [bg_color, fg_color]);

//   // Scroll to bottom - only called for user messages
//   const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
//     if (scrollContainerRef.current) {
//       scrollContainerRef.current.scrollTo({
//         top: scrollContainerRef.current.scrollHeight,
//         behavior,
//       });
//     }
//   }, []);

//   // Handle new messages - ONLY scroll on user messages
//   useEffect(() => {
//     const hasNewMessages = messages.length > prevMessagesLengthRef.current;

//     if (hasNewMessages) {
//       const lastMessage = messages[messages.length - 1];
      
//       // ONLY scroll when user sends a message
//       if (lastMessage?.type === 'user') {
//         shouldScrollRef.current = true;
//         setTimeout(() => {
//           scrollToBottom('auto');
//           setTimeout(() => {
//             shouldScrollRef.current = false;
//           }, 100);
//         }, 50);
//       }
//       // Bot messages: DO ABSOLUTELY NOTHING
//     }

//     prevMessagesLengthRef.current = messages.length;
//   }, [messages, scrollToBottom]);

//   // Initial scroll to bottom
//   useEffect(() => {
//     setTimeout(() => scrollToBottom('auto'), 100);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // Block messagesEndRef from auto-scrolling on bot messages
//   useEffect(() => {
//     if (messagesEndRef.current) {
//       const originalScrollIntoView = messagesEndRef.current.scrollIntoView;
      
//       messagesEndRef.current.scrollIntoView = function (options?: boolean | ScrollIntoViewOptions) {
//         // Only allow scroll if it was triggered by a user message
//         if (shouldScrollRef.current) {
//           originalScrollIntoView.call(this, options);
//         }
//         // Otherwise, block all scroll attempts
//       };
//     }

//     return () => {
//       if (messagesEndRef.current) {
//         // Restore original method on cleanup
//       }
//     };
//   }, [messagesEndRef]);

//   const EmptyState = () => (
//     <div
//       className="flex flex-col items-center justify-center h-full text-center px-4"
//     >
//       <div
//         className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
//         style={{ background: styles.emptyIconBg }}
//       >
//         <svg
//           className="w-10 h-10"
//           style={{ color: fg_color }}
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
//           />
//         </svg>
//       </div>
//       <h3 className="text-lg font-medium mb-2" style={{ color: text_color }}>
//         No messages yet
//       </h3>
//       <p
//         className="text-sm max-w-xs"
//         style={{ color: text_color, opacity: 0.6 }}
//       >
//         Start a conversation by typing a message below
//       </p>
//     </div>
//   );

//   const MessageBubble = ({ message }: { message: Message; index: number }) => {
//     const isUser = message.type === 'user';

//     return (
//       <div
//         key={message.id}
//         className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}
//       >
//         <div
//           className="max-w-[80%] px-4 py-2.5 rounded-2xl text-sm shadow-lg"
//           style={
//             isUser
//               ? {
//                 background: styles.userMessageBg,
//                 color: styles.userMessageColor,
//                 borderBottomRightRadius: 4,
//                 wordWrap: 'break-word',
//                 overflowWrap: 'break-word',
//                 whiteSpace: 'pre-wrap',
//                 boxShadow: `0 4px 12px ${styles.userMessageShadow}`,
//               }
//               : {
//                 background: styles.botMessageBg,
//                 color: text_color,
//                 border: `1px solid ${styles.botMessageBorder}`,
//                 borderBottomLeftRadius: 4,
//                 wordWrap: 'break-word',
//                 overflowWrap: 'break-word',
//                 whiteSpace: 'pre-wrap',
//                 backdropFilter: 'blur(10px)',
//                 boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
//               }
//           }
//         >
//           <p
//             style={{
//               margin: 0,
//               wordWrap: 'break-word',
//               overflowWrap: 'break-word',
//               whiteSpace: 'pre-wrap',
//               lineHeight: 1.5,
//             }}
//           >
//             <MessageContent content={message.content} />
//           </p>
//           <span
//             className="text-[10px] mt-1.5 block text-right"
//             style={{
//               opacity: 0.65,
//               color: isUser ? fg_color : text_color,
//             }}
//           >
//             {formatTime(message.timestamp)}
//           </span>
//         </div>
//       </div>
//     );
//   };

//   const LoadingIndicator = () => (
//     <div className="flex justify-start mb-3">
//       <div
//         className="rounded-2xl px-4 py-2.5 flex items-center gap-2 backdrop-blur-sm"
//         style={{
//           background: styles.botMessageBg,
//           border: `1px solid ${styles.botMessageBorder}`,
//         }}
//       >
//         <span className="flex gap-1">
//           {[0, 1, 2].map((i) => (
//             <span
//               key={i}
//               className="w-2 h-2 rounded-full"
//               style={{
//                 backgroundColor: fg_color,
//                 animation: 'bounce 0.6s infinite',
//                 animationDelay: `${i * 0.15}s`
//               }}
//             />
//           ))}
//         </span>
//         <span className="text-xs" style={{ color: text_color, opacity: 0.7 }}>
//           thinking...
//         </span>
//       </div>
//     </div>
//   );

//   return (
//     <>
//       <style>{`
//         .chat-scroll-container::-webkit-scrollbar {
//           width: 8px;
//         }
//         .chat-scroll-container::-webkit-scrollbar-track {
//           background: ${styles.scrollbarTrack};
//         }
//         .chat-scroll-container::-webkit-scrollbar-thumb {
//           background: ${styles.scrollbarThumb};
//           border-radius: 999px;
//         }
//         .chat-scroll-container::-webkit-scrollbar-thumb:hover {
//           background: ${styles.scrollbarThumbHover};
//         }
//         .chat-scroll-container {
//           scrollbar-width: thin;
//           scrollbar-color: ${styles.scrollbarThumb} ${styles.scrollbarTrack};
//         }
        
//         @keyframes bounce {
//           0%, 100% { transform: translateY(0); }
//           50% { transform: translateY(-6px); }
//         }
//       `}</style>

//       <div
//         ref={scrollContainerRef}
//         className="chat-scroll-container p-4 overflow-y-auto flex-1"
//         style={{ height: '100%' }}
//       >
//         {messages.length === 0 ? (
//           <EmptyState />
//         ) : (
//           <>
//             {messages.map((message, index) => (
//               <MessageBubble key={message.id} message={message} index={index} />
//             ))}
//             {isLoading && <LoadingIndicator />}
//           </>
//         )}
//         <div ref={messagesEndRef} />
//       </div>
//     </>
//   );
// };

// export default Chats;