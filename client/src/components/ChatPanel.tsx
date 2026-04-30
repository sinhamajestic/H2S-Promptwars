import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../hooks/useChat';

export const ChatPanel: React.FC = () => {
  const [input, setInput] = useState('');
  const { messages, isLoading, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const currentInput = input;
    setInput('');
    await sendMessage(currentInput);
    // Return focus to input after sending
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden" aria-label="Chat Interface">
      <div 
        className="flex-1 p-6 overflow-y-auto flex flex-col gap-4" 
        role="log" 
        aria-live="polite" 
        aria-atomic="false"
      >
        {messages.length === 0 && (
          <div className="text-center text-slate-500 my-auto">
            Ask me anything about voter registration, polling locations, or key dates!
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`max-w-[85%] p-4 rounded-xl ${msg.role === 'user' ? 'bg-blue-600 text-white self-end rounded-br-none' : 'bg-slate-100 text-slate-800 self-start rounded-bl-none'}`}>
            <p className="whitespace-pre-wrap">{msg.content}</p>
          </div>
        ))}
        {isLoading && (
          <div className="self-start bg-slate-100 text-slate-800 max-w-[80%] p-4 rounded-xl rounded-bl-none" aria-busy="true">
            <span className="flex gap-1 items-center h-5" aria-hidden="true">
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
            </span>
            <span className="sr-only">Assistant is typing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-slate-100 bg-slate-50">
        <label htmlFor="chat-input" className="sr-only">Type your message</label>
        <div className="flex gap-2">
          <textarea 
            id="chat-input"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question... (Press Enter to send)"
            className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={1}
            aria-label="Chat input"
            disabled={isLoading}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            aria-label="Send message"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
