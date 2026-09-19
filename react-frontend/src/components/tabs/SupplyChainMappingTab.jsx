import React from 'react';
import { Network, ShieldCheck, AlertCircle, ShieldAlert } from 'lucide-react';

export function SupplyChainMappingTab({ suppliers, onSelectSupplier }) {
  // Group suppliers by Tier
  const tier1 = suppliers.filter((s) => s.tier === 1);
  const tier2 = suppliers.filter((s) => s.tier === 2);
  const tier3 = suppliers.filter((s) => s.tier === 3);
  const tier4 = suppliers.filter((s) => s.tier === 4);

  const getCardClass = (s) => {
    if (s.risk === 'Critical' || s.risk_score >= 0.7) return 'supplier-card vulnerable';
    if (s.risk === 'Medium' || (s.risk_score >= 0.4 && s.risk_score < 0.7)) return 'supplier-card medium-risk';
    return 'supplier-card';
  };

  return (
    <div className="tab-content">
      <h2>
        <Network size={22} style={{ color: 'var(--primary-gold)' }} />
        Multi-Tier Supply Chain Visualization
      </h2>
      <p style={{ color: '#cbd5e1', marginBottom: '20px' }}>
        Interactive map of direct (Tier 1) and sub-tier supply dependencies with real-time risk classification and blockchain cryptographic consensus.
      </p>

      <div className="supply-chain-map">
        {/* Tier 1 */}
        <div className="tier-row">
          <div className="tier-badge">Tier 1 (Direct)</div>
          <div className="suppliers-track">
            {tier1.map((s) => (
              <div key={s.id || s.name} className={getCardClass(s)} onClick={() => onSelectSupplier(s)}>
                <strong>{s.name}</strong>
                <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>{s.country}</div>
                <div className="blockchain-verification-tag">{s.statusBadge || '✓ Blockchain Verified'}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tier 2 */}
        <div className="tier-row">
          <div className="tier-badge">Tier 2 (Modules)</div>
          <div className="suppliers-track">
            {tier2.map((s) => (
              <div key={s.id || s.name} className={getCardClass(s)} onClick={() => onSelectSupplier(s)}>
                <strong>{s.name}</strong>
                <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>{s.country}</div>
                <div className="blockchain-verification-tag">{s.statusBadge || '✓ Verified'}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tier 3 */}
        <div className="tier-row">
          <div className="tier-badge">Tier 3 (Components)</div>
          <div className="suppliers-track">
            {tier3.map((s) => (
              <div key={s.id || s.name} className={getCardClass(s)} onClick={() => onSelectSupplier(s)}>
                <strong>{s.name}</strong>
                <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>{s.country}</div>
                <div className="blockchain-verification-tag">{s.statusBadge || '⚠ Flagged'}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tier 4 */}
        <div className="tier-row">
          <div className="tier-badge">Tier 4 (Raw Materials)</div>
          <div className="suppliers-track">
            {tier4.map((s) => (
              <div key={s.id || s.name} className={getCardClass(s)} onClick={() => onSelectSupplier(s)}>
                <strong>{s.name}</strong>
                <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>{s.country}</div>
                <div className="blockchain-verification-tag">{s.statusBadge || '✓ Verified'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
