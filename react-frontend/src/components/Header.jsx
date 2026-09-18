import React, { useState, useEffect } from 'react';
import { Shield, LogOut, Clock, Activity } from 'lucide-react';

export function Header({ user, onLogout }) {
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
    <div className="header">
      <button className="logout-btn" onClick={onLogout}>
        <LogOut size={16} />
        Logout
      </button>

      <h1>
        <Shield size={34} style={{ color: '#ffd700' }} />
        LinkGuard AI Supply Chain Intelligence
      </h1>
      <p>
        Advanced Multi-Tier Supply Chain Mapping & Predictive Risk Analytics Platform
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginTop: '12px' }}>
        <div className="header-time-badge">
          <Clock size={14} />
          <span>IST: {currentTime || 'Loading...'}</span>
        </div>
        {user && (
          <div className="header-time-badge" style={{ borderColor: '#10b981', color: '#10b981' }}>
            <Activity size={14} />
            <span>Logged in as: {user.username} ({user.userType?.toUpperCase()})</span>
          </div>
        )}
      </div>
    </div>
  );
}
