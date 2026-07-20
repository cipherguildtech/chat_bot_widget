import React from 'react';

interface ChatGlyphProps {
  className?: string;
}

const ChatGlyph: React.FC<ChatGlyphProps> = ({ className }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M16 4C9.373 4 4 9.163 4 15.5c0 3.06 1.24 5.84 3.27 7.9-.18 1.63-.7 3.13-1.52 4.4a.6.6 0 00.66.9c2-.45 3.86-1.28 5.4-2.4A13.6 13.6 0 0016 27c6.627 0 12-5.163 12-11.5S22.627 4 16 4z"
      fill="currentColor"
    />
    <path
      d="M11.5 14.2c.3-.7.6-.7.9-.7h.5c.25 0 .45.1.55.4l.7 1.9c.1.25.05.5-.1.7l-.55.65c-.15.2-.15.4-.05.6.5.9 1.6 2 2.5 2.5.2.1.4.1.6-.05l.65-.55c.2-.15.45-.2.7-.1l1.9.7c.3.1.4.3.4.55v.5c0 .3 0 .6-.7.9-.7.3-1.7.4-2.9-.1-1.2-.5-2.7-1.5-3.9-2.7-1.2-1.2-2.2-2.7-2.7-3.9-.5-1.2-.4-2.2-.1-2.9z"
      fill="white"
    />
  </svg>
);

export default ChatGlyph;