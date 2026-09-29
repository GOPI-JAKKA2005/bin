import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Trash2, Bot, Sparkles, Loader2 } from 'lucide-react';
import { useChatbot } from '../../hooks/useChatbot';
import { ChatMessage } from './ChatMessage';

export function ChatWidget() {
  const { isOpen, setIsOpen, messages, isTyping, sendMessage, clearChat } = useChatbot();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const text = input;
    setInput('');
    sendMessage(text);
  };

  return (
    <div id="chatbot" className="fixed bottom-5 right-5 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-[calc(100vw-2.5rem)] sm:w-[380px] h-[520px] bg-surface border border-border rounded-3xl shadow-2xl flex flex-col overflow-hidden mb-4 glass-panel"
          >
            {/* Top Header */}
            <div className="p-4 bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm font-heading">EcoBot AI Assistant</h3>
                  <p className="text-[10px] text-white/80">Waste Segregation & Safety Guide</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={clearChat}
                  className="p-1.5 rounded-lg hover:bg-white/20 text-white/90 hover:text-white transition-colors"
                  title="Clear Chat History"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/20 text-white/90 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Messages Container */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  onSelectPrompt={(prompt) => sendMessage(prompt)}
                />
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-muted text-xs p-2 bg-surface-hover rounded-xl w-max border border-border">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                  EcoBot is thinking...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-border bg-surface flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about segregation, medical waste..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-surface-hover border border-border text-xs text-foreground placeholder:text-muted focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="p-2.5 rounded-xl bg-primary text-white disabled:opacity-50 hover:opacity-95 transition-all shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button */}
      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="p-4 rounded-full bg-gradient-to-tr from-primary to-secondary text-white shadow-2xl shadow-primary/30 flex items-center justify-center group"
          title="Ask EcoBot Waste AI"
        >
          <MessageSquare className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-surface animate-ping" />
        </motion.button>
      )}
    </div>
  );
}
