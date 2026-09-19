import React from 'react';
import { BarChart3, AlertOctagon, ShieldAlert, Globe2, Activity } from 'lucide-react';

export function RiskAnalysisTab({ suppliers }) {
  const totalCount = suppliers.length;
  const highRiskCount = suppliers.filter((s) => s.risk === 'Critical' || s.risk_score >= 0.7).length;
  const mediumRiskCount = suppliers.filter((s) => s.risk === 'Medium' || (s.risk_score >= 0.4 && s.risk_score < 0.7)).length;
  const overallRiskScore = 72; // percentage

  return (
    <div className="tab-content">
      <h2>
        <BarChart3 size={22} style={{ color: 'var(--primary-gold)' }} />
        Advanced Risk Assessment Dashboard
      </h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{totalCount}</div>
          <div className="stat-label">Total Suppliers</div>
        </div>

        <div className="stat-card">
          <div className="stat-value" style={{ color: '#ef4444' }}>{highRiskCount}</div>
          <div className="stat-label">High Risk Suppliers</div>
        </div>

        <div className="stat-card">
          <div className="stat-value" style={{ color: '#f59e0b' }}>8</div>
          <div className="stat-label">Vulnerable Links</div>
        </div>

        <div className="stat-card">
          <div className="stat-value" style={{ color: '#fbbf24' }}>{overallRiskScore}%</div>
          <div className="stat-label">Overall Risk Score</div>
        </div>

        <div className="stat-card">
          <div className="stat-value" style={{ color: '#10b981' }}>95%</div>
          <div className="stat-label">Blockchain Verified</div>
        </div>

        <div className="stat-card">
          <div className="stat-value" style={{ color: '#60a5fa' }}>87%</div>
          <div className="stat-label">AI Confidence Level</div>
        </div>
      </div>

      <h3 style={{ color: 'var(--primary-gold)', marginTop: '24px', fontSize: '1.15rem' }}>
        Overall Supply Chain Threat Spectrum
      </h3>
      <div className="risk-meter">
        <div className="risk-indicator" style={{ left: `${overallRiskScore}%` }} title={`Risk Score: ${overallRiskScore}%`}></div>
      </div>

      <div className="geopolitical-risk">
        <h4>
          <Globe2 size={18} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
          Geopolitical & Logistics Risk Assessment
        </h4>
        <p><strong>Current Global Tensions:</strong> Medium Impact on Trans-Pacific & European freight corridors.</p>
        <p><strong>Trade Route Disruptions:</strong> 2 active maritime conflict zones affecting transit timelines.</p>
        <p><strong>Sanctions & Compliance:</strong> 3 regional suppliers monitored under export restriction watches.</p>
      </div>

      <div className="vulnerability-item">
        <h4>
          <AlertOctagon size={18} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
          Critical AI-Detected Vulnerability (Tier 3 Critical Path)
        </h4>
        <p><strong>Supplier:</strong> Rare Metals Co (China) - Tier 3</p>
        <p><strong>AI Risk Score:</strong> 94% (Extremely High)</p>
        <p><strong>Risk Factors:</strong> Single source rare-earth dependency, geopolitical export tariff risk, maritime choke points</p>
        <p><strong>Predicted Impact:</strong> Potential production halt within 30 days if disrupted</p>
        <p><strong>AI Recommendation:</strong> Immediate multi-sourcing onboarding in Australia & North America</p>
      </div>

      <div className="vulnerability-item" style={{ borderLeftColor: '#f59e0b', background: 'rgba(245, 158, 11, 0.08)' }}>
        <h4 style={{ color: '#fbbf24' }}>
          <ShieldAlert size={18} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
          Medium Risk Identified by AI Model (Tier 2 Semiconductor)
        </h4>
        <p><strong>Supplier:</strong> Precision Electronics Corp (Germany)</p>
        <p><strong>AI Risk Score:</strong> 67% (Medium-High)</p>
        <p><strong>Risk Factors:</strong> Energy price fluctuations, Euro currency volatility, lead-time extensions</p>
        <p><strong>Predicted Impact:</strong> 15-25% delivery delay exposure</p>
        <p><strong>AI Recommendation:</strong> Establish secondary European component distributor agreements</p>
      </div>
    </div>
  );
}
