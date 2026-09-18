import React from 'react';
import { Activity, Radio, AlertTriangle, CheckCircle2 } from 'lucide-react';

export function RealTimeMonitor() {
  return (
    <div className="card full-width">
      <h2>
        <Activity size={22} style={{ color: '#ef4444' }} />
        Real-Time Supply Chain Status Monitor
      </h2>
      <div className="real-time-grid">
        <div className="real-time-monitor">
          <span className="status-indicator status-online"></span>
          <div>
            <div style={{ color: '#94a3b8', fontSize: '0.82rem' }}>Primary Tier 1</div>
            <strong>8 / 10 Suppliers Online</strong>
          </div>
        </div>

        <div className="real-time-monitor">
          <span className="status-indicator status-warning"></span>
          <div>
            <div style={{ color: '#94a3b8', fontSize: '0.82rem' }}>Secondary Tier 2</div>
            <strong>15 / 18 Operational</strong>
          </div>
        </div>

        <div className="real-time-monitor">
          <span className="status-indicator status-offline"></span>
          <div>
            <div style={{ color: '#94a3b8', fontSize: '0.82rem' }}>Critical Vulnerabilities</div>
            <strong style={{ color: '#f87171' }}>2 Suppliers Offline</strong>
          </div>
        </div>

        <div className="real-time-monitor">
          <span className="status-indicator status-online"></span>
          <div>
            <div style={{ color: '#94a3b8', fontSize: '0.82rem' }}>Blockchain Consensus</div>
            <strong style={{ color: '#34d399' }}>95% Authenticated</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
