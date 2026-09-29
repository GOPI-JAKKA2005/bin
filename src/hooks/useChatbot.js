import { useState, useCallback } from 'react';
import { apiClient } from '../services/apiClient';

export function useChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome-msg',
      sender: 'bot',
      text: "👋 Hi! I'm **EcoBot**, your smart waste management assistant. Ask me how to segregate wet/dry waste, recycle plastics, handle medical sharps, or compost leftovers!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: 'Welcome'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [safetyAlert, setSafetyAlert] = useState(null);

  const sendMessage = useCallback(async (text) => {
    if (!text || !text.trim()) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const res = await apiClient.sendChatMessage(text.trim());

      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: res.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        category: res.category,
        safetyAlert: res.safetyAlert || null,
        suggestedQuestions: res.suggestedQuestions || []
      };

      setMessages(prev => [...prev, botMsg]);
      if (res.safetyAlert) {
        setSafetyAlert(res.safetyAlert);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'bot',
          text: "⚠️ Sorry, I encountered a temporary connection error. Please try again or rephrase your question.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  }, []);

  const clearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'bot',
        text: "Chat history cleared. How can I assist your waste segregation today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setSafetyAlert(null);
  };

  return {
    isOpen,
    setIsOpen,
    messages,
    isTyping,
    safetyAlert,
    sendMessage,
    clearChat
  };
}
