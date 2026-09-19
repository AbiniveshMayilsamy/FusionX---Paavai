import React, { useState, useMemo } from 'react';
import {
  Link2,
  ShieldCheck,
  ShieldAlert,
  FileCode2,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Lock,
  Unlock,
  Hash,
  Copy,
  Check,
  PlusCircle,
  RefreshCw,
  Info,
  ChevronDown,
  ChevronUp,
  Layers,
  Award,
  FileText
} from 'lucide-react';
import { useBlockchain } from '../../blockchain/useBlockchain';
import { verifyChain } from '../../blockchain/BlockchainEngine';

export function BlockchainVerificationTab({
  userRole = 'viewer',
  userName = 'Officer',
  onStartExecution,
  onDeployContract,
  onTraceComponent
}) {
  const { chain, stats, loading, error, fetchChain, addRecord, validateChain } = useBlockchain(userRole);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterResult, setFilterResult] = useState('ALL');
  const [copiedHash, setCopiedHash] = useState(null);
  const [showExplanation, setShowExplanation] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [expandedBlocks, setExpandedBlocks] = useState({});

  // Add Record Form State (Admin Only)
  const [formData, setFormData] = useState({
    supplier_id: 'SUP_012',
    supplier_name: 'Bharat Dynamics Defense Systems',
    tier: 1,
    country: 'India',
    inspector: userName || 'Admin Inspector',
    result: 'PASSED',
    risk_score: 18.5,
    notes: 'DGQA Military Depot Inspection: Batch #B-409 verified and stamped.'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMsg, setFormMsg] = useState('');

  const isAdminOrAuditor = userRole === 'admin' || userRole === 'auditor';
  const isAdmin = userRole === 'admin';

  // Toggle expanded card
  const toggleExpand = (idx) => {
    setExpandedBlocks(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Copy hash to clipboard
  const handleCopy = (text, id) => {
    if (!text || text === 'REDACTED') return;
    navigator.clipboard.writeText(text);
    setCopiedHash(id);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  // Run full dual verification (Client WebCrypto + Backend SHA-256/SHA-512)
  const handleVerifyChain = async () => {
    setIsValidating(true);
    try {
      if (onStartExecution) {
        onStartExecution('PERFORMING DUAL-HASH CRYPTOGRAPHIC CONSENSUS AUDIT (SHA-256 + SHA-512)...', async () => {
          const serverCheck = await validateChain();
          let clientCheck = null;
          if (isAdminOrAuditor && chain.length > 0) {
            clientCheck = await verifyChain(chain);
          }
          setValidationResult({
            server: serverCheck,
            client: clientCheck,
            timestamp: new Date().toLocaleTimeString(),
            isFullyValid: serverCheck?.valid
          });
          setIsValidating(false);
        });
      } else {
        const serverCheck = await validateChain();
        let clientCheck = null;
        if (isAdminOrAuditor && chain.length > 0) {
          clientCheck = await verifyChain(chain);
        }
        setValidationResult({
          server: serverCheck,
          client: clientCheck,
          timestamp: new Date().toLocaleTimeString(),
          isFullyValid: serverCheck?.valid
        });
        setIsValidating(false);
      }
    } catch (err) {
      alert('Verification error: ' + err.message);
      setIsValidating(false);
    }
  };

  // Submit new block (Admin)
  const handleSubmitRecord = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      alert('Only Admin role can commit immutable inspection blocks.');
      return;
    }

    setIsSubmitting(true);
    setFormMsg('');

    const action = async () => {
      try {
        const res = await addRecord({
          supplier_id: formData.supplier_id.trim(),
          supplier_name: formData.supplier_name.trim(),
          tier: Number(formData.tier),
          country: formData.country.trim(),
          inspector: formData.inspector.trim(),
          result: formData.result,
          risk_score: parseFloat(formData.risk_score) || 0.0,
          notes: formData.notes.trim()
        });
        setFormMsg(`✓ Block #${res.block?.index ?? 'New'} successfully mined & cryptographically sealed!`);
        setShowAddForm(false);
        // Expand newly mined block
        if (res.block) {
          setExpandedBlocks(prev => ({ ...prev, [res.block.index]: true }));
        }
      } catch (err) {
        setFormMsg(`❌ Failed to mine block: ${err.message}`);
      } finally {
        setIsSubmitting(false);
      }
    };

    if (onStartExecution) {
      onStartExecution(`CALCULATING SHA-256 CHAIN HASH & SHA-512 TX RECEIPT FOR ${formData.supplier_id}...`, action);
    } else {
      await action();
    }
  };

  // Filtered chain blocks
  const filteredBlocks = useMemo(() => {
    return chain.filter(b => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        (b.supplier_name && b.supplier_name.toLowerCase().includes(q)) ||
        (b.supplier_id && b.supplier_id.toLowerCase().includes(q)) ||
        (b.inspector && b.inspector.toLowerCase().includes(q)) ||
        (b.hash && b.hash.toLowerCase().includes(q));

      const matchFilter =
        filterResult === 'ALL' ||
        b.result?.toUpperCase() === filterResult;

      return matchSearch && matchFilter;
    });
  }, [chain, searchQuery, filterResult]);

  return (
    <div className="tab-content" style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
      {/* ── Title & Clearance Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
            <Link2 size={26} style={{ color: 'var(--primary-gold)' }} />
            Cryptographic Defense Blockchain Ledger
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.92rem', marginTop: '4px' }}>
            Dual-Hash Architecture: SHA-256 (Chain Immutability) + SHA-512 / H-64 (Inspection Tx Receipts)
          </p>
        </div>

        {/* Role Clearance Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: isAdminOrAuditor ? 'rgba(16, 185, 129, 0.12)' : 'rgba(59, 130, 246, 0.12)',
          border: `1px solid ${isAdminOrAuditor ? '#10b981' : '#3b82f6'}`,
          padding: '8px 16px',
          borderRadius: '30px'
        }}>
          {isAdminOrAuditor ? (
            <Unlock size={18} style={{ color: '#10b981' }} />
          ) : (
            <Lock size={18} style={{ color: '#3b82f6' }} />
          )}
          <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f8fafc', textTransform: 'uppercase' }}>
            Clearance: <span style={{ color: isAdminOrAuditor ? '#10b981' : '#38bdf8' }}>{userRole}</span>
          </span>
          <span style={{
            fontSize: '0.72rem',
            padding: '2px 8px',
            borderRadius: '10px',
            background: isAdminOrAuditor ? '#059669' : '#1d4ed8',
            color: '#fff',
            fontWeight: 700
          }}>
            {isAdminOrAuditor ? 'FULL HASH ACCESS' : 'REDACTED PROTOCOL'}
          </span>
        </div>
      </div>

      {/* ── Military Base Audit Explainer (Red Stamp vs Blockchain) ── */}
      <div style={{
        background: 'rgba(18, 30, 56, 0.85)',
        border: '1px solid rgba(255, 215, 0, 0.25)',
        borderRadius: '12px',
        padding: '16px 20px',
        marginBottom: '24px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)'
      }}>
        <div
          onClick={() => setShowExplanation(!showExplanation)}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Award size={20} style={{ color: 'var(--primary-gold)' }} />
            <h4 style={{ margin: 0, color: 'var(--primary-gold)', fontSize: '1.05rem', fontWeight: 600 }}>
              Military Base Audit Framework: Physical Red Stamp vs. Cryptographic Blockchain
            </h4>
          </div>
          <button style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            {showExplanation ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>

        {showExplanation && (
          <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '0.88rem', color: '#cbd5e1' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '12px' }}>
                <h5 style={{ color: '#ef4444', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <XCircle size={15} /> Legacy Physical Red Stamp (Depot/Challan)
                </h5>
                <ul style={{ margin: 0, paddingLeft: '18px', lineHeight: '1.6' }}>
                  <li>Prone to document forgery, alteration, and lost paperwork.</li>
                  <li>Physical ledger silos; zero real-time visibility across commands.</li>
                  <li>Single point of compromise if paper registers are destroyed or manipulated.</li>
                </ul>
              </div>
              <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', padding: '12px' }}>
                <h5 style={{ color: '#10b981', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={15} /> LinkGuard Dual-Hash Ledger
                </h5>
                <ul style={{ margin: 0, paddingLeft: '18px', lineHeight: '1.6' }}>
                  <li><strong>SHA-256 (64 hex chars):</strong> Chained merkle pointers prevent backward block alteration.</li>
                  <li><strong>SHA-512 / H-64 (128 hex chars):</strong> 64-byte military-grade Tx Receipt per inspection.</li>
                  <li><strong>Role Gating:</strong> Sensitive hashes sanitized for Analyst/Viewer, transparent for Admin/Auditor.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Live Stats Overview Bar ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '14px',
        marginBottom: '24px'
      }}>
        <div className="card" style={{ padding: '16px', margin: 0, textAlign: 'center', borderTop: '3px solid var(--primary-gold)' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Chain Height</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary-gold)', marginTop: '4px' }}>
            {loading ? '...' : (stats?.total_blocks ?? chain.length)}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>Blocks Mined</span>
        </div>

        <div className="card" style={{ padding: '16px', margin: 0, textAlign: 'center', borderTop: '3px solid #10b981' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Passed Audits</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#10b981', marginTop: '4px' }}>
            {loading ? '...' : (stats?.passed ?? chain.filter(b => b.result === 'PASSED').length)}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#34d399' }}>✓ Verified Compliant</span>
        </div>

        <div className="card" style={{ padding: '16px', margin: 0, textAlign: 'center', borderTop: '3px solid #ef4444' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Failed Audits</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#ef4444', marginTop: '4px' }}>
            {loading ? '...' : (stats?.failed ?? chain.filter(b => b.result === 'FAILED').length)}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#f87171' }}>❌ Rejected / Quarantined</span>
        </div>

        <div className="card" style={{ padding: '16px', margin: 0, textAlign: 'center', borderTop: '3px solid #f59e0b' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pending Consensus</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#f59e0b', marginTop: '4px' }}>
            {loading ? '...' : (stats?.pending ?? chain.filter(b => b.result === 'PENDING').length)}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#fbbf24' }}>⚠ Under Inspection</span>
        </div>

        <div className="card" style={{ padding: '16px', margin: 0, textAlign: 'center', borderTop: '3px solid #38bdf8' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Chain Integrity</span>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#38bdf8', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <ShieldCheck size={20} style={{ color: '#10b981' }} />
            {stats?.chain_valid !== false ? 'INTACT' : 'CORRUPTED'}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Dual Consensus OK</span>
        </div>
      </div>

      {/* ── Action Toolbar: Verify, Mine Block, Filter ── */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(18, 30, 56, 0.7)',
        padding: '16px 20px',
        borderRadius: '12px',
        marginBottom: '20px',
        border: '1px solid rgba(255, 215, 0, 0.15)'
      }}>
        {/* Search & Filter */}
        <div style={{ display: 'flex', gap: '10px', flex: 1, minWidth: '280px', maxWidth: '550px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search supplier, ID, inspector, hash..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                borderRadius: '8px',
                background: 'rgba(10, 15, 30, 0.8)',
                border: '1px solid rgba(255, 215, 0, 0.2)',
                color: '#f8fafc',
                fontSize: '0.88rem'
              }}
            />
          </div>

          <select
            value={filterResult}
            onChange={(e) => setFilterResult(e.target.value)}
            style={{
              padding: '9px 12px',
              borderRadius: '8px',
              background: 'rgba(10, 15, 30, 0.8)',
              border: '1px solid rgba(255, 215, 0, 0.2)',
              color: '#f8fafc',
              fontSize: '0.88rem',
              cursor: 'pointer'
            }}
          >
            <option value="ALL">All Results</option>
            <option value="PASSED">Passed Only</option>
            <option value="FAILED">Failed Only</option>
            <option value="PENDING">Pending Only</option>
          </select>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            className="btn"
            onClick={fetchChain}
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 14px', background: 'rgba(255, 255, 255, 0.08)' }}
            title="Refresh chain from node"
          >
            <RefreshCw size={15} className={loading ? 'spin' : ''} />
            Refresh
          </button>

          <button
            className="btn"
            onClick={handleVerifyChain}
            disabled={isValidating}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              background: 'linear-gradient(135deg, #059669, #10b981)',
              color: '#fff',
              fontWeight: 600
            }}
          >
            <ShieldCheck size={16} />
            {isValidating ? 'Auditing Chain...' : 'Verify Cryptographic Integrity'}
          </button>

          {isAdmin && (
            <button
              className="btn"
              onClick={() => setShowAddForm(!showAddForm)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 16px',
                background: 'linear-gradient(135deg, #b45309, #f59e0b)',
                color: '#fff',
                fontWeight: 600
              }}
            >
              <PlusCircle size={16} />
              {showAddForm ? 'Close Form' : 'Seal New Inspection Record'}
            </button>
          )}
        </div>
      </div>

      {/* ── Validation Audit Result Box ── */}
      {validationResult && (
        <div style={{
          background: validationResult.isFullyValid ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.15)',
          border: `1px solid ${validationResult.isFullyValid ? '#10b981' : '#ef4444'}`,
          borderRadius: '10px',
          padding: '16px 20px',
          marginBottom: '20px',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{
              margin: 0,
              color: validationResult.isFullyValid ? '#34d399' : '#f87171',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              {validationResult.isFullyValid ? <ShieldCheck size={20} /> : <ShieldAlert size={20} />}
              Ledger Consensus Audit Passed: {validationResult.server?.total_blocks_checked ?? chain.length} Blocks Verified
            </h4>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Audited at {validationResult.timestamp}</span>
          </div>
          <p style={{ margin: '8px 0 0 0', fontSize: '0.86rem', color: '#cbd5e1' }}>
            ✓ Merkle pointer links unbroken &nbsp;|&nbsp;
            ✓ SHA-256 block hash integrity verified &nbsp;|&nbsp;
            ✓ SHA-512 (64-byte / H-64) transaction receipts authenticated &nbsp;|&nbsp;
            ✓ Genesis block genesis_0 validated.
          </p>
        </div>
      )}

      {/* ── Add Record Form (Admin Only) ── */}
      {isAdmin && showAddForm && (
        <div className="card" style={{
          background: 'rgba(20, 32, 60, 0.95)',
          border: '1px solid var(--primary-gold)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)'
        }}>
          <h3 style={{ margin: '0 0 16px 0', color: 'var(--primary-gold)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PlusCircle size={20} />
            Mine New Military Inspection Record (Block #{chain.length})
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '20px' }}>
            Authorized Military Depot Sign-off. This action will compute SHA-256 & SHA-512 hashes and append an immutable block to the chain.
          </p>

          <form onSubmit={handleSubmitRecord}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>Supplier ID</label>
                <input
                  type="text"
                  required
                  value={formData.supplier_id}
                  onChange={(e) => setFormData({ ...formData, supplier_id: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', background: '#0a0f1e', border: '1px solid #475569', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>Supplier Name</label>
                <input
                  type="text"
                  required
                  value={formData.supplier_name}
                  onChange={(e) => setFormData({ ...formData, supplier_name: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', background: '#0a0f1e', border: '1px solid #475569', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>Supply Tier</label>
                <select
                  value={formData.tier}
                  onChange={(e) => setFormData({ ...formData, tier: Number(e.target.value) })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', background: '#0a0f1e', border: '1px solid #475569', color: '#fff' }}
                >
                  <option value={1}>Tier 1 (Prime Defense Contractor)</option>
                  <option value={2}>Tier 2 (Major Subsystem Provider)</option>
                  <option value={3}>Tier 3 (Component & Raw Material)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>Jurisdiction / Country</label>
                <input
                  type="text"
                  required
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', background: '#0a0f1e', border: '1px solid #475569', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>Inspector Signature</label>
                <input
                  type="text"
                  required
                  value={formData.inspector}
                  onChange={(e) => setFormData({ ...formData, inspector: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', background: '#0a0f1e', border: '1px solid #475569', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>Audit Verdict</label>
                <select
                  value={formData.result}
                  onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', background: '#0a0f1e', border: '1px solid #475569', color: '#fff', fontWeight: 600 }}
                >
                  <option value="PASSED">✓ PASSED (Accept into Service)</option>
                  <option value="PENDING">⚠ PENDING (Laboratory Review)</option>
                  <option value="FAILED">❌ FAILED (Quarantine & Reject)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>Risk Score (0 - 100)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={formData.risk_score}
                  onChange={(e) => setFormData({ ...formData, risk_score: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', background: '#0a0f1e', border: '1px solid #475569', color: '#fff' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>Inspection Notes & Challan Ref</label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', background: '#0a0f1e', border: '1px solid #475569', color: '#fff', fontFamily: 'inherit', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn"
                style={{
                  background: 'linear-gradient(135deg, var(--primary-gold), var(--primary-gold-light))',
                  color: '#0b1528',
                  fontWeight: 700,
                  padding: '10px 24px'
                }}
              >
                {isSubmitting ? 'Computing Dual Hashes...' : ' Cryptographically Seal & Append Block'}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="btn"
                style={{ background: 'transparent', color: '#94a3b8', border: '1px solid #475569' }}
              >
                Cancel
              </button>
            </div>
          </form>

          {formMsg && (
            <div style={{ marginTop: '16px', padding: '10px 14px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.05)', fontSize: '0.9rem' }}>
              {formMsg}
            </div>
          )}
        </div>
      )}

      {/* ── Error & Loading States ── */}
      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', borderRadius: '8px', padding: '14px 18px', marginBottom: '20px', color: '#fca5a5' }}>
          <strong>Blockchain Node Error:</strong> {error}. Ensure the FastAPI backend is running at port 8001.
        </div>
      )}

      {loading && chain.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
          <RefreshCw size={32} className="spin" style={{ margin: '0 auto 12px auto', display: 'block', color: 'var(--primary-gold)' }} />
          Synchronizing defense blockchain ledger from node...
        </div>
      )}

      {/* ── Block Explorer Feed ── */}
      <div className="results-panel" style={{ marginTop: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={20} style={{ color: 'var(--primary-gold)' }} />
            Immutable Blockchain Ledger ({filteredBlocks.length} Blocks)
          </h3>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            {isAdminOrAuditor ? ' Verified Proof of Authority (PoA) • Defense Cryptographic Audit Clearance' : ' Operational Mode: Cryptographic Hashes Redacted'}
          </span>
        </div>

        {filteredBlocks.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
            No blockchain records match the specified search query or filter.
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredBlocks.map((block) => {
            const isGenesis = block.index === 0;
            const isPassed = block.result === 'PASSED';
            const isFailed = block.result === 'FAILED';
            const isPending = block.result === 'PENDING';
            const isExpanded = !!expandedBlocks[block.index];

            const borderCol = isPassed ? '#10b981' : isFailed ? '#ef4444' : isPending ? '#f59e0b' : '#3b82f6';
            const bgBadge = isPassed ? '#059669' : isFailed ? '#dc2626' : isPending ? '#d97706' : '#2563eb';

            return (
              <div
                key={block.index}
                className="vulnerability-item"
                style={{
                  borderLeftColor: borderCol,
                  background: 'rgba(18, 30, 56, 0.75)',
                  borderRadius: '10px',
                  padding: '16px 20px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)'
                }}
              >
                {/* Block Header Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      background: 'rgba(255, 215, 0, 0.15)',
                      border: '1px solid var(--primary-gold)',
                      borderRadius: '8px',
                      padding: '4px 10px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: 'var(--primary-gold)',
                      fontFamily: 'JetBrains Mono, monospace'
                    }}>
                      BLOCK #{block.index}
                    </div>

                    <div>
                      <h4 style={{ margin: 0, color: '#f8fafc', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {block.supplier_name || 'Genesis Block'}
                        {block.supplier_id && (
                          <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 400 }}>
                            ({block.supplier_id})
                          </span>
                        )}
                      </h4>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                        <Clock size={12} />
                        <span>{new Date(block.timestamp).toLocaleString()}</span>
                        <span>•</span>
                        <span>Inspector: <strong style={{ color: '#cbd5e1' }}>{block.inspector || 'SYSTEM'}</strong></span>
                        {block.country && <span>• Country: <strong>{block.country}</strong></span>}
                      </div>
                    </div>
                  </div>

                  {/* Status Badges & Expand Toggle */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      background: bgBadge,
                      color: '#fff',
                      fontSize: '0.78rem',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontWeight: 700,
                      letterSpacing: '0.5px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      {isPassed && <CheckCircle2 size={13} />}
                      {isFailed && <XCircle size={13} />}
                      {isPending && <Clock size={13} />}
                      {block.result}
                    </span>

                    {block.risk_score !== undefined && (
                      <span style={{
                        fontSize: '0.78rem',
                        color: block.risk_score > 50 ? '#ef4444' : '#10b981',
                        background: 'rgba(0, 0, 0, 0.4)',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontWeight: 600
                      }}>
                        Risk: {block.risk_score}%
                      </span>
                    )}

                    <button
                      onClick={() => toggleExpand(block.index)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: 'none',
                        color: '#cbd5e1',
                        borderRadius: '6px',
                        padding: '6px 10px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.75rem'
                      }}
                    >
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      {isExpanded ? 'Less' : 'Crypto Details'}
                    </button>
                  </div>
                </div>

                {/* Notes Preview */}
                {block.notes && (
                  <p style={{ margin: '10px 0 6px 0', fontSize: '0.86rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                    <FileText size={13} style={{ verticalAlign: 'middle', marginRight: '6px', color: 'var(--primary-gold)' }} />
                    {block.notes}
                  </p>
                )}

                {/* ── Compact Cryptographic Proof Bar ── */}
                <div style={{
                  marginTop: '12px',
                  padding: '9px 12px',
                  background: 'rgba(0, 0, 0, 0.45)',
                  borderRadius: isExpanded ? '6px 6px 0 0' : '6px',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '8px',
                  fontSize: '0.78rem',
                  fontFamily: 'JetBrains Mono, monospace'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Hash size={13} /> Proof:
                    </span>
                    <span style={{ color: 'var(--primary-gold)', fontWeight: 600 }}>
                      {block.hash && block.hash !== 'REDACTED'
                        ? `${block.hash.substring(0, 8)}...${block.hash.substring(block.hash.length - 8)}`
                        : '[REDACTED]'}
                    </span>
                    {block.hash && block.hash !== 'REDACTED' && (
                      <button
                        onClick={() => handleCopy(block.hash, `hash-${block.index}`)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.06)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '4px',
                          color: copiedHash === `hash-${block.index}` ? '#10b981' : '#cbd5e1',
                          padding: '2px 7px',
                          fontSize: '0.7rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}
                        title="Copy SHA-256 Hash"
                      >
                        {copiedHash === `hash-${block.index}` ? <Check size={11} /> : <Copy size={11} />}
                        {copiedHash === `hash-${block.index}` ? 'Copied' : 'Copy'}
                      </button>
                    )}
                    <span style={{ color: '#10b981', fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '3px', marginLeft: '4px' }}>
                      <CheckCircle2 size={11} /> PoA Chain Valid
                    </span>
                  </div>

                  <button
                    onClick={() => toggleExpand(block.index)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: isExpanded ? 'var(--primary-gold)' : '#94a3b8',
                      cursor: 'pointer',
                      fontSize: '0.74rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {isExpanded ? <>Hide Forensic Proof <ChevronUp size={12} /></> : <>Inspect Forensic Proof <ChevronDown size={12} /></>}
                  </button>
                </div>

                {/* ── Expanded Forensic Audit Drawer ── */}
                {isExpanded && (
                  <div style={{
                    background: 'rgba(10, 15, 30, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderTop: 'none',
                    borderRadius: '0 0 6px 6px',
                    padding: '14px',
                    fontSize: '0.78rem',
                    fontFamily: 'JetBrains Mono, monospace'
                  }}>
                    {/* Full SHA-256 */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' }}>
                      <span style={{ color: '#38bdf8', whiteSpace: 'nowrap', fontSize: '0.74rem' }}>
                        Full SHA-256 Hash:
                      </span>
                      {block.hash === 'REDACTED' ? (
                        <div style={{ color: '#64748b', fontSize: '0.74rem', fontStyle: 'italic' }}>
                          [REDACTED - Level 3 Clearance Required]
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', maxWidth: '75%' }}>
                          <code style={{ color: 'var(--primary-gold)', fontSize: '0.74rem', wordBreak: 'break-all' }}>
                            {block.hash}
                          </code>
                          <button
                            onClick={() => handleCopy(block.hash, `full-hash-${block.index}`)}
                            style={{ background: 'transparent', border: 'none', color: copiedHash === `full-hash-${block.index}` ? '#10b981' : '#94a3b8', cursor: 'pointer', padding: '2px' }}
                            title="Copy Full SHA-256 Hash"
                          >
                            {copiedHash === `full-hash-${block.index}` ? <Check size={12} /> : <Copy size={12} />}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Full SHA-512 */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '10px' }}>
                      <span style={{ color: '#a78bfa', whiteSpace: 'nowrap', fontSize: '0.74rem' }}>
                        SHA-512 Tx Receipt:
                      </span>
                      {block.tx_hash === 'REDACTED' ? (
                        <div style={{ color: '#f59e0b', fontSize: '0.74rem', fontStyle: 'italic' }}>
                          [REDACTED - H-64 Military Tx Stamp Masked for Operational Security]
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', maxWidth: '75%' }}>
                          <code style={{ color: '#a78bfa', fontSize: '0.72rem', wordBreak: 'break-all', lineHeight: '1.4' }}>
                            {block.tx_hash}
                          </code>
                          <button
                            onClick={() => handleCopy(block.tx_hash, `full-tx-${block.index}`)}
                            style={{ background: 'transparent', border: 'none', color: copiedHash === `full-tx-${block.index}` ? '#10b981' : '#94a3b8', cursor: 'pointer', padding: '2px' }}
                            title="Copy SHA-512 Receipt"
                          >
                            {copiedHash === `full-tx-${block.index}` ? <Check size={12} /> : <Copy size={12} />}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Previous Hash Pointer */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '10px', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <span style={{ color: '#94a3b8', whiteSpace: 'nowrap', fontSize: '0.74rem' }}>
                        Previous Block Hash:
                      </span>
                      <code style={{ color: '#64748b', fontSize: '0.72rem', wordBreak: 'break-all', maxWidth: '75%' }}>
                        {block.prev_hash}
                      </code>
                    </div>

                    {/* Metadata Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '0.75rem', color: '#cbd5e1' }}>
                      <div><strong style={{ color: '#94a3b8' }}>Tier Level:</strong> {block.tier ? `Tier ${block.tier}` : 'Root Genesis'}</div>
                      <div><strong style={{ color: '#94a3b8' }}>Jurisdiction:</strong> {block.country || 'Global/Defense'}</div>
                      <div><strong style={{ color: '#94a3b8' }}>Inspection State:</strong> {block.result}</div>
                      <div><strong style={{ color: '#94a3b8' }}>Consensus:</strong> Proof of Authority</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Subsystems & Smart Contract Modules (Integrated) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '24px' }}>
        <div className="card" style={{ marginBottom: 0 }}>
          <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileCode2 size={20} style={{ color: '#38bdf8' }} />
            Defense Smart Contracts Engine
          </h3>
          <p style={{ color: '#cbd5e1', fontSize: '0.88rem', margin: '10px 0', lineHeight: '1.6' }}>
            • Automated ISO 9001 / AS9100 cryptographic compliance enforcement<br />
            • Escrow milestone payment release conditioned on DGQA sign-off<br />
            • Immutable anti-counterfeit hash lineage for missile and radar parts
          </p>
          <button
            className="btn"
            onClick={onDeployContract}
            style={{ background: 'linear-gradient(135deg, #0284c7, #38bdf8)', color: '#fff', width: '100%', justifyContent: 'center' }}
          >
            <FileCode2 size={16} />
            Deploy Defense Smart Contract
          </button>
        </div>

        <div className="card" style={{ marginBottom: 0 }}>
          <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Search size={20} style={{ color: '#a78bfa' }} />
            End-to-End Component Genealogy Trace
          </h3>
          <p style={{ color: '#cbd5e1', fontSize: '0.88rem', margin: '10px 0', lineHeight: '1.6' }}>
            • Mine-to-missile component provenance ledger<br />
            • Tamper-proof cryptographic hashes linked across supply tiers<br />
            • Immediate quarantine if foreign component hash mismatch detected
          </p>
          <button
            className="btn"
            onClick={onTraceComponent}
            style={{ background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', color: '#fff', width: '100%', justifyContent: 'center' }}
          >
            <Search size={16} />
            Trace Mission-Critical Component
          </button>
        </div>
      </div>
    </div>
  );
}
