import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, MessageSquare } from 'lucide-react';
import { AI_QUERIES_RESPONSES } from '../../data/suppliersData';

export function AiAssistantDrawer({ isOpen, onToggle }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "🤖 LinkGuard AI: Greetings! I am your real-time Supply Chain Intelligence Assistant. Ask me anything about multi-tier vulnerabilities, risk mitigation, ESG compliance, or alternative supplier recommendations."
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: inputText.trim()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const randomResponse = AI_QUERIES_RESPONSES[Math.floor(Math.random() * AI_QUERIES_RESPONSES.length)];
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: `🤖 AI: ${randomResponse}`
        }
      ]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button className="ai-toggle-btn" onClick={onToggle} title="Open AI Assistant">
          🤖
        </button>
      )}

      {/* Floating Drawer Panel */}
      {isOpen && (
        <div className="ai-assistant-panel">
          <div className="ai-assistant-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bot size={20} />
              <span>LinkGuard AI Assistant</span>
            </div>
            <button
              onClick={onToggle}
              style={{
                background: 'rgba(0,0,0,0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                cursor: 'pointer',
                color: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={16} />
            </button>
          </div>

          <div className="ai-chat-area">
            {messages.map((m) => (
              <div key={m.id} className={`ai-chat-msg ${m.sender}`}>
                {m.text}
              </div>
            ))}
            {isTyping && (
              <div className="ai-chat-msg bot" style={{ fontStyle: 'italic', opacity: 0.8 }}>
                🤖 AI is analyzing supply graph...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form className="ai-input-area" onSubmit={handleSendMessage}>
            <input
              type="text"
              className="ai-input"
              placeholder="Ask AI supply chain question..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button
              type="submit"
              style={{
                background: '#10b981',
                color: '#0f172a',
                border: 'none',
                borderRadius: '8px',
                padding: '0 12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
