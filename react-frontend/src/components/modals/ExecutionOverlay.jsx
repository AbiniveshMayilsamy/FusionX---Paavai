import React, { useEffect, useState } from 'react';
import { Bot, Save, X } from 'lucide-react';

export function ExecutionOverlay({ text, isVisible, onSave, onExit }) {
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowButtons(false);
      const timer = setTimeout(() => {
        setShowButtons(true);
      }, 2400);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="execution-overlay">
      <div className="execution-box">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '16px' }}>
          <Bot size={36} style={{ color: '#10b981' }} />
          <div style={{ color: '#6ee7b7', fontSize: '1rem', letterSpacing: '2px', fontWeight: 700 }}>
            LINKGUARD AI NEURAL CORE
          </div>
        </div>

        <div className="execution-text">
          {text || 'AI PROCESSING SUPPLY CHAIN DATA...'}
        </div>

        <div className="processing-dots">
          <div className="processing-dot"></div>
          <div className="processing-dot"></div>
          <div className="processing-dot"></div>
        </div>

        {showButtons && (
          <div className="execution-actions">
            <button className="execution-btn" onClick={onSave}>
              <Save size={18} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              SAVE & PROCEED
            </button>
            <button className="execution-btn" onClick={onExit} style={{ borderColor: '#ef4444', color: '#ef4444' }}>
              <X size={18} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              EXIT
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
