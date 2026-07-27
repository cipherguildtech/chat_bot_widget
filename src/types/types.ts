// export interface Message {
//   id: string;
//   type: 'user' | 'bot';
//   content: string;
//   timestamp: Date;
// }

// export interface ChatWindowProps {
//   isOpen: boolean;
//   isMinimized: boolean;
//   messages: Message[];
//   isLoading: boolean;
//   inputText: string;
//   onSendMessage: (text: string) => void;
//   onToggleMinimize: () => void;
//   onToggleChat: () => void;
//   onInputChange: (text: string) => void;
//   onKeyPress: (e: React.KeyboardEvent) => void;
//   messagesEndRef: React.RefObject<HTMLDivElement>;
//   inputRef: React.RefObject<HTMLInputElement>;
// }

export interface Message {
  id: string;
  content: string;
  type: 'user' | 'bot';
  timestamp: Date;
}

export interface ChatWindowProps {
  isOpen: boolean;
  isMinimized: boolean;
  messages?: Message[];
  isLoading?: boolean;
  inputText?: string;
  onSendMessage?: (message: string) => void;
  onToggleMinimize: () => void;
  onToggleChat: () => void;
  onInputChange?: (text: string) => void;
  messagesEndRef?: React.RefObject<HTMLDivElement>;
  inputRef?: React.RefObject<HTMLInputElement>;
  chatWindowRef?: React.RefObject<HTMLDivElement>;
  position: string;
  bg_color: string;
  fg_color: string;
  text_color: string;
}