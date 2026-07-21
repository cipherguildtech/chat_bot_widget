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
}

const Footer: React.FC<FooterProps> = ({
    inputText,
    isLoading,
    onInputChange,
    onSendMessage,
    onKeyPress,
    inputRef,
}) => {
    return (
        <div
            className="px-4 py-3 border-t border-white/10"
            style={{
                background: 'rgba(0,0,0,0.3)',
            }}
        >
            <div className="flex items-center gap-2">
                <input
                    ref={inputRef}
                    type="text"
                    value={inputText}
                    onChange={(e) => onInputChange(e.target.value)}
                    onKeyPress={onKeyPress}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-transparent text-sm text-white placeholder-white/40"
                    disabled={isLoading}
                    aria-label="Type a message"
                />
                <button
                    onClick={() => onSendMessage(inputText)}
                    disabled={!inputText.trim() || isLoading}
                    className="p-2.5 rounded-full text-white transition-all flex-shrink-0"
                    style={{
                        background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                        opacity: !inputText.trim() || isLoading ? 0.4 : 1,
                        cursor: !inputText.trim() || isLoading ? 'not-allowed' : 'pointer',
                    }}
                    aria-label="Send message"
                >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
            </div>
        </div>
    );
};

export default Footer;