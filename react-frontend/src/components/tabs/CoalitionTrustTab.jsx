import React, { useState, useEffect, useRef } from 'react';
import {
  Globe,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Hash,
  Search,
  Zap,
  Eye,
  EyeOff,
  ArrowRight,
  Activity,
  Flag,
  Users,
  Link2,
  RefreshCw,
  Info
} from 'lucide-react';

// ─── Static simulation data ───────────────────────────────────────────────────

const SHARED_LEDGER_ITEMS = [
  {
    id: 'ITEM-IN-001',
    name: 'BrahMos Guidance Module',
    verifiedBy: 'India',
    inspector: 'Col. Arjun Mehta (DGQA)',
    result: 'PASSED',
    riskScore: 12,
    riskLevel: 'LOW',
    hash: 'a3f9c12e7b4d8f1e2c5a9b3d6e0f4a7c',
    internalSuppliers: '[CLASSIFIED — Sovereign Data: India]',
    timestamp: '2026-09-18T06:12:44Z',
    tier: 1
  },
  {
    id: 'ITEM-RU-001',
    name: 'Iskander ECM Component',
    verifiedBy: 'Russia',
    inspector: 'Polkovnik V. Sokolov (VKS)',
    result: 'PASSED',
    riskScore: 28,
    riskLevel: 'LOW',
    hash: '7d2b5e8f1a4c9d3e6b0f5a2c8e1d4b7f',
    internalSuppliers: '[CLASSIFIED — Sovereign Data: Russia]',
    timestamp: '2026-09-18T07:45:11Z',
    tier: 1
  },
  {
    id: 'ITEM-IN-002',
    name: 'Radar Transceiver Array',
    verifiedBy: 'India',
    inspector: 'Wg. Cdr. Priya Nair (IAF)',
    result: 'PASSED',
    riskScore: 19,
    riskLevel: 'LOW',
    hash: 'c8e3a1f6d9b4e7c2a5f8b1d4e7c0a3f6',
    internalSuppliers: '[CLASSIFIED — Sovereign Data: India]',
    timestamp: '2026-09-18T08:30:22Z',
    tier: 2
  },
  {
    id: 'ITEM-RU-002',
    name: 'T-90 Suspension Actuator',
    verifiedBy: 'Russia',
    inspector: 'Polkovnik V. Sokolov (VKS)',
    result: 'PENDING',
    riskScore: 61,
    riskLevel: 'MEDIUM',
    hash: '2f5a8c1e4b7d0f3a6c9e2b5f8a1d4e7c',
    internalSuppliers: '[CLASSIFIED — Sovereign Data: Russia]',
    timestamp: '2026-09-18T09:15:03Z',
    tier: 2
  },
  {
    id: 'ITEM-IN-003',
    name: 'Portable Field Generator Unit',
    verifiedBy: 'India',
    inspector: 'Col. Arjun Mehta (DGQA)',
    result: 'PASSED',
    riskScore: 9,
    riskLevel: 'LOW',
    hash: 'e1d4b7f0a3c6e9b2d5f8a1c4e7b0d3f6',
    internalSuppliers: '[CLASSIFIED — Sovereign Data: India]',
    timestamp: '2026-09-18T10:05:55Z',
    tier: 3
  },
  {
    id: 'ITEM-RU-003',
    name: 'Encrypted Comms Module',
    verifiedBy: 'Russia',
    inspector: 'Kapitan A. Volkov (GRU)',
    result: 'FAILED',
    riskScore: 87,
    riskLevel: 'HIGH',
    hash: '9b2e5f8c1d4a7e0b3c6f9a2d5b8e1f4a',
    internalSuppliers: '[CLASSIFIED — Sovereign Data: Russia]',
    timestamp: '2026-09-18T11:22:17Z',
    tier: 2
  }
];

