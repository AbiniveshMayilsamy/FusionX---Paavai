import React, { useState, useEffect } from 'react';
import { Shield, LogOut, Clock, Activity, ExternalLink, Zap } from 'lucide-react';
import { ShinyText, DecryptedText } from './react-bits';

export function Header({ user, onLogout, onShowLanding, onOpenDashAnalytics }) {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      setCurrentTime(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="header">
      {/* Top action strip */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          paddingBottom: '16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
        }}
      >
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {onShowLanding && (
            <button
              className="btn-secondary"
              style={{
                padding: '7px 14px',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                textTransform: 'uppercase',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                borderColor: 'rgba(217, 186, 132, 0.3)',
                color: 'var(--primary-gold)'
              }}
              onClick={onShowLanding}
            >
              ← 60FPS Showcase
            </button>
          )}

          <button
            className="btn-secondary"
            style={{
              padding: '7px 14px',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              textTransform: 'uppercase',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onClick={() => onOpenDashAnalytics && onOpenDashAnalytics()}
          >
            <ExternalLink size={12} />
            Dash Analytics (Port 3000)
          </button>
        </div>

        <button className="logout-btn" onClick={onLogout}>
          <LogOut size={13} />
          <span>Exit Session</span>
        </button>
      </div>

      {/* Center Hero Brand & Content */}
      <div className="header-center-content">
        <div className="header-brand-container">
          <Shield size={34} className="header-shield-icon" />
          <h1 className="header-title">
            <span>LINKGUARD</span>
            <ShinyText text="DEFENSE" color="var(--primary-gold)" shineColor="#ffffff" speed={2.5} />
            <span>CONSOLE</span>
          </h1>
        </div>

        <p className="header-desc">
          <DecryptedText
            text="Autonomous Multi-Tier Defense Supply Chain Intelligence & Cryptographic Ledger"
            speed={20}
            animateOn="mount"
          />
        </p>

        {/* Telemetry Status Badges Strip */}
        <div className="header-badges-row">
          <div className="header-time-badge">
            <Clock size={13} />
            <span>IST: {currentTime || 'SYNCING...'}</span>
          </div>

          <div className="header-time-badge badge-green">
            <Zap size={13} />
            <span>60 FPS // DEFCON 5 OPTIMAL</span>
          </div>

          {user && (
            <div className="header-time-badge badge-gold">
              <Activity size={13} />
              <span>OPERATOR: {user.username} [{user.userType?.toUpperCase()}]</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
