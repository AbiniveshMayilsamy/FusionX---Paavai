import React from 'react';
import { Leaf, Award, BarChart2, Globe, Flame } from 'lucide-react';

export function SustainabilityTab({ onGenerateEsgReport, onAssessSuppliers, onCalculateFootprint, userRole = 'viewer' }) {
  const isAdmin = userRole === 'admin';
  return (
    <div className="tab-content">
      <h2>
        <Leaf size={22} style={{ color: '#10b981' }} />
        Sustainability & ESG Assessment
      </h2>

      <div style={{
        background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.25) 0%, rgba(13, 148, 136, 0.2) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.4)',
        borderRadius: '16px',
        padding: '24px',
        margin: '20px 0'
      }}>
        <h3 style={{ color: '#34d399', fontSize: '1.35rem', marginBottom: '16px' }}>
          Overall Supply Chain Sustainability Score: 78 / 100 (High Grade)
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <strong>♻️ Environmental (E)</strong>
              <span style={{ color: '#34d399', fontWeight: 700 }}>85%</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: '85%', background: '#10b981' }}></div>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '0.82rem', marginTop: '6px' }}>Carbon footprint & clean energy</p>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <strong> Social (S)</strong>
              <span style={{ color: '#fbbf24', fontWeight: 700 }}>70%</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: '70%', background: '#f59e0b' }}></div>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '0.82rem', marginTop: '6px' }}>Fair labor & ethical sourcing</p>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <strong>️ Governance (G)</strong>
              <span style={{ color: '#38bdf8', fontWeight: 700 }}>90%</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: '90%', background: '#0284c7' }}></div>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '0.82rem', marginTop: '6px' }}>Transparency & trade compliance</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', margin: '20px 0' }}>
        <div className="card" style={{ marginBottom: 0 }}>
          <h3 style={{ fontSize: '1.15rem' }}> ESG Analytics & Auditing</h3>
          <p style={{ color: '#cbd5e1', fontSize: '0.88rem', margin: '10px 0' }}>
            Run continuous ESG compliance evaluations across all sub-tier suppliers.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button className="btn" onClick={onGenerateEsgReport} disabled={!isAdmin} style={{ background: isAdmin ? 'linear-gradient(135deg, #059669, #10b981)' : 'rgba(255,255,255,0.06)', color: '#fff', cursor: isAdmin ? 'pointer' : 'not-allowed', opacity: isAdmin ? 1 : 0.5 }}>
               Generate Comprehensive ESG Report
            </button>
            <button className="btn btn-secondary" onClick={onAssessSuppliers} disabled={!isAdmin} style={{ cursor: isAdmin ? 'pointer' : 'not-allowed', opacity: isAdmin ? 1 : 0.5 }}>
               Assess All Supplier Audits
            </button>
            {!isAdmin && (
              <p style={{ fontSize: '0.78rem', color: '#f59e0b', fontFamily: 'var(--font-mono)' }}>
                ⚠ ESG actions require Admin clearance.
              </p>
            )}
          </div>
        </div>

        <div className="card" style={{ marginBottom: 0 }}>
          <h3 style={{ fontSize: '1.15rem' }}> Carbon Footprint Engine</h3>
          <p style={{ color: '#cbd5e1', fontSize: '0.9rem', margin: '8px 0' }}>
            <strong>Annual Emissions:</strong> 2,847 tons CO2e<br />
            <strong>2030 Reduction Goal:</strong> 45% Net Reduction
          </p>
          <button className="btn" onClick={onCalculateFootprint} disabled={!isAdmin} style={{ background: isAdmin ? 'linear-gradient(135deg, #0d9488, #14b8a6)' : 'rgba(255,255,255,0.06)', color: '#fff', cursor: isAdmin ? 'pointer' : 'not-allowed', opacity: isAdmin ? 1 : 0.5 }}>
             Calculate Footprint & Offsets
          </button>
        </div>

        <div className="card" style={{ marginBottom: 0 }}>
          <h3 style={{ fontSize: '1.15rem' }}> Decarbonization Targets</h3>
          <ul style={{ color: '#cbd5e1', fontSize: '0.88rem', paddingLeft: '20px', lineHeight: 1.8 }}>
            <li>Net Zero Supply Chain by 2030</li>
            <li>100% Renewable energy for Tier 1</li>
            <li>Conflict-mineral free certification</li>
            <li>Circular economy recycling metrics</li>
          </ul>
        </div>
      </div>

      <div className="recommendation-item">
        <h4> Key AI ESG Action Directives</h4>
        <p>• Prioritize suppliers with verified renewable solar/wind energy installations.</p>
        <p>• Execute automated carbon offset routing for long-distance maritime freight.</p>
        <p>• Require tier-level ESG disclosure token for smart contract payment unlock.</p>
      </div>
    </div>
  );
}