const FLOW_STEPS = [
  {
    step: 1,
    icon: '',
    title: 'Item / Component Identified',
    detail: 'A jointly-sourced spare part (T-90 Suspension Actuator, ITEM-RU-002) needs to move between camps or be cross-verified before field deployment.',
    india: 'Indian camp flags requirement for cross-border component verification.',
    russia: 'Russian camp initiates internal supply chain scan on their private ledger.',
    shared: 'Joint request logged on shared coalition coordination layer.'
  },
  {
    step: 2,
    icon: '',
    title: 'Each Side Runs LinkGuard Internally',
    detail: 'India and Russia each run their own LinkGuard instance on their private supplier networks — mapping tiers, predicting disruption risk, propagating impact. Neither sees the other\'s Tier-2/3/4 vendor list.',
    india: 'India maps 4 internal tiers for radar and power components. Full visibility within own ledger.',
    russia: 'Russia maps actuator supply chain: 3 Tier-1, 7 Tier-2, 12 Tier-3 suppliers — all classified.',
    shared: 'No raw data is pushed yet. Only the computation runs internally.'
  },
  {
    step: 3,
    icon: '',
    title: 'VERIFY Output Written to Shared Layer',
    detail: 'Only the cryptographic proof layer is shared: a SHA-256 hash + risk score + pass/fail verdict. Raw supplier identities are never pushed. This is the zero-knowledge model.',
    india: 'India writes: ITEM-IN-002 ✅ | Risk: 19% LOW | Hash: c8e3a1f6...',
    russia: 'Russia writes: ITEM-RU-002 ⚠ | Risk: 61% MEDIUM | Hash: 2f5a8c1e...',
    shared: 'Shared ledger receives only hashes + risk scores. No vendor names, no full supplier maps.'
  },
  {
    step: 4,
    icon: '',
    title: 'Other Camp Queries Shared Ledger',
    detail: 'Indian officers query the shared ledger: "Is ITEM-RU-002 verified? What is its current risk status?" — without needing to know Russia\'s Tier-2 supplier is under geopolitical pressure.',
    india: 'Query: GET ITEM-RU-002 → Shared Layer responds instantly.',
    russia: 'Russia\'s internal network stays private. No data leak.',
    shared: 'Ledger returns: ⚠ PENDING | Risk: 61% MEDIUM | Last Inspector: Polkovnik V. Sokolov | Hash verified ✅'
  },
  {
    step: 5,
    icon: '⚡',
    title: 'AI Risk Propagation Across Border',
    detail: 'LinkGuard\'s AI detects that Russia\'s Tier-2 supplier for the actuator is under sanction pressure. Without exposing Russia\'s vendor map, the AI propagates a cascade risk flag to the Indian camp\'s shared dashboard.',
    india: ' ALERT: Shared component ITEM-RU-002 risk elevated from MEDIUM → HIGH. Recommend alternate sourcing.',
    russia: 'Russia\'s internal Tier-2 disruption triggers an automated risk score update on the shared ledger.',
    shared: 'Risk propagated without revealing the source supplier identity. Sovereignty preserved.'
  },
  {
    step: 6,
    icon: '️',
    title: 'Joint Logistics Decision — Human Command',
    detail: 'Human commanders on both sides review the shared ledger\'s cryptographically-verified status. They make the final joint logistics call: accept, flag, or escalate — with full audit trail and tamper-proof record.',
    india: 'Indian JFC Commander: "ITEM-RU-002 flagged HIGH — defer deployment, procure alternate via domestic Tier-1."',
    russia: 'Russian logistics officer: "Acknowledged. Alternate actuator batch ITEM-RU-002B en route — will re-verify."',
    shared: 'Joint decision recorded immutably on shared ledger. Full audit trail. No paper. No forgery possible.'
  }
];

const QUERY_MAP = {
  'item-in-001': SHARED_LEDGER_ITEMS[0],
  'item-ru-001': SHARED_LEDGER_ITEMS[1],
  'item-in-002': SHARED_LEDGER_ITEMS[2],
  'item-ru-002': SHARED_LEDGER_ITEMS[3],
  'item-in-003': SHARED_LEDGER_ITEMS[4],
  'item-ru-003': SHARED_LEDGER_ITEMS[5]
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function NationBadge({ nation }) {
  const isIndia = nation === 'India';
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      padding: '3px 10px',
      borderRadius: '20px',
      fontSize: '0.75rem',
      fontWeight: 700,
      background: isIndia ? 'rgba(255, 153, 51, 0.18)' : 'rgba(0, 57, 166, 0.25)',
      border: `1px solid ${isIndia ? '#ff9933' : '#0039a6'}`,
      color: isIndia ? '#ff9933' : '#4a9eff',
      letterSpacing: '0.4px'
    }}>
      {isIndia ? '' : ''} {nation}
    </span>
  );
}

function RiskBadge({ level, score }) {
  const colors = {
    LOW: { bg: '#059669', text: '#fff' },
    MEDIUM: { bg: '#d97706', text: '#fff' },
    HIGH: { bg: '#dc2626', text: '#fff' }
  };
  const c = colors[level] || colors.LOW;
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '3px 10px',
      borderRadius: '20px',
      fontSize: '0.75rem',
      fontWeight: 700,
      background: c.bg,
      color: c.text
    }}>
      {score}% {level}
    </span>
  );
}

