export interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export interface ChatWindowProps {
  isOpen: boolean;
  isMinimized: boolean;
  messages: Message[];
  isLoading: boolean;
  inputText: string;
  onSendMessage: (text: string) => void;
  onToggleMinimize: () => void;
  onToggleChat: () => void;
  onInputChange: (text: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  inputRef: React.RefObject<HTMLInputElement>;
  chatWindowRef: React.RefObject<HTMLDivElement>;
}