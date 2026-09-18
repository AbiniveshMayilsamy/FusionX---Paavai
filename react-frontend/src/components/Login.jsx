import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, User, KeyRound, Sparkles } from 'lucide-react';

export function Login({ onLoginSuccess, onStartExecution }) {
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

    // Admin validation or generic analyst/viewer/auditor validation
    const isAdminMatch = (
      userType === 'admin' &&
      username.trim() === 'Linkguardadmin' &&
      email.trim() === 'ganeshprabu2025@linkguard.com' &&
      password.trim() === 'prabu@linkguard'
    );

    const isOtherValid = userType !== 'admin' && username.trim() && email.trim() && password.trim();

    if (isAdminMatch || isOtherValid) {
      onStartExecution('AUTHENTICATING USER CREDENTIALS & INITIALIZING AI ENGINES...', () => {
        onLoginSuccess({
          username: username.trim(),
          email: email.trim(),
          userType: userType
        });
      });
    } else {
      setErrorMsg('🔒 Authentication Failed! For Admin access, use the demo credentials provided below or click "Auto Fill".');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-logo">LG</div>
        <div className="login-header-text">
          <h2>LinkGuard</h2>
          <p>AI-Powered Supply Chain Intelligence Platform</p>
        </div>

        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid #ef4444',
            borderRadius: '10px',
            padding: '12px',
            color: '#fca5a5',
            fontSize: '0.85rem',
            marginBottom: '16px'
          }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLoginSubmit}>
          <div className="input-group">
            <label htmlFor="userType">User Role</label>
            <select
              id="userType"
              value={userType}
              onChange={(e) => handleFillDemo(e.target.value)}
            >
              <option value="admin">Administrator (Full Access)</option>
              <option value="analyst">Supply Chain Analyst</option>
              <option value="viewer">Risk Assessment Viewer</option>
              <option value="auditor">Compliance Auditor</option>
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn" style={{ marginTop: '16px' }}>
            <Lock size={18} />
            Secure Login
          </button>
        </form>

        <div className="demo-credentials-box" style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <strong style={{ color: '#ffd700' }}>🔑 Demo Admin Credentials:</strong>
            <button
              type="button"
              onClick={() => handleFillDemo('admin')}
              style={{
                background: 'rgba(255, 215, 0, 0.2)',
                border: '1px solid #ffd700',
                borderRadius: '6px',
                color: '#ffd700',
                padding: '2px 8px',
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
            >
              Auto Fill
            </button>
          </div>
          <div><strong>User:</strong> Linkguardadmin</div>
          <div><strong>Email:</strong> ganeshprabu2025@linkguard.com</div>
          <div><strong>Pass:</strong> prabu@linkguard</div>
        </div>
      </div>
    </div>
  );
}
