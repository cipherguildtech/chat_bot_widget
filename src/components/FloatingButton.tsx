import React from 'react';
import { motion } from 'framer-motion';
import ChatGlyph from './ChatGlyph';

interface FloatingButtonProps {
  isOpen: boolean;
  onClick: () => void;
  bg_color: string;
  fg_color: string;
  position: string;
}

// Convert hex (#RRGGBB) to rgba
const hexToRgba = (hex: string, alpha: number) => {
  const sanitized = hex.replace('#', '');
  const bigint = parseInt(sanitized, 16);

  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const FloatingButton: React.FC<FloatingButtonProps> = ({
  isOpen,
  onClick,
  bg_color,
  fg_color,
  position,
}) => {
  const buttonPosition =
    position.toLowerCase() === 'left'
      ? 'fixed bottom-6 left-6'
      : 'fixed bottom-6 right-6';

  return (
    <motion.button
      className={`${buttonPosition} z-[10000] flex items-center justify-center w-14 h-14 rounded-full focus:outline-none shadow-lg`}
      style={{
        background: `linear-gradient(145deg, ${hexToRgba(bg_color, 1)} 0%, ${hexToRgba(bg_color, 0.85)} 100%)`,
        boxShadow: `0 4px 20px ${hexToRgba(bg_color, 0.45)}`,
      }}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.92 }}
      animate={{
        scale: isOpen ? 0 : 1,
        opacity: isOpen ? 0 : 1,
      }}
      transition={{ duration: 0.2 }}
    >
      <ChatGlyph
        className="w-7 h-7"
        style={{ color: fg_color }}
      />
    </motion.button>
  );
};

export default FloatingButton;