function ResultBadge({ result }) {
  const map = {
    PASSED: { icon: <CheckCircle2 size={12} />, bg: '#059669', label: 'VERIFIED ✓' },
    PENDING: { icon: <AlertTriangle size={12} />, bg: '#d97706', label: 'PENDING ⚠' },
    FAILED:  { icon: <XCircle size={12} />, bg: '#dc2626', label: 'FAILED ✗' }
  };
  const m = map[result] || map.PASSED;
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '3px 12px',
      borderRadius: '20px',
      fontSize: '0.75rem',
      fontWeight: 700,
      background: m.bg,
      color: '#fff'
    }}>
      {m.icon} {m.label}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function CoalitionTrustTab({ onStartExecution }) {
  const [activeStep, setActiveStep]         = useState(null);
  const [queryInput, setQueryInput]         = useState('');
  const [queryResult, setQueryResult]       = useState(null);
  const [queryLoading, setQueryLoading]     = useState(false);
  const [showAlert, setShowAlert]           = useState(false);
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [showArchDiagram, setShowArchDiagram] = useState(true);
  const [showWhyFails, setShowWhyFails]     = useState(true);
  const [dataFlowActive, setDataFlowActive] = useState(false);
  const alertTimer = useRef(null);

  // Auto-trigger the Russian risk propagation alert after 4 seconds
  useEffect(() => {
    alertTimer.current = setTimeout(() => {
      if (!alertDismissed) setShowAlert(true);
    }, 4000);
    return () => clearTimeout(alertTimer.current);
  }, []);

  const handleQuery = () => {
    const key = queryInput.trim().toLowerCase();
    if (!key) return;
    setQueryLoading(true);
    setQueryResult(null);
    setTimeout(() => {
      const found = QUERY_MAP[key];
      setQueryResult(found || null);
      setQueryLoading(false);
    }, 1200);
  };

  const handleSimulateFlow = () => {
    setDataFlowActive(true);
    if (onStartExecution) {
      onStartExecution('SIMULATING PERMISSIONED BLOCKCHAIN DATA FLOW ACROSS COALITION BOUNDARY...', () => {
        setTimeout(() => setDataFlowActive(false), 2000);
      });
    } else {
      setTimeout(() => setDataFlowActive(false), 2000);
    }
  };

  const cardStyle = {
    background: 'rgba(18, 30, 56, 0.85)',
    border: '1px solid rgba(255, 215, 0, 0.18)',
    borderRadius: '12px',
    padding: '20px 24px',
    marginBottom: '22px',
    boxShadow: '0 8px 28px rgba(0,0,0,0.35)'
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="tab-content" style={{ animation: 'fadeIn 0.3s ease-in-out' }}>

      {/* ── Risk Propagation Alert (Auto-triggered) ── */}
      {showAlert && !alertDismissed && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '24px',
          zIndex: 9999,
          background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.97), rgba(153, 27, 27, 0.97))',
          border: '1px solid #ef4444',
          borderRadius: '12px',
          padding: '16px 20px',
          maxWidth: '380px',
          boxShadow: '0 12px 40px rgba(239, 68, 68, 0.4)',
          animation: 'fadeIn 0.4s ease'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <ShieldAlert size={18} style={{ color: '#fca5a5', flexShrink: 0 }} />
              <strong style={{ color: '#fff', fontSize: '0.95rem' }}>⚡ COALITION RISK ALERT</strong>
            </div>
            <button
              onClick={() => setAlertDismissed(true)}
              style={{ background: 'transparent', border: 'none', color: '#fca5a5', cursor: 'pointer', fontSize: '1.1rem', lineHeight: 1, flexShrink: 0 }}
            >✕</button>
          </div>
          <p style={{ margin: '0 0 6px 0', fontSize: '0.85rem', color: '#fecaca', lineHeight: 1.5 }}>
             <strong>Russian Tier-2 supplier disruption detected</strong> on ITEM-RU-002 (T-90 Suspension Actuator).
          </p>
          <p style={{ margin: '0 0 10px 0', fontSize: '0.82rem', color: '#fca5a5' }}>
            Risk propagated via shared ledger →  Indian camp flagged without exposing Russian vendor identity.
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span style={{ background: '#7f1d1d', color: '#fff', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
              MEDIUM → HIGH
            </span>
            <span style={{ background: 'rgba(255,255,255,0.1)', color: '#fca5a5', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem' }}>
              Sovereignty Preserved ✓
            </span>
          </div>
        </div>
      )}

      {/* ── Page Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 0, fontSize: '1.55rem' }}>
            <Globe size={28} style={{ color: '#a78bfa' }} />
            Coalition Supply Chain Trust Ledger
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '5px', marginBottom: 0 }}>
            Exercise INDRA Simulation — India  + Russia  Joint Logistics &amp; Cross-Border Blockchain Verification
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'rgba(167, 139, 250, 0.12)',
            border: '1px solid #a78bfa',
            padding: '7px 14px', borderRadius: '30px',
            fontSize: '0.82rem', fontWeight: 600, color: '#c4b5fd'
          }}>
            <Lock size={14} /> Permissioned Blockchain
          </span>
          <span style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid #10b981',
            padding: '7px 14px', borderRadius: '30px',
            fontSize: '0.82rem', fontWeight: 600, color: '#34d399'
          }}>
            <ShieldCheck size={14} /> Sovereignty Preserved
          </span>
        </div>
      </div>

      {/* ── Core Tension Banner ── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.12), rgba(167, 139, 250, 0.08))',
        border: '1px solid rgba(167, 139, 250, 0.35)',
        borderRadius: '12px',
        padding: '18px 24px',
        marginBottom: '22px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px'
      }}>
        <Info size={22} style={{ color: '#a78bfa', flexShrink: 0, marginTop: '2px' }} />
        <div>
          <h4 style={{ margin: '0 0 6px 0', color: '#c4b5fd', fontSize: '1rem' }}>The Core Tension — And Why It Matters</h4>
          <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.88rem', lineHeight: 1.65 }}>
            Two sovereign militaries need <strong style={{ color: 'var(--primary-gold)' }}>shared trust</strong> but neither wants
            full transparency into the other's sensitive supplier data. A red stamp from a Russian inspector
            means <em>nothing verifiable</em> to an Indian officer — and vice versa.
            A permissioned blockchain gives both sides a <strong style={{ color: '#a78bfa' }}>cryptographically-verifiable proof layer</strong>:
            share the <em>conclusion</em>, not the raw classified data.
          </p>
        </div>
      </div>

      {/* ── Architecture Diagram ── */}
      <div style={cardStyle}>
        <div
          onClick={() => setShowArchDiagram(v => !v)}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: showArchDiagram ? '20px' : 0 }}
        >
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-gold)', fontSize: '1.05rem' }}>
            <Link2 size={18} style={{ color: 'var(--primary-gold)' }} />
            Permissioned Blockchain Architecture — How the Trust Layer Works
          </h3>
          <button style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            {showArchDiagram ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>

        {showArchDiagram && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '0', alignItems: 'stretch' }}>

              {/* India Private Ledger */}
              <div style={{
                background: 'linear-gradient(160deg, rgba(255, 153, 51, 0.1), rgba(19, 136, 8, 0.08))',
                border: '2px solid rgba(255, 153, 51, 0.4)',
                borderRadius: '12px 0 0 12px',
                padding: '20px',
                borderRight: 'none'
              }}>
                <div style={{ textAlign: 'center', marginBottom: '14px' }}>
                  <div style={{ fontSize: '2.2rem', marginBottom: '4px' }}></div>
                  <h4 style={{ margin: 0, color: '#ff9933', fontSize: '0.95rem', fontWeight: 700 }}>INDIAN CAMP</h4>
                  <p style={{ margin: '3px 0 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>Private Supplier Ledger</p>
                </div>
                <div style={{
                  background: 'rgba(255, 153, 51, 0.08)',
                  border: '1px dashed rgba(255, 153, 51, 0.35)',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '0.78rem',
                  color: '#cbd5e1',
                  lineHeight: 1.7
                }}>
                  <div style={{ fontWeight: 700, color: '#ff9933', marginBottom: '6px', fontSize: '0.8rem' }}>Full Tier Visibility (India Only):</div>
                  <div>• Bharat Dynamics — Tier 1</div>
                  <div>• HAL Avionics Ltd — Tier 2</div>
                  <div>• Tata Advanced Sys — Tier 3</div>
                  <div>• DRDO Raw Materials — Tier 4</div>
                  <div style={{ marginTop: '8px', padding: '6px 8px', background: 'rgba(255, 153, 51, 0.15)', borderRadius: '6px', color: '#ff9933', fontWeight: 600, fontSize: '0.75rem' }}>
                     Visible ONLY to India
                  </div>
                </div>
                <div style={{ marginTop: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
                    ↓ Only VERIFY output pushed ↓
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>
                    Hash + Risk Score + Pass/Fail
                  </div>
                </div>
              </div>

              {/* Shared Layer */}
              <div style={{
                background: 'linear-gradient(180deg, rgba(124, 58, 237, 0.2), rgba(167, 139, 250, 0.12))',
                border: '2px solid rgba(167, 139, 250, 0.5)',
                padding: '20px 16px',
                minWidth: '220px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'relative'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.8rem', marginBottom: '4px' }}>⛓️</div>
                  <h4 style={{ margin: 0, color: '#a78bfa', fontSize: '0.92rem', fontWeight: 700 }}>SHARED PERMISSIONED</h4>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.72rem', color: '#c4b5fd' }}>BLOCKCHAIN LAYER</p>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.7rem', color: '#64748b' }}>Joint Trust Ledger</p>
                </div>

                <div style={{
                  background: 'rgba(10, 15, 30, 0.6)',
                  border: '1px solid rgba(167, 139, 250, 0.3)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  width: '100%',
                  fontSize: '0.75rem',
                  color: '#cbd5e1',
                  lineHeight: 1.8,
                  margin: '14px 0'
                }}>
                  <div style={{ color: '#10b981', fontWeight: 600, marginBottom: '4px' }}>Both sides can verify:</div>
                  <div>✅ Item was inspected</div>
                  <div>✅ Record not altered</div>
                  <div>✅ Current risk status</div>
                  <div style={{ marginTop: '8px', color: '#ef4444', fontWeight: 600 }}>Neither side sees:</div>
                  <div>❌ Other's vendor list</div>
                  <div>❌ Tier-2/3 identities</div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.72rem', color: '#a78bfa', fontWeight: 600 }}>↓ Joint Logistics Decision ↓</div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>Accept / Flag / Escalate</div>
                </div>
              </div>

              {/* Russia Private Ledger */}
              <div style={{
                background: 'linear-gradient(160deg, rgba(0, 57, 166, 0.12), rgba(37, 99, 235, 0.08))',
                border: '2px solid rgba(74, 158, 255, 0.4)',
                borderRadius: '0 12px 12px 0',
                padding: '20px',
                borderLeft: 'none'
              }}>
                <div style={{ textAlign: 'center', marginBottom: '14px' }}>
                  <div style={{ fontSize: '2.2rem', marginBottom: '4px' }}></div>
                  <h4 style={{ margin: 0, color: '#4a9eff', fontSize: '0.95rem', fontWeight: 700 }}>RUSSIAN CAMP</h4>
                  <p style={{ margin: '3px 0 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>Private Supplier Ledger</p>
                </div>
                <div style={{
                  background: 'rgba(74, 158, 255, 0.08)',
                  border: '1px dashed rgba(74, 158, 255, 0.35)',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '0.78rem',
                  color: '#cbd5e1',
                  lineHeight: 1.7
                }}>
                  <div style={{ fontWeight: 700, color: '#4a9eff', marginBottom: '6px', fontSize: '0.8rem' }}>Full Tier Visibility (Russia Only):</div>
                  <div>• Uralvagonzavod Corp — Tier 1</div>
                  <div>• Radioelektronika — Tier 2</div>
                  <div>• Rostec Precision — Tier 3</div>
                  <div>• Siberian Alloys Ltd — Tier 4</div>
                  <div style={{ marginTop: '8px', padding: '6px 8px', background: 'rgba(74, 158, 255, 0.15)', borderRadius: '6px', color: '#4a9eff', fontWeight: 600, fontSize: '0.75rem' }}>
                     Visible ONLY to Russia
                  </div>
                </div>
                <div style={{ marginTop: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
                    ↓ Only VERIFY output pushed ↓
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>
                    Hash + Risk Score + Pass/Fail
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <button
                className="btn"
                onClick={handleSimulateFlow}
                style={{
                  background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
                  color: '#fff',
                  fontWeight: 700,
                  padding: '10px 24px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Activity size={16} />
                {dataFlowActive ? 'Simulating Data Flow...' : 'Simulate Coalition Data Flow'}
              </button>
            </div>
          </>
        )}
      </div>

      {/* ── Why Red Stamp Fails Here ── */}
      <div style={cardStyle}>
        <div
          onClick={() => setShowWhyFails(v => !v)}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: showWhyFails ? '16px' : 0 }}
        >
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', fontSize: '1.05rem' }}>
            <XCircle size={18} style={{ color: '#ef4444' }} />
            Why the Red-Stamp Model Completely Fails Internationally
          </h3>
          <button style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            {showWhyFails ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
        {showWhyFails && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
            {[
              {
                title: '1. Zero Cross-Border Verifiability',
                body: 'A red stamp from a Russian inspector means nothing verifiable to an Indian officer. No way to independently confirm it wasn\'t forged, no shared record, no traceability of who stamped it or when.'
              },
              {
                title: '2. Language, Format & Chain-of-Custody Breakdown',
                body: 'Paper records don\'t cross borders — language, format, and chain-of-custody all break down. There is no shared internal audit authority between two sovereign militaries to fall back on.'
              },
              {
                title: '3. Complete Black Box Across the Border',
                body: 'Neither side can audit the other\'s Tier-2/3/4 suppliers at all. It\'s a complete black box. Any disruption, counterfeit part, or sanction cascades silently — until a field failure reveals it.'
              }
            ].map((item, i) => (
              <div key={i} style={{
                background: 'rgba(239, 68, 68, 0.07)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                padding: '14px'
              }}>
                <h5 style={{ margin: '0 0 8px 0', color: '#f87171', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <XCircle size={14} /> {item.title}
                </h5>
                <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.82rem', lineHeight: 1.6 }}>{item.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── How LinkGuard Solves It ── */}
      <div style={{ ...cardStyle, borderColor: 'rgba(16, 185, 129, 0.3)' }}>
        <h3 style={{ margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontSize: '1.05rem' }}>
          <ShieldCheck size={18} style={{ color: '#10b981' }} />
          How LinkGuard's Permissioned Blockchain Solves This — 4 Core Principles
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
          {[
            {
              icon: '',
              color: '#10b981',
              border: 'rgba(16, 185, 129, 0.3)',
              bg: 'rgba(16, 185, 129, 0.07)',
              title: 'Selective Trust, Not Blind Trust',
              body: 'India doesn\'t need Russia\'s full Tier-3 vendor list. It only needs a cryptographically-verifiable "yes, this was checked, here\'s the risk status" — a zero-knowledge-style confirmation, not full data exposure.'
            },
            {
              icon: '',
              color: '#38bdf8',
              border: 'rgba(56, 189, 248, 0.3)',
              bg: 'rgba(56, 189, 248, 0.07)',
              title: 'Tamper-Proof Across a Trust Gap',
              body: 'Two nations with different systems, standards, and languages need a shared immutable ledger more than any single-nation setup. There\'s no shared internal audit authority — the blockchain IS the authority.'
            },
            {
              icon: '⚡',
              color: '#f59e0b',
              border: 'rgba(245, 158, 11, 0.3)',
              bg: 'rgba(245, 158, 11, 0.07)',
              title: 'Risk Propagation Across Borders',
              body: 'If a Russian Tier-2 supplier shows high disruption risk (sanctions, conflict, plant shutdown), LinkGuard\'s AI can flag cascade risk to the Indian camp — without India needing to see Russia\'s full vendor map.'
            },
            {
              icon: '️',
              color: '#a78bfa',
              border: 'rgba(167, 139, 250, 0.3)',
              bg: 'rgba(167, 139, 250, 0.07)',
              title: 'Sovereignty Preserved, Interoperability Gained',
              body: 'Each side keeps full control of their private data. Only the "proof layer" is shared. This is the actual real-world model militaries use for coalition logistics — share the conclusion, not the raw classified data.'
            }
          ].map((item, i) => (
            <div key={i} style={{ background: item.bg, border: `1px solid ${item.border}`, borderRadius: '8px', padding: '14px' }}>
              <h5 style={{ margin: '0 0 8px 0', color: item.color, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '1.1rem' }}>{item.icon}</span> {item.title}
              </h5>
              <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.82rem', lineHeight: 1.6 }}>{item.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Interactive 6-Step Flow ── */}
      <div style={cardStyle}>
        <h3 style={{ margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-gold)', fontSize: '1.05rem' }}>
          <Zap size={18} style={{ color: 'var(--primary-gold)' }} />
          Step-by-Step Coalition Logistics Flow — Click Any Step to Expand
        </h3>
        <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '0 0 18px 0' }}>
          Trace exactly what happens — from item identification to joint command decision.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {FLOW_STEPS.map((step) => {
            const isActive = activeStep === step.step;
            return (
              <div key={step.step}>
                <div
                  onClick={() => setActiveStep(isActive ? null : step.step)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '14px 18px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    background: isActive
                      ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(167, 139, 250, 0.12))'
                      : 'rgba(10, 15, 30, 0.5)',
                    border: `1px solid ${isActive ? 'rgba(167, 139, 250, 0.5)' : 'rgba(255, 255, 255, 0.06)'}`,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isActive ? '#7c3aed' : 'rgba(255, 215, 0, 0.12)',
                    border: `2px solid ${isActive ? '#a78bfa' : 'var(--primary-gold)'}`,
                    fontSize: '0.8rem', fontWeight: 700,
                    color: isActive ? '#fff' : 'var(--primary-gold)',
                    fontFamily: 'JetBrains Mono, monospace'
                  }}>
                    {step.step}
                  </div>
                  <div style={{ fontSize: '1.2rem', flexShrink: 0 }}>{step.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: isActive ? '#c4b5fd' : '#f8fafc', fontSize: '0.95rem' }}>
                      {step.title}
                    </div>
                  </div>
                  {isActive ? <ChevronUp size={16} style={{ color: '#a78bfa', flexShrink: 0 }} /> : <ChevronRight size={16} style={{ color: '#64748b', flexShrink: 0 }} />}
                </div>

                {isActive && (
                  <div style={{
                    background: 'rgba(10, 15, 30, 0.5)',
                    border: '1px solid rgba(167, 139, 250, 0.25)',
                    borderTop: 'none',
                    borderRadius: '0 0 10px 10px',
                    padding: '16px 20px',
                    animation: 'fadeIn 0.25s ease'
                  }}>
                    <p style={{ margin: '0 0 14px 0', color: '#cbd5e1', fontSize: '0.86rem', lineHeight: 1.65 }}>
                      {step.detail}
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                      <div style={{ background: 'rgba(255, 153, 51, 0.08)', border: '1px solid rgba(255, 153, 51, 0.3)', borderRadius: '8px', padding: '10px 12px' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#ff9933', marginBottom: '4px' }}> INDIA</div>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.5 }}>{step.india}</p>
                      </div>
                      <div style={{ background: 'rgba(167, 139, 250, 0.08)', border: '1px solid rgba(167, 139, 250, 0.3)', borderRadius: '8px', padding: '10px 12px' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#a78bfa', marginBottom: '4px' }}>⛓️ SHARED LAYER</div>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.5 }}>{step.shared}</p>
                      </div>
                      <div style={{ background: 'rgba(74, 158, 255, 0.08)', border: '1px solid rgba(74, 158, 255, 0.3)', borderRadius: '8px', padding: '10px 12px' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#4a9eff', marginBottom: '4px' }}> RUSSIA</div>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.5 }}>{step.russia}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Shared Ledger Table ── */}
      <div style={cardStyle}>
        <h3 style={{ margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-gold)', fontSize: '1.05rem' }}>
          <Hash size={18} style={{ color: 'var(--primary-gold)' }} />
          Live Shared Permissioned Ledger — Joint Trust Records
        </h3>
        <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '0 0 16px 0' }}>
          Both camps see: Item ID, inspector, risk level, cryptographic hash, and pass/fail verdict. Internal supplier lists are sovereign-classified on each side.
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 215, 0, 0.25)' }}>
                {['Item ID', 'Name', 'Verified By', 'Inspector', 'Internal Suppliers', 'Risk', 'Status', 'SHA-256 Hash'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: '#94a3b8', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.4px', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SHARED_LEDGER_ITEMS.map((item, i) => (
                <tr key={item.id} style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                  background: i % 2 === 0 ? 'rgba(10, 15, 30, 0.3)' : 'transparent',
                  transition: 'background 0.15s'
                }}>
                  <td style={{ padding: '10px 12px', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: 'var(--primary-gold)', whiteSpace: 'nowrap' }}>
                    {item.id}
                  </td>
                  <td style={{ padding: '10px 12px', color: '#f8fafc', fontWeight: 600, whiteSpace: 'nowrap', maxWidth: '170px' }}>
                    {item.name}
                  </td>
                  <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                    <NationBadge nation={item.verifiedBy} />
                  </td>
                  <td style={{ padding: '10px 12px', color: '#94a3b8', fontSize: '0.77rem', whiteSpace: 'nowrap' }}>
                    {item.inspector}
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '4px',
                      fontSize: '0.72rem', color: '#64748b',
                      background: 'rgba(10, 15, 30, 0.6)', padding: '3px 8px',
                      borderRadius: '4px', fontFamily: 'JetBrains Mono, monospace',
                      whiteSpace: 'nowrap'
                    }}>
                      <Lock size={10} /> {item.internalSuppliers}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                    <RiskBadge level={item.riskLevel} score={item.riskScore} />
                  </td>
                  <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                    <ResultBadge result={item.result} />
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <code style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '0.7rem',
                      color: '#a78bfa',
                      background: 'rgba(0,0,0,0.4)',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      {item.hash.slice(0, 16)}...
                    </code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Coalition Query Panel ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px', marginBottom: '22px' }}>

        <div style={{ ...cardStyle, marginBottom: 0 }}>
          <h3 style={{ margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontSize: '1.05rem' }}>
            <Search size={18} style={{ color: '#38bdf8' }} />
            Coalition Query — Verify Without Exposing Internals
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '0 0 16px 0' }}>
            Enter an Item ID to query the shared ledger. You get cryptographic proof — not the other side's supplier list.
          </p>
          <p style={{ color: '#475569', fontSize: '0.75rem', margin: '0 0 12px 0' }}>
            Try: <code style={{ color: '#a78bfa' }}>ITEM-IN-001</code>, <code style={{ color: '#a78bfa' }}>ITEM-RU-002</code>, <code style={{ color: '#a78bfa' }}>ITEM-RU-003</code>
          </p>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                value={queryInput}
                onChange={e => setQueryInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleQuery()}
                placeholder="e.g. ITEM-RU-002"
                style={{
                  width: '100%', padding: '9px 12px 9px 32px',
                  borderRadius: '8px',
                  background: 'rgba(10, 15, 30, 0.8)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  color: '#f8fafc', fontSize: '0.88rem',
                  fontFamily: 'JetBrains Mono, monospace'
                }}
              />
            </div>
            <button
              className="btn"
              onClick={handleQuery}
              disabled={queryLoading}
              style={{
                background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
                color: '#fff', fontWeight: 600,
                padding: '9px 18px',
                display: 'flex', alignItems: 'center', gap: '6px'
              }}
            >
              {queryLoading
                ? <><RefreshCw size={14} className="spin" /> Querying...</>
                : <><Search size={14} /> Query Ledger</>}
            </button>
          </div>

          {queryResult !== undefined && !queryLoading && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              {queryResult ? (
                <div style={{
                  background: queryResult.result === 'PASSED'
                    ? 'rgba(16, 185, 129, 0.1)'
                    : queryResult.result === 'FAILED'
                    ? 'rgba(239, 68, 68, 0.1)'
                    : 'rgba(245, 158, 11, 0.1)',
                  border: `1px solid ${queryResult.result === 'PASSED' ? '#10b981' : queryResult.result === 'FAILED' ? '#ef4444' : '#f59e0b'}`,
                  borderRadius: '10px',
                  padding: '14px 16px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.95rem' }}>{queryResult.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px', fontFamily: 'JetBrains Mono, monospace' }}>{queryResult.id}</div>
                    </div>
                    <ResultBadge result={queryResult.result} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.8rem' }}>
                    <div><span style={{ color: '#64748b' }}>Verified by:</span> <NationBadge nation={queryResult.verifiedBy} /></div>
                    <div><span style={{ color: '#64748b' }}>Risk:</span> <RiskBadge level={queryResult.riskLevel} score={queryResult.riskScore} /></div>
                    <div><span style={{ color: '#64748b' }}>Inspector:</span> <span style={{ color: '#cbd5e1' }}>{queryResult.inspector}</span></div>
                    <div><span style={{ color: '#64748b' }}>Tier:</span> <span style={{ color: 'var(--primary-gold)' }}>Tier {queryResult.tier}</span></div>
                  </div>
                  <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '4px' }}>Internal Suppliers (sovereign-classified):</div>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#475569', background: 'rgba(0,0,0,0.4)', padding: '3px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Lock size={11} /> {queryResult.internalSuppliers}
                    </span>
                  </div>
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '4px' }}>Cryptographic Proof (SHA-256):</div>
                    <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#a78bfa', background: 'rgba(0,0,0,0.5)', padding: '3px 8px', borderRadius: '4px', wordBreak: 'break-all' }}>
                      {queryResult.hash}
                    </code>
                  </div>
                </div>
              ) : (
                queryInput && (
                  <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '8px', padding: '12px', color: '#f87171', fontSize: '0.85rem' }}>
                    ❌ Item ID "<strong>{queryInput.toUpperCase()}</strong>" not found on the shared ledger. It may not have been verified yet, or may exist only on a private ledger.
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* Risk Propagation Scenario Panel */}
        <div style={{ ...cardStyle, marginBottom: 0, borderColor: 'rgba(239, 68, 68, 0.35)' }}>
          <h3 style={{ margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', fontSize: '1.05rem' }}>
            <AlertTriangle size={18} style={{ color: '#ef4444' }} />
            Risk Propagation Across Borders — Live Simulation
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '0 0 16px 0' }}>
            Russia's Tier-2 supplier disruption cascades to Indian camp via the shared ledger — without exposing any classified vendor data.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Russia internal (hidden) */}
            <div style={{ background: 'rgba(74, 158, 255, 0.08)', border: '1px solid rgba(74, 158, 255, 0.25)', borderRadius: '8px', padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.85rem' }}></span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4a9eff' }}>RUSSIA — Internal Private Ledger</span>
                <span style={{ fontSize: '0.68rem', color: '#475569', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <EyeOff size={10} /> Hidden from India
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>
                Radioelektronika JSC (Tier-2 supplier for ITEM-RU-002) placed under US sanctions — export restrictions enacted.
                Uralvagonzavod flags 61% disruption risk on actuator batch. Internal alert raised.
              </p>
            </div>

            {/* Arrow */}
            <div style={{ textAlign: 'center', color: '#a78bfa', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <ArrowRight size={14} />
              Only risk score update pushed to shared ledger (no vendor identity)
              <ArrowRight size={14} />
            </div>

            {/* Shared layer update */}
            <div style={{ background: 'rgba(167, 139, 250, 0.08)', border: '1px solid rgba(167, 139, 250, 0.3)', borderRadius: '8px', padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.85rem' }}>⛓️</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a78bfa' }}>SHARED LEDGER — Immutable Update</span>
              </div>
              <p style={{ margin: '0 0 8px 0', fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>
                Block appended: ITEM-RU-002 risk score updated 61% → 87%. Result: PENDING → escalated FAILED flag.
                Vendor identity: <code style={{ color: '#475569', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem' }}>[CLASSIFIED — Sovereign Data: Russia]</code>
              </p>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#64748b', background: 'rgba(0,0,0,0.4)', padding: '6px 10px', borderRadius: '4px' }}>
                hash: 9b2e5f8c1d4a7e0b3c6f9a2d5b8e1f4a | risk: 87 | result: FAILED | timestamp: 2026-09-18T11:22:17Z
              </div>
            </div>

            {/* Arrow */}
            <div style={{ textAlign: 'center', color: '#10b981', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <ArrowRight size={14} />
              Indian camp queries / receives alert
              <ArrowRight size={14} />
            </div>

            {/* India receives */}
            <div style={{ background: 'rgba(255, 153, 51, 0.08)', border: '1px solid rgba(255, 153, 51, 0.3)', borderRadius: '8px', padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.85rem' }}></span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ff9933' }}>INDIA — Action Taken</span>
                <span style={{ fontSize: '0.68rem', color: '#475569', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Eye size={10} /> Only proof layer seen
                </span>
              </div>
              <p style={{ margin: '0 0 8px 0', fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>
                Indian JFC Dashboard:  ITEM-RU-002 flagged HIGH. No Russian vendor data seen.
                Decision: defer deployment, initiate domestic Tier-1 alternate sourcing via Bharat Dynamics.
              </p>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <span style={{ background: '#7f1d1d', color: '#fff', padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700 }}>
                  ⚡ Risk Propagated
                </span>
                <span style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#34d399', padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 600 }}>
                  ✓ Sovereignty Preserved
                </span>
                <span style={{ background: 'rgba(167, 139, 250, 0.2)', border: '1px solid #a78bfa', color: '#c4b5fd', padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 600 }}>
                  ✓ No Vendor Leak
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Future Goals Note ── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(16, 185, 129, 0.08))',
        border: '1px solid rgba(167, 139, 250, 0.3)',
        borderRadius: '12px',
        padding: '18px 24px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px'
      }}>
        <Globe size={22} style={{ color: '#a78bfa', flexShrink: 0, marginTop: '2px' }} />
        <div>
          <h4 style={{ margin: '0 0 6px 0', color: '#c4b5fd', fontSize: '1rem' }}>
            Future Goals — Scaling to Multi-Nation Coalitions
          </h4>
          <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.86rem', lineHeight: 1.65 }}>
            The India–Russia scenario is a <strong style={{ color: 'var(--primary-gold)' }}>proof of concept for any bilateral or multilateral coalition</strong> —
            NATO logistics coordination, QUAD supply chain interoperability, BRICS joint procurement.
            The permissioned blockchain model scales: each nation maintains its own private shard, contributes
            only cryptographic proofs to the shared layer, and the joint trust ledger remains tamper-proof
            regardless of how many sovereign parties join.
            <strong style={{ color: '#a78bfa' }}> LinkGuard's architecture is built for this from day one.</strong>
          </p>
        </div>
      </div>

    </div>
  );
}
