import React from 'react';
import { Radio } from 'lucide-react';
import { ShinyText, DecryptedText } from './react-bits';

export function RealTimeMonitor() {
  return (
    <div className="card full-width">
      <h2>
        <Radio size={20} style={{ color: 'var(--primary-gold)' }} />
        <ShinyText text="Live Network Telemetry & Node Consensus" color="var(--primary-gold)" shineColor="#ffffff" />
      </h2>
      <div className="real-time-grid">
        <div className="real-time-monitor">
          <span className="status-indicator status-online"></span>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.76rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Primary Tier 1 Nodes
            </div>
            <strong>8 / 10 Active & Synchronized</strong>
          </div>
        </div>

        <div className="real-time-monitor">
          <span className="status-indicator status-warning"></span>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.76rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Secondary Tier 2 Nodes
            </div>
            <strong>15 / 18 Operational Trace</strong>
          </div>
        </div>

        <div className="real-time-monitor">
          <span className="status-indicator status-offline"></span>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.76rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Quarantined Vulnerabilities
            </div>
            <strong style={{ color: '#ef4444' }}>2 Nodes Isolated</strong>
          </div>
        </div>

        <div className="real-time-monitor">
          <span className="status-indicator status-online"></span>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.76rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Cryptographic Consensus
            </div>
            <strong style={{ color: 'var(--primary-gold)' }}>
              <DecryptedText text="99.98% Authenticated" speed={30} animateOn="mount" />
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}
