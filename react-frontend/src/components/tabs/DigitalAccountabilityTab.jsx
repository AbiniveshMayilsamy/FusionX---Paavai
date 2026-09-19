import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Key, 
  Lock, 
  FileCheck2, 
  CheckCircle, 
  AlertCircle, 
  PlusCircle, 
  Hash, 
  UserCheck, 
  Download, 
  Copy,
  ExternalLink,
  Search,
  Fingerprint,
  ChevronDown,
  ChevronUp,
  Check
} from 'lucide-react';
import { computeSHA256, computeSHA512 } from '../../blockchain/BlockchainEngine';
import { ShinyText } from '../react-bits';

export function DigitalAccountabilityTab({ currentUser, onTriggerExecution }) {
  const isAdmin = currentUser?.userType === 'admin';
  const [events, setEvents] = useState([
    {
      index: 104,
      timestamp: '2026-09-18T18:42:10Z',
      action: 'SUPPLIER_DELAY_ESCALATION',
      entity: 'Mining Corp (Katanga, Congo)',
      role: 'Chief Logistics Commander',
      officer: currentUser?.name || 'Defense Procurement Director',
      officerKey: '0x8F4A...3B91',
      details: 'Bab-el-Mandeb conflict transit delay (+14.8d) flagged. Emergency airlift authorization requested.',
      sha256: '9f83c1e2a54b9d0e12f65a4c387b9201e74f85a219bc04d6e83f124a905c731e',
      sha512: '3a1b2c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d',
      verified: true
    },
    {
      index: 103,
      timestamp: '2026-09-17T11:15:30Z',
      action: 'TIER_CLASSIFICATION_AUDIT',
      entity: 'Rare Metals Co & Precursors Ltd',
      role: 'NATO Senior Auditor',
      officer: 'Col. Marcus Vance',
      officerKey: '0x2D17...9E44',
      details: 'Automated DAG reclassification verified. Entity assigned to Tier 3 Specialized Silicon Precursors.',
      sha256: '4b7a19c28e5f03d19b4e78a6c51230df91e84a275bc301ef67a924b18c50e234',
      sha512: 'f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0',
      verified: true
    },
    {
      index: 102,
      timestamp: '2026-09-16T09:30:00Z',
      action: 'INVENTORY_SAFETY_DRAW',
      entity: 'Central Strategic Depot (Bengaluru)',
      role: 'Depot Operations Officer',
      officer: 'Maj. S. K. Nair',
      officerKey: '0x6C39...1A08',
      details: 'Authorized draw of 40 units AESA Radar Transceiver Modules for LCA Tejas Mk2 Line.',
      sha256: '1a9f02c4b8e75d3a21bc90f8471e625a09b83c741e5f02d49a8b71c26e50f381',
      sha512: '1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b',
      verified: true
    },
    {
      index: 101,
      timestamp: '2026-09-14T14:22:45Z',
      action: 'QUALITY_CERT_ISSUANCE',
      entity: 'Precision Electronics Corp (Germany)',
      role: 'DGQA Quality Inspector',
      officer: 'Dr. Aris Thorne',
      officerKey: '0x9A44...5C12',
      details: 'AS9100 Rev D & MIL-STD-810H environmental testing passed with 0 defects detected.',
      sha256: '88c3a10e5b7f92d41b6e30a5c71982df41e65a082bc419ef58a713b29c40e157',
      sha512: '9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d',
      verified: true
    }
  ]);

  const [showSignModal, setShowSignModal] = useState(false);
  const [newAction, setNewAction] = useState('SUPPLIER_DELAY_ESCALATION');
  const [newEntity, setNewEntity] = useState('Mining Corp (Katanga, Congo)');
  const [newOfficerRole, setNewOfficerRole] = useState('Defense Procurement Lead');
  const [newOfficerName, setNewOfficerName] = useState(currentUser?.name || 'Defense Procurement Officer');
  const [newDetails, setNewDetails] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [expandedProof, setExpandedProof] = useState({});
  const [copiedHash, setCopiedHash] = useState(null);

  const handleCopy = (hash, id) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(id);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const toggleProof = (id) => {
    setExpandedProof(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSignAccountabilityStamp = async () => {
    if (!newDetails.trim()) {
      alert('Please enter justification and details for this accountability stamp.');
      return;
    }

    const payload = JSON.stringify({
      action: newAction,
      entity: newEntity,
      officer: newOfficerName,
      role: newOfficerRole,
      details: newDetails,
      timestamp: new Date().toISOString()
    });

    const sha256 = await computeSHA256(payload);
    const sha512 = await computeSHA512(payload);

    const executeCommit = () => {
      const newEntry = {
        index: events.length + 101,
        timestamp: new Date().toISOString(),
        action: newAction,
        entity: newEntity,
        role: newOfficerRole,
        officer: newOfficerName,
        officerKey: `0x${sha256.substring(0, 4).toUpperCase()}...${sha256.substring(sha256.length - 4).toUpperCase()}`,
        details: newDetails,
        sha256,
        sha512,
        verified: true
      };

      setEvents(prev => [newEntry, ...prev]);
      setShowSignModal(false);
      setNewDetails('');
      alert(`Accountability stamp committed to immutable ledger with SHA-256: ${sha256.substring(0, 16)}...`);
    };

    if (onTriggerExecution) {
      onTriggerExecution(`CRYPTOGRAPHICALLY SIGNING ACCOUNTABILITY BLOCK #${events.length + 101}...`, executeCommit);
    } else {
      executeCommit();
    }
  };

  const filteredEvents = events.filter(e => 
    e.action.toLowerCase().includes(searchFilter.toLowerCase()) ||
    e.entity.toLowerCase().includes(searchFilter.toLowerCase()) ||
    e.officer.toLowerCase().includes(searchFilter.toLowerCase()) ||
    e.details.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="tab-content">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h2>
            <Shield size={22} style={{ color: 'var(--primary-gold)' }} />
            Digital Appropriate Accountability & Non-Repudiation Ledger
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.92rem', maxWidth: '850px' }}>
            Cryptographic defense governance ledger. Every tier re-classification, delay escalation, and safety buffer issuance is stamped with non-repudiation SHA-256 chain integrity hashes and SHA-512 transaction receipts.
          </p>
        </div>

        <button
          className="action-btn-gold"
          onClick={() => isAdmin && setShowSignModal(true)}
          disabled={!isAdmin}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            cursor: isAdmin ? 'pointer' : 'not-allowed',
            opacity: isAdmin ? 1 : 0.65
          }}
          title={isAdmin ? "Digitally Sign Accountability Milestone" : "Admin clearance required to sign accountability milestones"}
        >
          {isAdmin ? <Fingerprint size={18} style={{ color: 'inherit' }} /> : <Lock size={16} style={{ color: '#f59e0b' }} />}
          <span style={{ fontWeight: 800, letterSpacing: '0.08em', color: 'inherit' }}>
            {isAdmin ? 'SIGN ACCOUNTABILITY STAMP' : 'READ-ONLY (ADMIN CLEARANCE REQUIRED)'}
          </span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid" style={{ marginBottom: '24px', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div className="stat-card">
          <div className="stat-label">Total Verified Stamps</div>
          <div className="stat-value">{events.length} <span style={{ fontSize: '0.8rem', color: '#10b981' }}>✓ Valid</span></div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Integrity Status</div>
          <div className="stat-value" style={{ color: '#10b981', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle size={18} /> Dual-Hash Intact
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Consensus Protocol</div>
          <div className="stat-value" style={{ fontSize: '1.2rem', color: 'var(--primary-gold)' }}>
            Proof of Authority
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Non-Repudiation Key Type</div>
          <div className="stat-value" style={{ fontSize: '1.2rem', color: '#60a5fa', fontFamily: 'var(--font-mono)' }}>
            SHA-256 + SHA-512
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', padding: '12px 16px', marginBottom: '20px' }}>
        <Search size={16} style={{ color: '#94a3b8' }} />
        <input 
          type="text" 
          placeholder="Filter accountability ledger by action, officer, or entity..." 
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          style={{ background: 'transparent', border: 'none', color: '#ffffff', outline: 'none', width: '100%', fontSize: '0.9rem' }}
        />
      </div>

      {/* Accountability Timeline / Table */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredEvents.map(evt => (
          <div 
            key={evt.index}
            style={{
              background: 'rgba(14, 16, 22, 0.75)',
              border: '1px solid var(--glass-border)',
              borderLeft: '4px solid var(--primary-gold)',
              padding: '20px',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary-gold)', fontSize: '0.9rem' }}>
                    BLOCK #{evt.index}
                  </span>
                  <span style={{
                    background: 'rgba(217, 186, 132, 0.15)',
                    color: 'var(--primary-gold)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    letterSpacing: '0.04em'
                  }}>
                    {evt.action}
                  </span>
                  <span style={{ color: '#10b981', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle size={12} /> Verified Sign-off
                  </span>
                </div>
                <strong style={{ fontSize: '1.05rem', color: '#ffffff' }}>{evt.entity}</strong>
              </div>

              <div style={{ textAlign: 'right', fontSize: '0.78rem', color: '#64748b' }}>
                <div>Stamping Officer: <strong style={{ color: '#cbd5e1' }}>{evt.officer}</strong> ({evt.role})</div>
                <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary-gold)' }}>
                  Key: {isAdmin ? evt.officerKey : `${evt.officerKey.slice(0, 6)}... [REDACTED: ADMIN ONLY]`}
                </div>
                <div>{new Date(evt.timestamp).toLocaleString()}</div>
              </div>
            </div>

            <p style={{ color: '#cbd5e1', fontSize: '0.88rem', marginBottom: '16px', lineHeight: 1.5 }}>
              {evt.details}
            </p>

            {/* Cryptographic Proof Summary Bar */}
            <div style={{
              background: 'rgba(0,0,0,0.5)',
              border: '1px solid rgba(217, 186, 132, 0.15)',
              borderRadius: expandedProof[evt.index] ? '6px 6px 0 0' : '6px',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px',
              fontSize: '0.78rem',
              fontFamily: 'var(--font-mono)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Shield size={13} style={{ color: 'var(--primary-gold)' }} />
                  SHA-256 Proof:
                </span>
                <span style={{ color: 'var(--primary-gold)', fontWeight: 700 }}>
                  {evt.sha256.substring(0, 8)}...{evt.sha256.substring(evt.sha256.length - 8)}
                </span>
                <button
                  onClick={() => handleCopy(evt.sha256, `hash-${evt.index}`)}
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '4px',
                    color: copiedHash === `hash-${evt.index}` ? '#10b981' : '#cbd5e1',
                    padding: '2px 8px',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  title="Copy Full SHA-256 Hash"
                >
                  {copiedHash === `hash-${evt.index}` ? <Check size={11} /> : <Copy size={11} />}
                  {copiedHash === `hash-${evt.index}` ? 'Copied' : 'Copy'}
                </button>
                <span style={{ color: '#10b981', fontSize: '0.74rem', display: 'inline-flex', alignItems: 'center', gap: '4px', marginLeft: '4px' }}>
                  <CheckCircle size={12} /> Dual-Hash Verified
                </span>
              </div>

              <button
                onClick={() => toggleProof(evt.index)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: expandedProof[evt.index] ? 'var(--primary-gold)' : '#94a3b8',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 0'
                }}
              >
                {expandedProof[evt.index] ? (
                  <>Hide Forensic Proof <ChevronUp size={13} /></>
                ) : (
                  <>Inspect Forensic Proof <ChevronDown size={13} /></>
                )}
              </button>
            </div>

            {/* Expandable Forensic Proof Drawer */}
            {expandedProof[evt.index] && (
              <div style={{
                background: 'rgba(6, 7, 10, 0.95)',
                border: '1px solid rgba(217, 186, 132, 0.15)',
                borderTop: 'none',
                borderRadius: '0 0 6px 6px',
                padding: '14px',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', gap: '12px' }}>
                  <span style={{ color: '#94a3b8', whiteSpace: 'nowrap' }}>Full SHA-256 Block Hash:</span>
                  <span style={{ color: 'var(--primary-gold)', wordBreak: 'break-all', textAlign: 'right' }}>
                    {evt.sha256}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', gap: '12px' }}>
                  <span style={{ color: '#94a3b8', whiteSpace: 'nowrap' }}>SHA-512 Tx Non-Repudiation Receipt:</span>
                  <span style={{ color: '#60a5fa', wordBreak: 'break-all', textAlign: 'right' }}>
                    {isAdmin ? evt.sha512 : <span style={{ color: '#f59e0b', fontStyle: 'italic' }}>[REDACTED - DEFENSE SENSITIVE: ADMIN CLEARANCE REQUIRED]</span>}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', paddingTop: '6px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.72rem' }}>
                  <span>Consensus: Proof of Authority (PoA)</span>
                  <span>Ledger State: Immutable & Cryptographically Finalized</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Sign Accountability Modal */}
      {showSignModal && (
        <div className="execution-overlay" style={{ background: 'rgba(6, 7, 9, 0.94)', zIndex: 10000, overflowY: 'auto' }}>
          <div className="execution-box" style={{ maxWidth: '640px', width: '100%', textAlign: 'left', padding: '32px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Fingerprint size={22} style={{ color: 'var(--primary-gold)' }} />
              Digitally Sign Accountability Milestone
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '20px' }}>
              Generates an immutable cryptographic record on the LinkGuard blockchain ledger with non-repudiation signature.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px' }}>Milestone Action Category</label>
                <select 
                  value={newAction} 
                  onChange={(e) => setNewAction(e.target.value)}
                  style={{ width: '100%', background: '#0a0c10', border: '1px solid var(--glass-border)', color: '#ffffff', padding: '10px', fontSize: '0.9rem', borderRadius: '4px' }}
                >
                  <option style={{ background: '#0c0e13', color: '#ffffff' }} value="SUPPLIER_DELAY_ESCALATION">SUPPLIER_DELAY_ESCALATION (Lead Time Friction & Rerouting)</option>
                  <option style={{ background: '#0c0e13', color: '#ffffff' }} value="TIER_CLASSIFICATION_AUDIT">TIER_CLASSIFICATION_AUDIT (Topological Hierarchy Verification)</option>
                  <option style={{ background: '#0c0e13', color: '#ffffff' }} value="INVENTORY_SAFETY_DRAW">INVENTORY_SAFETY_DRAW (Depot Emergency Buffer Drawdown)</option>
                  <option style={{ background: '#0c0e13', color: '#ffffff' }} value="QUALITY_CLEARANCE">QUALITY_CLEARANCE (Defense Standard Compliance Approval)</option>
                  <option style={{ background: '#0c0e13', color: '#ffffff' }} value="STRATEGIC_REROUTE_AUTH">STRATEGIC_REROUTE_AUTH (Maritime Chokepoint Bypass Authorization)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px' }}>Target Entity / Supplier / Depot</label>
                <input 
                  type="text" 
                  value={newEntity} 
                  onChange={(e) => setNewEntity(e.target.value)}
                  style={{ width: '100%', background: '#0a0c10', border: '1px solid var(--glass-border)', color: '#ffffff', padding: '10px', fontSize: '0.9rem', borderRadius: '4px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px' }}>Signer Name</label>
                  <input 
                    type="text" 
                    value={newOfficerName} 
                    onChange={(e) => setNewOfficerName(e.target.value)}
                    style={{ width: '100%', background: '#0a0c10', border: '1px solid var(--glass-border)', color: '#ffffff', padding: '10px', fontSize: '0.9rem', borderRadius: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px' }}>Signer Role / Authority</label>
                  <input 
                    type="text" 
                    value={newOfficerRole} 
                    onChange={(e) => setNewOfficerRole(e.target.value)}
                    style={{ width: '100%', background: '#0a0c10', border: '1px solid var(--glass-border)', color: '#ffffff', padding: '10px', fontSize: '0.9rem', borderRadius: '4px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px' }}>Operational Rationale & Justification</label>
                <textarea 
                  rows="3"
                  placeholder="State the justification, operational mandate, or inspection results..."
                  value={newDetails}
                  onChange={(e) => setNewDetails(e.target.value)}
                  style={{ width: '100%', background: '#0a0c10', border: '1px solid var(--glass-border)', color: '#ffffff', padding: '10px', fontSize: '0.9rem', resize: 'none', borderRadius: '4px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button 
                className="execution-btn"
                onClick={() => setShowSignModal(false)}
                style={{ borderColor: '#ef4444', color: '#ef4444' }}
              >
                Cancel
              </button>
              <button 
                className="action-btn-gold"
                onClick={handleSignAccountabilityStamp}
                style={{ padding: '10px 22px' }}
              >
                <CheckCircle size={16} style={{ color: 'inherit' }} />
                <span style={{ fontWeight: 800, letterSpacing: '0.08em', color: 'inherit' }}>CONFIRM & COMMIT TO LEDGER</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
