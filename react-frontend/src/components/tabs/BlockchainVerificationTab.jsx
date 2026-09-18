import React from 'react';
import { Link2, ShieldCheck, FileCode2, Search, CheckCircle, Clock } from 'lucide-react';

export function BlockchainVerificationTab({ onInitiateVerification, onDeployContract, onTraceComponent }) {
  return (
    <div className="tab-content">
      <h2>
        <Link2 size={22} style={{ color: '#ffd700' }} />
        Blockchain Supply Chain Verification
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', margin: '20px 0' }}>
        <div className="card" style={{ marginBottom: 0 }}>
          <h3 style={{ fontSize: '1.2rem' }}>
            <ShieldCheck size={20} style={{ color: '#10b981' }} />
            Consensus Status
          </h3>
          <div style={{ margin: '14px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span className="blockchain-verification-tag" style={{ background: '#059669', color: '#fff', fontSize: '0.85rem', padding: '6px 12px' }}>
              ✓ 23 Suppliers Verified
            </span>
            <span className="blockchain-verification-tag" style={{ background: '#d97706', color: '#fff', fontSize: '0.85rem', padding: '6px 12px' }}>
              ⚠ 3 Pending Consensus
            </span>
            <span className="blockchain-verification-tag" style={{ background: '#dc2626', color: '#fff', fontSize: '0.85rem', padding: '6px 12px' }}>
              ❌ 2 Failed Verification
            </span>
          </div>
          <button className="btn" onClick={onInitiateVerification}>
            <Search size={16} />
            Initiate New Verification
          </button>
        </div>

        <div className="card" style={{ marginBottom: 0 }}>
          <h3 style={{ fontSize: '1.2rem' }}>
            <FileCode2 size={20} style={{ color: '#38bdf8' }} />
            Smart Contracts
          </h3>
          <p style={{ color: '#cbd5e1', fontSize: '0.9rem', margin: '10px 0' }}>
            • Automated ISO compliance validation<br />
            • Escrow delivery payment release<br />
            • Immutable milestone logging<br />
            • Automated penalty enforcement
          </p>
          <button className="btn" onClick={onDeployContract} style={{ background: 'linear-gradient(135deg, #0284c7, #38bdf8)', color: '#fff' }}>
            <FileCode2 size={16} />
            Deploy Smart Contract
          </button>
        </div>

        <div className="card" style={{ marginBottom: 0 }}>
          <h3 style={{ fontSize: '1.2rem' }}>
            <Search size={20} style={{ color: '#a78bfa' }} />
            Component Traceability
          </h3>
          <p style={{ color: '#cbd5e1', fontSize: '0.9rem', margin: '10px 0' }}>
            • End-to-end component genealogy<br />
            • Origin mine-to-assembly trace<br />
            • Tamper-proof RFID/QR hash ledger<br />
            • Counterfeit prevention token
          </p>
          <button className="btn" onClick={onTraceComponent} style={{ background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', color: '#fff' }}>
            <Search size={16} />
            Trace Component
          </button>
        </div>
      </div>

      <div className="results-panel">
        <h3>Recent Immutable Ledger Events</h3>
        <div className="vulnerability-item" style={{ borderLeftColor: '#10b981', background: 'rgba(16, 185, 129, 0.08)' }}>
          <h4 style={{ color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle size={16} />
            Verification Complete: Advanced Defense Systems Ltd
          </h4>
          <p><strong>Tx Hash:</strong> <code style={{ color: '#ffd700', fontFamily: 'monospace' }}>0x9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08</code></p>
          <p><strong>Gas Used:</strong> 2,847,392 | <strong>Block Height:</strong> #18,942,104</p>
        </div>

        <div className="vulnerability-item" style={{ borderLeftColor: '#f59e0b', background: 'rgba(245, 158, 11, 0.08)' }}>
          <h4 style={{ color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={16} />
            Pending Verification: Precision Electronics Corp (Germany)
          </h4>
          <p><strong>Status:</strong> AS9100 cryptographic key validation in progress (ETA 12 mins)</p>
        </div>
      </div>
    </div>
  );
}
