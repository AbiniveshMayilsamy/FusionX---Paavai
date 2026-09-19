import React, { useState, useMemo } from 'react';
import { 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  ShieldCheck, 
  Truck, 
  Plane, 
  Ship, 
  Sliders, 
  ArrowRight, 
  Calendar,
  CheckCircle2,
  AlertOctagon,
  Sparkles,
  Zap
} from 'lucide-react';
import { ShinyText } from '../react-bits';

export function DelayPredictionTab({ onTriggerExecution }) {
  // Simulator Input Parameters
  const [leadTime, setLeadTime] = useState(35);
  const [reliability, setReliability] = useState(82);
  const [chokepointDelay, setChokepointDelay] = useState(6.0); // e.g. Bab-el-Mandeb / Red Sea bypass
  const [orderVolume, setOrderVolume] = useState(1200);
  const [tierDepth, setTierDepth] = useState(3);
  const [transportMode, setTransportMode] = useState('sea'); // 'sea' | 'air' | 'land'

  // Active in-flight defense shipments
  const [shipments, setShipments] = useState([
    {
      id: 'SHP-9021',
      material: 'AESA Radar Transceiver Modules',
      supplier: 'Precision Electronics Corp (Germany)',
      origin: 'Munich, Germany',
      destination: 'Central Strategic Depot (Bengaluru)',
      mode: 'Air',
      scheduledETA: '2026-09-24',
      baseLeadTime: 21,
      reliability: 0.92,
      riskScore: 0.22,
      routeChokepoint: 'None (Direct Air Cargo)',
      status: 'ON_TRACK',
      predictedDelay: 1.2,
      mitigated: false
    },
    {
      id: 'SHP-8840',
      material: 'Samarium-Cobalt Rare Earth Magnets',
      supplier: 'Mining Corp (Katanga, Congo)',
      origin: 'Kolwezi, Congo',
      destination: 'Indo-Pacific Buffer (Singapore)',
      mode: 'Maritime',
      scheduledETA: '2026-09-28',
      baseLeadTime: 45,
      reliability: 0.68,
      riskScore: 0.74,
      routeChokepoint: 'Bab-el-Mandeb Conflict Zone (+6.5d)',
      status: 'CRITICAL_DELAY',
      predictedDelay: 14.8,
      mitigated: false
    },
    {
      id: 'SHP-7712',
      material: 'Aerospace Titanium 6Al-4V Billets',
      supplier: 'Steel & Alloy Industries (India)',
      origin: 'Jamshedpur, India',
      destination: 'Central Strategic Depot (Bengaluru)',
      mode: 'Rail/Land',
      scheduledETA: '2026-09-22',
      baseLeadTime: 14,
      reliability: 0.94,
      riskScore: 0.18,
      routeChokepoint: 'None (Domestic Defense Corridor)',
      status: 'ON_TRACK',
      predictedDelay: 0.6,
      mitigated: false
    },
    {
      id: 'SHP-6530',
      material: 'Rad-Hardened GaN Microcontroller SOCs',
      supplier: 'Advanced Defense Systems (Taiwan/USA)',
      origin: 'Hsinchu, Taiwan',
      destination: 'North American Reserves (Fort Worth)',
      mode: 'Maritime',
      scheduledETA: '2026-10-02',
      baseLeadTime: 38,
      reliability: 0.84,
      riskScore: 0.52,
      routeChokepoint: 'Strait of Malacca Congestion (+3.0d)',
      status: 'MODERATE_DELAY',
      predictedDelay: 5.4,
      mitigated: false
    }
  ]);

  // Real Mathematical Prediction Model
  const prediction = useMemo(() => {
    const relNorm = reliability / 100.0;
    const modeMultiplier = transportMode === 'air' ? 0.35 : transportMode === 'land' ? 0.7 : 1.0;
    
    // Logistic probability of delay
    const z = (1.0 - relNorm) * 4.2 + (tierDepth * 0.45) + (chokepointDelay * 0.22) * modeMultiplier - 1.9;
    const probability = Math.min(97.5, Math.max(4.0, (1.0 / (1.0 + Math.exp(-z))) * 100));

    // Expected delay days formula
    const volumeFactor = Math.log10(Math.max(orderVolume, 10)) / 3.8;
    const rawDelay = (leadTime * (1.0 - relNorm) * 0.5) + (chokepointDelay * modeMultiplier) + (tierDepth * 1.6 * volumeFactor);
    const delayDays = Math.max(0.2, Math.round(rawDelay * 10) / 10);

    // 95% Confidence Interval (margin of error)
    const margin = Math.round((0.6 + delayDays * 0.16) * 10) / 10;
    const ciLower = Math.max(0, Math.round((delayDays - margin) * 10) / 10);
    const ciUpper = Math.round((delayDays + margin) * 10) / 10;

    // Severity rating
    let severity = 'LOW';
    let severityColor = '#10b981';
    let action = 'Shipment is within acceptable operational tolerance; depot buffer remains intact.';

    if (delayDays >= 12.0) {
      severity = 'CRITICAL PRODUCTION HALT';
      severityColor = '#ef4444';
      action = 'Critical assembly stoppage risk! Immediately dispatch priority military air cargo or draw from Indian Strategic Defense Reserves.';
    } else if (delayDays >= 6.0) {
      severity = 'HIGH LOGISTICS RISK';
      severityColor = '#f97316';
      action = 'Activate secondary regional warehouse buffer; issue early warning to defense assembly line.';
    } else if (delayDays >= 2.5) {
      severity = 'MODERATE DELAY';
      severityColor = '#f59e0b';
      action = 'Minor schedule slippage expected. Re-sequence sub-component installation in production queue.';
    }

    // Revised delivery date
    const today = new Date();
    const scheduledDate = new Date(today.getTime() + leadTime * 24 * 60 * 60 * 1000);
    const revisedDate = new Date(scheduledDate.getTime() + delayDays * 24 * 60 * 60 * 1000);

    return {
      probability: Math.round(probability * 10) / 10,
      delayDays,
      ciLower,
      ciUpper,
      margin,
      severity,
      severityColor,
      action,
      scheduledDateStr: scheduledDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      revisedDateStr: revisedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
  }, [leadTime, reliability, chokepointDelay, orderVolume, tierDepth, transportMode]);

  const handleMitigateShipment = (id, material) => {
    if (onTriggerExecution) {
      onTriggerExecution(`ACTIVATING EMERGENCY STRATEGIC AIRLIFT FOR ${material.toUpperCase()}...`, () => {
        setShipments(prev => prev.map(s => {
          if (s.id === id) {
            return {
              ...s,
              status: 'MITIGATED',
              mode: 'Air (C-17 Airlift)',
              predictedDelay: 1.1,
              mitigated: true,
              routeChokepoint: 'Bypassed via High-Altitude Defense Air Corridor'
            };
          }
          return s;
        }));
        alert(`Strategic Airlift dispatched for ${id}. Delay reduced to 1.1 days.`);
      });
    } else {
      setShipments(prev => prev.map(s => s.id === id ? { ...s, status: 'MITIGATED', predictedDelay: 1.1, mitigated: true } : s));
    }
  };

  return (
    <div className="tab-content">
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2>
          <Clock size={22} style={{ color: 'var(--primary-gold)' }} />
          Supplier Delay Prediction & Lead-Time Simulator
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.92rem', maxWidth: '850px' }}>
          Statistical regression & logistic delay forecasting engine. Integrates maritime chokepoints, historical reliability, multi-tier dependency depth, and shipment volume to predict arrival slippage with 95% confidence intervals.
        </p>
      </div>

      {/* Main Grid: Simulator on Left, Output & Telemetry on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) minmax(360px, 1.2fr)', gap: '24px', marginBottom: '32px' }}>
        
        {/* Left Column: Interactive Simulator Parameters */}
        <div style={{ background: 'rgba(14, 16, 22, 0.75)', border: '1px solid var(--glass-border)', padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', color: '#ffffff', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={18} style={{ color: 'var(--primary-gold)' }} />
            What-If Lead Time & Route Parameters
          </h3>

          {/* Lead Time Slider */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.88rem' }}>
              <span style={{ color: '#cbd5e1' }}>Scheduled Base Lead Time:</span>
              <strong style={{ color: 'var(--primary-gold)', fontFamily: 'var(--font-mono)' }}>{leadTime} Days</strong>
            </div>
            <input 
              type="range" 
              min="10" 
              max="90" 
              value={leadTime} 
              onChange={(e) => setLeadTime(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary-gold)' }}
            />
          </div>

          {/* Supplier Reliability Slider */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.88rem' }}>
              <span style={{ color: '#cbd5e1' }}>Supplier Historical Reliability:</span>
              <strong style={{ color: reliability > 85 ? '#10b981' : reliability > 70 ? '#f59e0b' : '#ef4444', fontFamily: 'var(--font-mono)' }}>
                {reliability}%
              </strong>
            </div>
            <input 
              type="range" 
              min="40" 
              max="99" 
              value={reliability} 
              onChange={(e) => setReliability(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: reliability > 85 ? '#10b981' : '#f59e0b' }}
            />
          </div>

          {/* Route Chokepoint Disruption Friction */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.88rem' }}>
              <span style={{ color: '#cbd5e1' }}>Maritime / Air Chokepoint Delay:</span>
              <strong style={{ color: chokepointDelay > 5 ? '#ef4444' : '#f59e0b', fontFamily: 'var(--font-mono)' }}>
                +{chokepointDelay} Days
              </strong>
            </div>
            <input 
              type="range" 
              min="0" 
              max="15" 
              step="0.5"
              value={chokepointDelay} 
              onChange={(e) => setChokepointDelay(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#ef4444' }}
            />
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
              (e.g., Red Sea / Bab-el-Mandeb bypass +6.5d, Suez Canal queue +4.0d, Malacca Strait +3.0d)
            </div>
          </div>

          {/* Order Volume */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.88rem' }}>
              <span style={{ color: '#cbd5e1' }}>Procurement Order Batch:</span>
              <strong style={{ color: '#ffffff', fontFamily: 'var(--font-mono)' }}>{orderVolume} Units</strong>
            </div>
            <input 
              type="range" 
              min="100" 
              max="5000" 
              step="100"
              value={orderVolume} 
              onChange={(e) => setOrderVolume(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary-gold)' }}
            />
          </div>

          {/* Tier Depth & Transport Mode */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Dependency Tier</label>
              <select 
                value={tierDepth}
                onChange={(e) => setTierDepth(parseInt(e.target.value))}
                style={{ width: '100%', background: '#0a0c10', border: '1px solid var(--glass-border)', color: '#ffffff', padding: '8px', fontSize: '0.85rem' }}
              >
                <option value="1">Tier 1 (Prime Direct)</option>
                <option value="2">Tier 2 (Modules)</option>
                <option value="3">Tier 3 (Components)</option>
                <option value="4">Tier 4 (Raw Mining)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Transport Mode</label>
              <select 
                value={transportMode}
                onChange={(e) => setTransportMode(e.target.value)}
                style={{ width: '100%', background: '#0a0c10', border: '1px solid var(--glass-border)', color: '#ffffff', padding: '8px', fontSize: '0.85rem' }}
              >
                <option value="sea">Maritime Sea Freight</option>
                <option value="air">Air Cargo Corridor</option>
                <option value="land">Secure Land Freight</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: Live Prediction Engine Output */}
        <div style={{ background: 'rgba(14, 16, 22, 0.75)', border: `1px solid ${prediction.severityColor}`, padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8' }}>
                Algorithmic Prediction Result
              </span>
              <div style={{
                background: `${prediction.severityColor}22`,
                border: `1px solid ${prediction.severityColor}`,
                color: prediction.severityColor,
                padding: '4px 10px',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.05em'
              }}>
                {prediction.severity}
              </div>
            </div>

            {/* Delay Days Big Counter */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', marginBottom: '16px' }}>
              <div style={{ fontSize: '3.2rem', fontWeight: 800, color: prediction.severityColor, fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                +{prediction.delayDays}
              </div>
              <div style={{ fontSize: '1.2rem', color: '#cbd5e1', fontWeight: 600 }}>
                Days Delay Forecast
              </div>
            </div>

            {/* 95% Confidence Interval */}
            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px 16px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                <span style={{ color: '#94a3b8' }}>95% Confidence Interval:</span>
                <strong style={{ color: 'var(--primary-gold)', fontFamily: 'var(--font-mono)' }}>
                  {prediction.ciLower}d &mdash; {prediction.ciUpper}d (&plusmn;{prediction.margin}d)
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: '#94a3b8' }}>Probability of Delay:</span>
                <strong style={{ color: prediction.probability > 60 ? '#ef4444' : '#10b981', fontFamily: 'var(--font-mono)' }}>
                  {prediction.probability}%
                </strong>
              </div>
            </div>

            {/* Delivery Timeline Comparison */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '10px', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '14px', border: '1px solid var(--glass-border)', marginBottom: '18px' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase' }}>Contractual ETA</div>
                <div style={{ fontSize: '0.95rem', color: '#ffffff', fontWeight: 600 }}>{prediction.scheduledDateStr}</div>
              </div>
              <ArrowRight size={18} style={{ color: prediction.severityColor }} />
              <div>
                <div style={{ fontSize: '0.72rem', color: prediction.severityColor, textTransform: 'uppercase' }}>Revised Arrival ETA</div>
                <div style={{ fontSize: '0.95rem', color: prediction.severityColor, fontWeight: 700 }}>{prediction.revisedDateStr}</div>
              </div>
            </div>

            {/* Defense Directive Recommendation */}
            <div style={{ padding: '14px', background: `${prediction.severityColor}12`, borderLeft: `3px solid ${prediction.severityColor}`, fontSize: '0.85rem' }}>
              <div style={{ fontWeight: 700, color: prediction.severityColor, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Zap size={15} /> Automated Defense Mitigation Directive:
              </div>
              <div style={{ color: '#cbd5e1' }}>
                {prediction.action}
              </div>
            </div>
          </div>

          <div style={{ fontSize: '0.75rem', color: '#64748b', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px', marginTop: '16px' }}>
            Model Engine: LinkGuard Defense Logistic-Sigmoidal Predictor v2.4 &bull; Synchronized with Central Inventory Buffer
          </div>
        </div>
      </div>

      {/* Active In-Flight Shipments Monitoring Table */}
      <div style={{ background: 'rgba(14, 16, 22, 0.75)', border: '1px solid var(--glass-border)', padding: '24px' }}>
        <h3 style={{ fontSize: '1.05rem', color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Truck size={18} style={{ color: 'var(--primary-gold)' }} />
          Active In-Flight Defense Shipments & Delay Tracking
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>
                <th style={{ padding: '12px 10px' }}>Shipment ID</th>
                <th style={{ padding: '12px 10px' }}>Component / Material</th>
                <th style={{ padding: '12px 10px' }}>Origin &rarr; Destination</th>
                <th style={{ padding: '12px 10px' }}>Mode</th>
                <th style={{ padding: '12px 10px' }}>Chokepoint Friction</th>
                <th style={{ padding: '12px 10px' }}>Predicted Delay</th>
                <th style={{ padding: '12px 10px' }}>Status</th>
                <th style={{ padding: '12px 10px', textAlign: 'right' }}>Mitigation Action</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map(s => {
                const statusColor = s.status === 'MITIGATED' ? '#10b981' :
                                    s.status === 'CRITICAL_DELAY' ? '#ef4444' :
                                    s.status === 'MODERATE_DELAY' ? '#f59e0b' : '#10b981';

                return (
                  <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: s.status === 'CRITICAL_DELAY' ? 'rgba(239,68,68,0.04)' : 'transparent' }}>
                    <td style={{ padding: '12px 10px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--primary-gold)' }}>
                      {s.id}
                    </td>
                    <td style={{ padding: '12px 10px', fontWeight: 600, color: '#ffffff' }}>
                      {s.material}
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{s.supplier}</div>
                    </td>
                    <td style={{ padding: '12px 10px', color: '#cbd5e1' }}>
                      {s.origin} &rarr; {s.destination}
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#cbd5e1' }}>
                        {s.mode.includes('Air') ? <Plane size={13} style={{ color: '#60a5fa' }} /> : 
                         s.mode.includes('Maritime') ? <Ship size={13} style={{ color: '#f59e0b' }} /> : 
                         <Truck size={13} style={{ color: '#10b981' }} />}
                        {s.mode}
                      </span>
                    </td>
                    <td style={{ padding: '12px 10px', color: s.routeChokepoint.includes('None') ? '#64748b' : '#f87171', fontSize: '0.8rem' }}>
                      {s.routeChokepoint}
                    </td>
                    <td style={{ padding: '12px 10px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: statusColor }}>
                      +{s.predictedDelay}d
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      <span style={{
                        background: `${statusColor}22`,
                        border: `1px solid ${statusColor}`,
                        color: statusColor,
                        padding: '2px 8px',
                        fontSize: '0.72rem',
                        fontWeight: 700
                      }}>
                        {s.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                      {s.mitigated ? (
                        <span style={{ color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}>
                          <CheckCircle2 size={14} /> Airlift Active
                        </span>
                      ) : s.status === 'CRITICAL_DELAY' ? (
                        <button 
                          className="execution-btn"
                          onClick={() => handleMitigateShipment(s.id, s.material)}
                          style={{ borderColor: 'var(--primary-gold)', color: 'var(--primary-gold)', padding: '5px 12px', fontSize: '0.75rem' }}
                        >
                          Dispatch Military Airlift
                        </button>
                      ) : (
                        <span style={{ color: '#64748b', fontSize: '0.78rem' }}>Buffer Intact</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
