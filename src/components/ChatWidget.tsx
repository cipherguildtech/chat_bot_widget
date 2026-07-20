// import React, { useState, useRef, useEffect } from "react";
// import { MessageCircle, X, Send, Sparkles } from "lucide-react";

// interface Message {
//   id: number;
//   role: "user" | "bot";
//   text: string;
// }

// const INITIAL_MESSAGES: Message[] = [
//   {
//     id: 1,
//     role: "bot",
//     text: "Vanakkam! I can help answer questions about your order, shipping, or products. What do you need?",
//   },
// ];

// const CANNED_REPLY =
//   "Got it — let me check that for you. This is a demo response; wire this up to your /chat endpoint to pull real answers from your documents.";

// export default function ChatWidget(): JSX.Element {
//   const [open, setOpen] = useState<boolean>(false);
//   const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
//   const [input, setInput] = useState<string>("");
//   const [typing, setTyping] = useState<boolean>(false);

//   const scrollRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
//     }
//   }, [messages, typing, open]);

//   const send = (): void => {
//     const text = input.trim();
//     if (!text) return;

//     const userMsg: Message = {
//       id: Date.now(),
//       role: "user",
//       text,
//     };

//     setMessages((prev) => [...prev, userMsg]);
//     setInput("");
//     setTyping(true);

//     setTimeout(() => {
//       setTyping(false);

//       const botMsg: Message = {
//         id: Date.now() + 1,
//         role: "bot",
//         text: CANNED_REPLY,
//       };

//       setMessages((prev) => [...prev, botMsg]);
//     }, 1100);
//   };

//   return (
//     <div className="fixed bottom-0 right-0 z-[999999] font-[Inter]">
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=Inter:wght@400;500;600&display=swap');
//         .font-sora { font-family: 'Sora', ui-sans-serif, system-ui; }
//         @keyframes breathe {
//           0%, 100% { box-shadow: 0 0 0 0 rgba(27,75,66,0.35); }
//           50% { box-shadow: 0 0 0 10px rgba(27,75,66,0); }
//         }
//         .launcher-idle { animation: breathe 2.8s ease-in-out infinite; }
//         @media (prefers-reduced-motion: reduce) {
//           .launcher-idle { animation: none; }
//         }
//         .dot { animation: dotPulse 1.2s infinite ease-in-out; }
//         .dot:nth-child(2) { animation-delay: 0.15s; }
//         .dot:nth-child(3) { animation-delay: 0.3s; }
//         @keyframes dotPulse {
//           0%, 60%, 100% { opacity: 0.25; transform: translateY(0); }
//           30% { opacity: 1; transform: translateY(-2px); }
//         }
//       `}</style>

//       <div
//         className={[
//           "absolute bottom-[84px] right-5 w-[360px] max-w-[92vw] h-[520px] max-h-[75vh]",
//           "bg-white rounded-2xl shadow-2xl border border-[#E4E8E6] flex flex-col overflow-hidden",
//           "origin-bottom-right transition-all duration-200 ease-out",
//           open
//             ? "opacity-100 scale-100 translate-y-0"
//             : "opacity-0 scale-95 translate-y-2 pointer-events-none",
//         ].join(" ")}
//         role="dialog"
//         aria-label="Chat"
//         aria-hidden={!open}
//       >
//         <div className="bg-[#1B4B42] px-4 py-3.5 flex items-center gap-3 shrink-0">
//           <div className="h-8 w-8 rounded-full bg-white/15 flex items-center justify-center shrink-0">
//             <Sparkles className="h-4 w-4 text-[#E8C078]" />
//           </div>

//           <div className="min-w-0 flex-1">
//             <div className="font-sora text-[13.5px] font-semibold text-white truncate">
//               Support
//             </div>

//             <div className="text-[11px] text-white/60 flex items-center gap-1.5">
//               <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />
//               Usually replies in minutes
//             </div>
//           </div>

//           <button
//             onClick={() => setOpen(false)}
//             className="h-7 w-7 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
//             aria-label="Close chat"
//           >
//             <X className="h-4 w-4" />
//           </button>
//         </div>

//         <div
//           ref={scrollRef}
//           className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#FAFBFA]"
//         >
//           {messages.map((m) => (
//             <div
//               key={m.id}
//               className={`flex ${
//                 m.role === "user" ? "justify-end" : "justify-start"
//               }`}
//             >
//               <div
//                 className={`max-w-[80%] px-3.5 py-2.5 text-[13.5px] leading-relaxed rounded-2xl ${
//                   m.role === "user"
//                     ? "bg-[#1B4B42] text-white rounded-br-sm"
//                     : "bg-[#F0F2F1] text-[#1A2421] rounded-bl-sm"
//                 }`}
//               >
//                 {m.text}
//               </div>
//             </div>
//           ))}

//           {typing && (
//             <div className="flex justify-start">
//               <div className="bg-[#F0F2F1] rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center">
//                 <span className="dot h-1.5 w-1.5 rounded-full bg-[#6E7D78] inline-block" />
//                 <span className="dot h-1.5 w-1.5 rounded-full bg-[#6E7D78] inline-block" />
//                 <span className="dot h-1.5 w-1.5 rounded-full bg-[#6E7D78] inline-block" />
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="border-t border-[#E4E8E6] p-3 flex items-end gap-2 bg-white shrink-0">
//           <textarea
//             value={input}
//             onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
//               setInput(e.target.value)
//             }
//             onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//               if (e.key === "Enter" && !e.shiftKey) {
//                 e.preventDefault();
//                 send();
//               }
//             }}
//             placeholder="Type your question..."
//             rows={1}
//             className="flex-1 resize-none text-[13.5px] leading-relaxed px-3 py-2.5 rounded-xl border border-[#E4E8E6] bg-[#FAFBFA] text-[#1A2421] placeholder-[#9AA6A2] focus:outline-none focus:ring-2 focus:ring-[#1B4B42]/25 focus:border-[#1B4B42]/40 max-h-24"
//           />

//           <button
//             onClick={send}
//             disabled={!input.trim()}
//             className="h-10 w-10 shrink-0 rounded-xl bg-[#1B4B42] text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#24594E] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4B42]/40"
//             aria-label="Send message"
//           >
//             <Send className="h-4 w-4" />
//           </button>
//         </div>
//       </div>

//       <button
//         onClick={() => setOpen((prev) => !prev)}
//         className={[
//           "absolute bottom-5 right-5 h-14 w-14 rounded-full bg-[#1B4B42] text-white",
//           "flex items-center justify-center shadow-lg hover:bg-[#24594E] transition-all duration-200",
//           "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4B42]/50 focus-visible:ring-offset-2",
//           !open ? "launcher-idle" : "",
//         ].join(" ")}
//         aria-label={open ? "Close chat" : "Open chat"}
//       >
//         <span className="relative h-5 w-5 block">
//           <MessageCircle
//             className={`absolute inset-0 h-5 w-5 transition-all duration-150 ${
//               open
//                 ? "opacity-0 scale-75 rotate-45"
//                 : "opacity-100 scale-100 rotate-0"
//             }`}
//           />
//           <X
//             className={`absolute inset-0 h-5 w-5 transition-all duration-150 ${
//               open
//                 ? "opacity-100 scale-100 rotate-0"
//                 : "opacity-0 scale-75 -rotate-45"
//             }`}
//           />
//         </span>
//       </button>
//     </div>
//   );
// }