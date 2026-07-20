import React from 'react';
import { motion } from 'framer-motion';
import ChatGlyph from './ChatGlyph';

interface FloatingButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({ isOpen, onClick }) => {
  return (
    <motion.button
      className="fixed bottom-6 right-6 z-[10000] flex items-center justify-center w-14 h-14 rounded-full focus:outline-none shadow-lg"
      style={{
        background: 'linear-gradient(145deg, #25D366 0%, #128C7E 100%)',
        boxShadow: '0 4px 20px rgba(18,140,126,0.5)',
      }}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.92 }}
      animate={{
        scale: isOpen ? 0 : 1,
        opacity: isOpen ? 0 : 1
      }}
      transition={{ duration: 0.2 }}
    >
      <ChatGlyph className="w-7 h-7 text-white" />
    </motion.button>
  );
};

export default FloatingButton;