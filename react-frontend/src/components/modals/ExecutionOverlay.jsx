import React, { useEffect, useState } from 'react';
import { Bot, Save, X } from 'lucide-react';
import { ShinyText, DecryptedText, Lightfall } from '../react-bits';

export function ExecutionOverlay({ text, isVisible, onSave, onExit }) {
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowButtons(false);
      const timer = setTimeout(() => {
        setShowButtons(true);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="execution-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* React Bits Lightfall WebGL Background */}
      <Lightfall
        colors={['#d9ba84', '#e5a956', '#b88636']}
        backgroundColor="#14110b"
        speed={0.18}
        streakCount={2}
        streakWidth={0.6}
        streakLength={0.9}
        glow={0.7}
        density={0.12}
        twinkle={0.1}
        zoom={1.6}
        backgroundGlow={0.5}
        opacity={0.75}
        lightMode={false}
        mouseInteraction={false}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />

      <div
        className="execution-box"
        style={{
          position: 'relative',
          zIndex: 10,
          boxShadow: '0 0 60px rgba(217, 186, 132, 0.22), inset 0 0 20px rgba(217, 186, 132, 0.05)',
          borderColor: 'rgba(217, 186, 132, 0.4)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '18px' }}>
          <Bot size={34} style={{ color: '#d9ba84', filter: 'drop-shadow(0 0 14px rgba(217, 186, 132, 0.75))' }} />
          <div style={{ letterSpacing: '2.5px', fontWeight: 800 }}>
            <ShinyText
              text="LINKGUARD AI NEURAL CORE"
              color="#d9ba84"
              shineColor="#ffffff"
              speed={2.2}
              style={{ fontSize: '1.05rem', fontFamily: 'var(--font-mono)' }}
            />
          </div>
        </div>

        <div className="execution-text" style={{ minHeight: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <DecryptedText
            text={text || 'AI PROCESSING SUPPLY CHAIN DATA...'}
            speed={40}
            maxIterations={5}
            animateOn="mount"
          />
        </div>

        <div className="processing-dots">
          <div className="processing-dot"></div>
          <div className="processing-dot"></div>
          <div className="processing-dot"></div>
        </div>

        {showButtons && (
          <div className="execution-actions">
            <button className="execution-btn" onClick={onSave} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Save size={18} style={{ color: '#d9ba84' }} />
              <ShinyText text="SAVE & PROCEED" color="#ffffff" shineColor="#d9ba84" speed={2} />
            </button>
            <button
              className="execution-btn"
              onClick={onExit}
              style={{ borderColor: '#ef4444', color: '#ef4444', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <X size={18} style={{ color: '#ef4444' }} />
              <ShinyText text="EXIT" color="#ef4444" shineColor="#ffffff" speed={2.5} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
