import React, { useState } from 'react';
import { FileSignature, ShieldCheck, ScrollText, Sparkles } from 'lucide-react';

export function ContractsTab({ onStartExecution, userRole = 'viewer' }) {
  const isAdmin = userRole === 'admin';
  const [contractId, setContractId] = useState('SCA-2024-001');
  const [contractAddress, setContractAddress] = useState('0x742d35Cc6634C0532925a3b8D4C0d8b3f8e7f1a2');

  const handleGenerateContract = () => {
    onStartExecution('GENERATING IMMUTABLE SMART CONTRACT TEMPLATE & COMPLIANCE RULES...', () => {
      const newId = 'SCA-' + new Date().getFullYear() + '-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      const newAddr = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setContractId(newId);
      setContractAddress(newAddr);
    });
  };

  return (
    <div className="tab-content">
      <h2>
        <FileSignature size={22} style={{ color: 'var(--primary-gold)' }} />
        Legal Agreements & Smart Contract Generator
      </h2>

      <div style={{
        background: 'rgba(15, 23, 42, 0.8)',
        border: '1px solid rgba(255, 215, 0, 0.3)',
        borderRadius: '16px',
        padding: '24px',
        margin: '20px 0',
        fontFamily: 'serif'
      }}>
        <h3 style={{ color: 'var(--primary-gold)', fontFamily: 'Outfit, sans-serif', fontSize: '1.2rem', marginBottom: '8px' }}>
           SUPPLY CHAIN MASTER SERVICE AGREEMENT
        </h3>
        <p style={{ color: '#94a3b8', fontSize: '0.88rem', fontFamily: 'Outfit, sans-serif', marginBottom: '14px' }}>
          <strong>AGREEMENT NO:</strong> {contractId} | <strong>BLOCKCHAIN HASH:</strong> <code style={{ color: '#38bdf8' }}>{contractAddress}</code>
        </p>

        <div style={{ color: '#e2e8f0', fontSize: '0.95rem', lineHeight: 1.7 }}>
          <p><strong>PARTIES:</strong> LinkGuard Defense Systems (Buyer) & Verified Consortium Supplier (Seller)</p>
          <p><strong>EFFECTIVE DATE:</strong> {new Date().toLocaleDateString()}</p>
          <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '14px 0' }} />
          <p><strong>ARTICLE 1: SUPPLY SPECIFICATIONS & QUALITY ASSURANCE</strong></p>
          <p>1.1 The Supplier warrants that all delivered aerospace/defense components meet ISO 9001:2015 and AS9100 quality standards.</p>
          <p>1.2 Real-time telemetry and batch identifiers must be signed and anchored to the LinkGuard Blockchain Ledger upon dispatch.</p>
          <p>1.3 Failure to maintain SLA reliability &gt;90% triggers automated decentralized escrow penalties.</p>
        </div>
      </div>

      <button className="btn" onClick={handleGenerateContract} disabled={!isAdmin} style={{ maxWidth: '340px', cursor: isAdmin ? 'pointer' : 'not-allowed', opacity: isAdmin ? 1 : 0.5 }}>
        <Sparkles size={18} />
        Generate New Custom Smart Contract
      </button>
      {!isAdmin && (
        <p style={{ fontSize: '0.78rem', color: '#f59e0b', marginTop: '8px', fontFamily: 'var(--font-mono)' }}>
          ⚠ Contract generation requires Admin clearance.
        </p>
      )}
    </div>
  );
}
