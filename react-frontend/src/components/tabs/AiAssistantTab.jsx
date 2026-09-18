import React, { useState } from 'react';
import { Bot, HelpCircle, Send, Sparkles } from 'lucide-react';
import { AI_QUERIES_RESPONSES } from '../../data/suppliersData';

export function AiAssistantTab({ onStartExecution }) {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');

  const handleAsk = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    onStartExecution('NEURAL QUERY REASONING ACROSS GLOBAL SUPPLY CHAIN GRAPH...', () => {
      const randomResponse = AI_QUERIES_RESPONSES[Math.floor(Math.random() * AI_QUERIES_RESPONSES.length)];
      setResponse(randomResponse);
    });
  };

  return (
    <div className="tab-content">
      <h2>
        <Bot size={22} style={{ color: '#ffd700' }} />
        AI Supply Chain Intelligence Assistant
      </h2>

      <div style={{
        background: 'rgba(15, 23, 42, 0.75)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '16px',
        padding: '24px',
        margin: '20px 0'
      }}>
        <h3 style={{ color: '#34d399', fontSize: '1.2rem', marginBottom: '12px' }}>
          🧠 Natural Language Intelligence Engine
        </h3>
        <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '18px' }}>
          Ask complex queries regarding geopolitical risk exposure, supplier diversification paths, or critical delivery bottlenecks.
        </p>

        <form onSubmit={handleAsk}>
          <div className="input-group">
            <label htmlFor="aiTabQuery">Enter Inquiry or Scenario Analysis:</label>
            <input
              id="aiTabQuery"
              type="text"
              placeholder="e.g., What are the critical risks for Tier 2 and Tier 3 rare mineral suppliers?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn" style={{ maxWidth: '280px', background: 'linear-gradient(135deg, #059669, #10b981)', color: '#fff' }}>
            <Sparkles size={18} />
            Ask Neural AI Assistant
          </button>
        </form>

        {response && (
          <div style={{
            marginTop: '24px',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid #10b981',
            borderRadius: '12px',
            padding: '18px',
            animation: 'fadeIn 0.3s ease'
          }}>
            <h4 style={{ color: '#10b981', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bot size={20} />
              AI Analysis Result:
            </h4>
            <p style={{ color: '#e2e8f0', fontSize: '0.95rem', lineHeight: 1.6 }}>
              {response}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
