import React, { useState } from 'react';
import { Database, Key, Dices, CheckCircle, ShieldCheck } from 'lucide-react';
import { SYNTHETIC_SUPPLIERS_POOL } from '../../data/suppliersData';

export function SyntheticDataTab({ onStartExecution }) {
  const [accessGranted, setAccessGranted] = useState(false);
  const [currentSample, setCurrentSample] = useState(SYNTHETIC_SUPPLIERS_POOL[0]);

  const handleRequestAccess = () => {
    onStartExecution('VERIFYING ENCRYPTED CREDENTIALS & GENERATING SYNTHETIC ACCESS TOKEN...', () => {
      setAccessGranted(true);
    });
  };

  const handleGenerateNew = () => {
    onStartExecution('SYNTHESIZING NEW SUPPLY CHAIN SAMPLES VIA GENERATIVE MODELS...', () => {
      const randomSupplier = SYNTHETIC_SUPPLIERS_POOL[Math.floor(Math.random() * SYNTHETIC_SUPPLIERS_POOL.length)];
      setCurrentSample(randomSupplier);
    });
  };

  return (
    <div className="tab-content">
      <h2>
        <Database size={22} style={{ color: '#ffd700' }} />
        Synthetic Dataset Access & Generation
      </h2>

      <div style={{
        background: 'rgba(15, 23, 42, 0.7)',
        borderLeft: '4px solid #f59e0b',
        padding: '20px',
        borderRadius: '0 12px 12px 0',
        margin: '20px 0',
        border: '1px solid rgba(245, 158, 11, 0.2)',
        borderLeftWidth: '4px'
      }}>
        <h3 style={{ color: '#fbbf24', fontSize: '1.1rem', marginBottom: '8px' }}>
          🔐 Automated Synthetic Data Pipeline
        </h3>
        <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6 }}>
          <strong>Step 1:</strong> Verify administrator security privileges<br />
          <strong>Step 2:</strong> Complete multi-factor cryptographic handshake<br />
          <strong>Step 3:</strong> Request encrypted ML dataset token<br />
          <strong>Step 4:</strong> Stream synthesized multi-tier supplier samples for model training
        </p>
      </div>

      {!accessGranted ? (
        <button className="btn" onClick={handleRequestAccess} style={{ maxWidth: '320px' }}>
          <Key size={18} />
          Request Secure Dataset Access
        </button>
      ) : (
        <div style={{ animation: 'fadeIn 0.4s ease' }}>
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid #10b981',
            borderRadius: '10px',
            padding: '12px 16px',
            color: '#6ee7b7',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle size={18} />
            <span>Dataset Access Granted. Synthetic Generator Active.</span>
          </div>

          <div style={{
            background: 'rgba(5, 10, 20, 0.9)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '16px'
          }}>
            <h4 style={{ color: '#10b981', marginBottom: '10px' }}>🎲 Generated Sample Payload (JSON)</h4>
            <pre style={{
              background: 'rgba(0, 0, 0, 0.5)',
              padding: '16px',
              borderRadius: '8px',
              color: '#34d399',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.88rem',
              overflowX: 'auto'
            }}>
              {JSON.stringify(currentSample, null, 2)}
            </pre>
          </div>

          <button className="btn" onClick={handleGenerateNew} style={{ maxWidth: '320px', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff' }}>
            <Dices size={18} />
            Generate New Synthetic Record
          </button>
        </div>
      )}
    </div>
  );
}
