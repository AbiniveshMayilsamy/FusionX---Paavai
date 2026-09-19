import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Lock, Mail, User, KeyRound, Sparkles, ArrowRight, Shield, Zap } from 'lucide-react';
import { ShinyText, DecryptedText, Waves } from './react-bits';

export function Login({ onLoginSuccess, onStartExecution, onBackToLanding }) {
  const [userType, setUserType] = useState('admin');
  const [username, setUsername] = useState('Linkguardadmin');
  const [email, setEmail] = useState('ganeshprabu2025@linkguard.com');
  const [password, setPassword] = useState('prabu@linkguard');
  const [errorMsg, setErrorMsg] = useState('');

  const handleFillDemo = (type) => {
    setUserType(type);
    if (type === 'admin') {
      setUsername('Linkguardadmin');
      setEmail('ganeshprabu2025@linkguard.com');
      setPassword('prabu@linkguard');
    } else {
      setUsername(type + '_user');
      setEmail(type + '@linkguard.com');
      setPassword('linkguard123');
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const isAdminMatch = (
      userType === 'admin' &&
      username.trim() === 'Linkguardadmin' &&
      email.trim() === 'ganeshprabu2025@linkguard.com' &&
      password.trim() === 'prabu@linkguard'
    );

    const isOtherValid = userType !== 'admin' && username.trim() && email.trim() && password.trim();

    if (isAdminMatch || isOtherValid) {
      onStartExecution('AUTHENTICATING CREDENTIALS & MOUNTING DEFENSE LEDGER...', () => {
        onLoginSuccess({
          username: username.trim(),
          email: email.trim(),
          userType: userType
        });
      });
    } else {
      setErrorMsg('AUTHENTICATION FAILED: Invalid credentials for designated clearance level. Use Admin demo credentials or click Auto Fill.');
    }
  };

  const roles = [
    { id: 'admin', label: 'Admin' },
    { id: 'analyst', label: 'Analyst' },
    { id: 'viewer', label: 'Viewer' },
    { id: 'auditor', label: 'Auditor' }
  ];

  return (
    <div className="login-wrapper">
      {/* React Bits Interactive Waves Background */}
      <Waves
        lineColor="rgba(217, 186, 132, 0.42)"
        backgroundColor="transparent"
        waveSpeedX={0.018}
        waveSpeedY={0.009}
        waveAmpX={38}
        waveAmpY={20}
        xGap={14}
        yGap={32}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0
        }}
      />

      {/* Top Controls */}
      <div
        style={{
          position: 'fixed',
          top: '28px',
          left: '32px',
          right: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 20
        }}
      >
        {onBackToLanding && (
          <button
            type="button"
            onClick={onBackToLanding}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              color: '#d9ba84',
              borderRadius: '6px',
              padding: '8px 16px',
              fontSize: '11px',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.25s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#d9ba84';
              e.currentTarget.style.background = 'rgba(217, 186, 132, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.16)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            ← 60FPS Showcase
          </button>
        )}

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(0, 0, 0, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '5px 14px',
            borderRadius: '999px',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: '#8e8e93',
            letterSpacing: '0.06em',
            textTransform: 'uppercase'
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
          <span>60 FPS // AIR-GAPPED CONSOLE</span>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="login-card">
        <div className="login-logo">
          LINK<ShinyText text="GUARD" color="var(--primary-gold)" shineColor="#ffffff" />
        </div>
        <div className="login-header-text">
          <h2>Console Access</h2>
          <p>
            <DecryptedText
              text="Autonomous Defense Supply Intelligence // Level 4"
              speed={20}
              animateOn="mount"
            />
          </p>
        </div>

        {errorMsg && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid #ef4444',
              borderRadius: '6px',
              padding: '12px 14px',
              color: '#fca5a5',
              fontSize: '0.78rem',
              fontFamily: 'var(--font-mono)',
              lineHeight: '1.4',
              marginBottom: '20px'
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* Role Switcher Pills */}
        <div style={{ marginBottom: '18px' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.76rem',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em'
            }}
          >
            Operator Clearance
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
            {roles.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => handleFillDemo(r.id)}
                style={{
                  background: userType === r.id ? 'var(--primary-gold)' : 'rgba(0, 0, 0, 0.5)',
                  color: userType === r.id ? '#060709' : 'var(--text-muted)',
                  border: userType === r.id ? '1px solid var(--primary-gold)' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  padding: '8px 4px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  fontWeight: userType === r.id ? '700' : '500',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleLoginSubmit}>
          <div className="input-group">
            <label htmlFor="username">Operator ID</label>
            <input
              id="username"
              type="text"
              placeholder="e.g. Linkguardadmin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">Defense Email</label>
            <input
              id="email"
              type="email"
              placeholder="e.g. ganeshprabu2025@linkguard.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Security Passphrase</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn" style={{ marginTop: '16px' }}>
            <Lock size={15} />
            <span>Authenticate Session</span>
            <ArrowRight size={14} />
          </button>
        </form>

        {/* Demo Credentials Dossier */}
        <div className="demo-credentials-box">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              paddingBottom: '6px',
              marginBottom: '8px'
            }}
          >
            <span style={{ color: 'var(--primary-gold)', fontWeight: '600', letterSpacing: '0.04em' }}>
              // DEMO CLEARANCE DOSSIER
            </span>
            <button
              type="button"
              onClick={() => handleFillDemo('admin')}
              style={{
                background: 'rgba(217, 186, 132, 0.15)',
                border: '1px solid var(--primary-gold)',
                borderRadius: '4px',
                color: 'var(--primary-gold)',
                padding: '2px 8px',
                fontSize: '0.72rem',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)'
              }}
            >
              Auto Fill
            </button>
          </div>
          <div><strong>ID:</strong> Linkguardadmin</div>
          <div><strong>EMAIL:</strong> ganeshprabu2025@linkguard.com</div>
          <div><strong>KEY:</strong> prabu@linkguard</div>
        </div>
      </div>
    </div>
  );
}
