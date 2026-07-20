import React from 'react';
import { X, Minimize2, Maximize2 } from 'lucide-react';

interface HeaderProps {
  isMinimized: boolean;
  onToggleMinimize: () => void;
  onToggleChat: () => void;
}

const Header: React.FC<HeaderProps> = ({
  isMinimized,
  onToggleMinimize,
  onToggleChat,
}) => {
  return (
    <div
      className="flex items-center justify-between px-5 py-4 border-b border-white/10"
      style={{ background: 'rgba(18,140,126,0.15)' }}
    >
      <div>
        <h3 className="font-semibold text-white text-base">AI Assistant</h3>
        <p className="text-xs text-emerald-300/80 flex items-center mt-0.5">
          <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
          Online
        </p>
      </div>
      <div className="flex items-center gap-1 text-white/70">
        <button
          onClick={onToggleMinimize}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          aria-label={isMinimized ? 'Maximize' : 'Minimize'}
        >
          {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
        </button>
        <button
          onClick={onToggleChat}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Close chat"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Header;