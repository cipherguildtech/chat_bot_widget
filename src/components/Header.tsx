import React from 'react';
import { X } from 'lucide-react';

interface HeaderProps {
  isMinimized: boolean;
  onToggleMinimize: () => void;
  onToggleChat: () => void;
  bg_color: string;
  fg_color: string;
  text_color: string;
}

// Convert Hex color to RGBA
const hexToRgba = (hex: string, alpha: number) => {
  const sanitized = hex.replace('#', '');

  if (sanitized.length !== 6) {
    return `rgba(0,0,0,${alpha})`;
  }

  const bigint = parseInt(sanitized, 16);

  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const Header: React.FC<HeaderProps> = ({
  onToggleChat,
  bg_color,
  fg_color,
  text_color,
}) => {
  return (
    <div
      className="flex items-center justify-between px-5 py-4 border-b"
      style={{
        backgroundColor: hexToRgba(bg_color, 0.25),
        borderColor: hexToRgba(bg_color, 0.25),
      }}
    >
      <div>
        <h3
          className="font-semibold text-base"
          style={{ color: text_color }}
        >
          Assistant
        </h3>

        <p
          className="text-xs flex items-center mt-0.5"
          style={{ color: fg_color }}
        >
          <span
            className="inline-block w-2 h-2 rounded-full mr-2 animate-pulse"
            style={{ backgroundColor: fg_color }}
          />
          Online
        </p>
      </div>

      <button
        onClick={onToggleChat}
        className="p-2 rounded-lg transition-colors duration-200"
        style={{
          color: text_color,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = hexToRgba(bg_color, 0.2);
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
        aria-label="Close chat"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Header;