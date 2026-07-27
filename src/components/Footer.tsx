import React from 'react';
import type { RefObject } from 'react';
import { Send, Loader2 } from 'lucide-react';
 
interface FooterProps {
  inputText: string;
  isLoading: boolean;
  onInputChange: (text: string) => void;
  onSendMessage: (text: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  inputRef: RefObject<HTMLInputElement>;
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

const Footer: React.FC<FooterProps> = ({
  inputText,
  isLoading,
  onInputChange,
  onSendMessage,
  onKeyPress,
  inputRef,
  bg_color,
  fg_color,
  text_color,
}) => {
 
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // onKeyPress(e);
      onKeyPress(e);
    }
  };

  const isDisabled = !inputText.trim() || isLoading;

  return (
    <div
      className="px-4 py-3 border-t flex-shrink-0"
      style={{
        backgroundColor: hexToRgba(bg_color, 0.12),
        borderColor: hexToRgba(bg_color, 0.25),
      }}
    >
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          disabled={isLoading}
          autoFocus
          aria-label="Type a message"
          className="flex-1 px-4 py-2.5 rounded-full border text-sm focus:outline-none transition-all"
          style={{
            backgroundColor: hexToRgba(bg_color, 0.08),
            borderColor: hexToRgba(bg_color, 0.25),
            color: text_color,
          }}
        />

        <button
          onClick={() => onSendMessage(inputText)}
          disabled={isDisabled}
          aria-label="Send message"
          className="p-2.5 rounded-full transition-all flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, ${bg_color} 0%, ${hexToRgba(
              bg_color,
              0.85
            )} 100%)`,
            color: fg_color,
            opacity: isDisabled ? 0.45 : 1,
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            boxShadow: `0 4px 12px ${hexToRgba(bg_color, 0.35)}`,
          }}
        >
          {isLoading ? (
            <Loader2
              className="w-5 h-5 animate-spin"
              style={{ color: fg_color }}
            />
          ) : (
            <Send
              className="w-5 h-5"
              style={{ color: fg_color }}
            />
          )}
        </button>
      </div>

      <style>{`
        input::placeholder {
          color: ${hexToRgba(text_color, 0.55)};
        }
      `}</style>
    </div>
  );
};

export default Footer;