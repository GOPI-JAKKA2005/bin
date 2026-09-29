import React from 'react';
import { Bot, User, AlertTriangle, ShieldAlert } from 'lucide-react';

export function ChatMessage({ message, onSelectPrompt }) {
  const isBot = message.sender === 'bot';

  return (
    <div className={`flex gap-3 text-xs ${isBot ? 'justify-start' : 'justify-end'}`}>
      {isBot && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white shrink-0 shadow-sm">
          <Bot className="w-4 h-4" />
        </div>
      )}

      <div className={`max-w-[82%] space-y-2`}>
        <div
          className={`p-3.5 rounded-2xl leading-relaxed ${
            isBot
              ? 'bg-surface-hover text-foreground border border-border rounded-tl-none'
              : 'bg-primary text-white font-medium rounded-tr-none shadow-md'
          }`}
        >
          <p className="whitespace-pre-wrap">{message.text}</p>
        </div>

        {/* Safety Warning Banner in Chat if present */}
        {message.safetyAlert && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              {message.safetyAlert.title}
            </div>
            <p className="text-[11px] leading-relaxed">{message.safetyAlert.message}</p>
          </div>
        )}

        {/* Suggested Followup Prompts */}
        {isBot && message.suggestedQuestions && message.suggestedQuestions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {message.suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => onSelectPrompt(q)}
                className="px-2.5 py-1 rounded-full bg-surface border border-primary/30 text-primary text-[11px] font-medium hover:bg-primary hover:text-white transition-all shadow-xs text-left"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <span className="text-[10px] text-muted block font-medium px-1">
          {message.timestamp}
        </span>
      </div>

      {!isBot && (
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white shrink-0 shadow-sm">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
}
